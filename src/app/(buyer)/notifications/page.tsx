'use client';

import { useEffect, useState, type ReactNode } from 'react';
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

const typeIcon = (type: string): ReactNode => {
  const iconProps = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (type === 'reward') {
    return (
      <svg {...iconProps}>
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M5 12v9h14v-9M12 8v13" />
        <path d="M12 8s-4-.5-4-2.8A1.9 1.9 0 0 1 12 3.8 1.9 1.9 0 0 1 16 5.2C16 7.5 12 8 12 8Z" />
      </svg>
    );
  }

  if (type === 'payment') {
    return (
      <svg {...iconProps}>
        <path d="M4.5 12.5 9 17l10.5-10.5" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2.5 2.5 0 0 0 4 0" />
    </svg>
  );
};

export default function Notifications() {
  const router = useRouter();

  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Unique channel name per effect run: prevents the
    // "cannot add postgres_changes callbacks after subscribe()"
    // error when React Strict Mode mounts the effect twice.
    const channelName = `notifs-${Date.now()}`;

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

      if (cancelled) return;

      setItems((data as Notif[]) ?? []);
      setLoading(false);

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

    // Always clean up before the effect re-runs or the page unmounts.
    return () => {
      cancelled = true;
      if (channel) {
        supabase.removeChannel(channel);
        channel = null;
      }
    };
  }, [router]);

  return (
    <>


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
              <div
                style={{
                  color: n.is_read ? 'var(--muted)' : 'var(--pink-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  paddingTop: 2,
                }}
              >
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


    </>
  );
}
