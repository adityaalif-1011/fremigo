'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import '@/styles/account.css';

type Notif = {
  id: number | string;
  title: string;
  message: string;
  type: string;
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

const typeIcon = (type: string) => {
  if (type === 'reward') return '🎁';
  if (type === 'payment') return '✓';
  return '🔔';
};

export default function Notifications() {
  const router = useRouter();

  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('notifications')
        .select('id, title, message, type, is_read, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!cancelled) {
        setItems((data as Notif[]) ?? []);
        setLoading(false);
      }

      channel = supabase
        .channel('notifs')
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

            setItems((prev) =>
              prev.some((n) => String(n.id) === String(incoming.id))
                ? prev
                : [incoming, ...prev],
            );
          },
        )
        .subscribe();
    };

    init();

    return () => {
      cancelled = true;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [router]);

  return (
    <>
      {/* =================================
           HEADER / TOPBAR
      ================================== */}

      <header className="topbar">

        {/* Logo */}
        <Link className="logo" href="/">
          pre<span>migo</span>.id
        </Link>


        {/* Top Actions */}
        <div className="top-actions">

          {/* Tombol Beranda */}
          <button
            className="icon-btn"
            onClick={() => router.push('/')}
          >
            🏠
          </button>

        </div>

      </header>


      {/* =================================
           MAIN CONTENT
      ================================== */}

      <main
        className="main"
        style={{
          marginLeft: 0,
          width: '100%',
        }}
      >

        <div className="container">


          {/* =================================
               PAGE TITLE
          ================================== */}

          <h1>
            Notifikasi
          </h1>

          <p className="muted">
            Pengingat masa langganan, transaksi, dan reward.
          </p>


          {/* =================================
               NOTIFICATION LIST
          ================================== */}

          <div
            id="notifList"
            className="section"
          >
            {loading ? (
              <p className="muted">
                Memuat...
              </p>
            ) : items.length === 0 ? (
              <div className="empty">
                Belum ada notifikasi.
              </div>
            ) : (
              items.map((n) => (
                <div
                  key={String(n.id)}
                  className={`notification${n.is_read ? '' : ' unread'}`}
                >
                  <div style={{ fontSize: '25px' }}>
                    {typeIcon(n.type)}
                  </div>

                  <div>
                    <b>
                      {n.title}
                    </b>

                    <p className="muted">
                      {n.message}
                    </p>

                    <small className="muted">
                      {timeAgo(n.created_at)}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </main>
    </>
  );
}
