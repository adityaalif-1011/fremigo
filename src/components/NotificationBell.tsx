'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createClient } from '@/lib/supabase/client';

type Notif = {
  id: number | string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const timeAgo = (value: string) => {
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000);

  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.floor(hours / 24);
  return days < 30 ? `${days} hari lalu` : fmtDate(value);
};

const bellIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
    <path d="M10 20a2.5 2.5 0 0 0 4 0" />
  </svg>
);

export default function NotificationBell() {
  const [items, setItems] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userIdRef = useRef<string | null>(null);

  // Memastikan komponen hanya render di client (mencegah error SSR Next.js)
   useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  /* ==============================
       FETCH + REALTIME
  =============================== */
  useEffect(() => {
    const supabase = createClient();

    const channelName = `notif-bell-${Date.now()}`;

    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      userIdRef.current = user.id;

      const [listRes, countRes] = await Promise.all([
        supabase
          .from('notifications')
          .select('id, title, message, is_read, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('notifications')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false),
      ]);

      if (cancelled) return;

      if (!listRes.error) {
        setItems((listRes.data as Notif[]) ?? []);
      }
      if (!countRes.error) {
        setUnread(countRes.count ?? 0);
      }

      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (cancelled) return;

            const incoming = payload.new as Notif;

            setItems(prev =>
              prev
                .some(n => String(n.id) === String(incoming.id))
                  ? prev
                  : [incoming, ...prev].slice(0, 5),
            );

            if (!incoming.is_read) {
              setUnread(prev => prev + 1);
            }
          },
        )
        .subscribe();
    };

    init();

    return () => {
      cancelled = true;
      if (channel) {
        supabase.removeChannel(channel);
        channel = null;
      }
    };
  }, []);


  /* ==============================
       CLOSE ON OUTSIDE CLICK
  =============================== */
  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Mengecek apakah klik terjadi di luar lonceng DAN di luar popup
      if (
        containerRef.current && !containerRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open]);


  /* ==============================
       MARK ALL AS READ
  =============================== */
  const markAllRead = async () => {
    if (unread === 0 || !userIdRef.current) return;

    const supabase = createClient();

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userIdRef.current)
      .eq('is_read', false);

    if (!error) {
      setUnread(0);
      setItems(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };


  return (
    <div ref={containerRef} style={{ position: 'relative' }}>

      {/* ==============================
           BELL BUTTON
      =============================== */}
      <button
        className="icon-btn"
        aria-label="Notifikasi"
        onClick={() => setOpen(prev => !prev)}
        style={unread > 0 ? { borderColor: '#f4c2cc', background: 'var(--pink-soft)' } : undefined}
      >
        {bellIcon}

        {unread > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -5,
              right: -5,
              background: '#e8495f',
              color: '#fff',
              fontSize: 10,
              fontWeight: 800,
              lineHeight: 1,
              borderRadius: 999,
              padding: '4px 6px',
              minWidth: 18,
              textAlign: 'center',
            }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>


      {/* ==============================
           DROPDOWN (MENGGUNAKAN PORTAL)
      =============================== */}
      {mounted && open && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: 80,
            right: 20,
            width: 320,
            maxWidth: '90vw',
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 12,
            boxShadow: '0 10px 30px rgba(16, 24, 40, .12)',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >

          {/* Dropdown head */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <b style={{ fontSize: 14 }}>Notifikasi</b>

            <button
              onClick={markAllRead}
              disabled={unread === 0}
              style={{
                border: 0,
                background: 'transparent',
                color: unread === 0 ? 'var(--muted)' : 'var(--green-dark)',
                fontSize: 12,
                fontWeight: 800,
                cursor: unread === 0 ? 'default' : 'pointer',
                padding: 0,
              }}
            >
              Tandai semua dibaca
            </button>
          </div>


          {/* Notification list */}
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>

            {items.length === 0 ? (
              <div
                className="muted"
                style={{ padding: '24px 14px', textAlign: 'center', fontSize: 13 }}
              >
                Belum ada notifikasi.
              </div>
            ) : (
              items.map(n => (
                <div
                  key={String(n.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    padding: '12px 14px',
                    borderBottom: '1px solid var(--line)',
                    background: n.is_read ? '#fff' : 'var(--pink-soft)',
                  }}
                >
                  <b style={{ fontSize: 13 }}>
                    {n.title}
                  </b>

                  <span
                    className="muted"
                    style={{ fontSize: 12, lineHeight: 1.5 }}
                  >
                    {n.message}
                  </span>

                  <span className="muted" style={{ fontSize: 11 }}>
                    {timeAgo(n.created_at)}
                  </span>
                </div>
              ))
            )}

          </div>

        </div>,
        document.body // Popup ditempel langsung ke body agar tidak terpotong
      )}

    </div>
  );
}