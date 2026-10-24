'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import '@/styles/account.css';

export default function Reward() {
  const router = useRouter();

  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Unique channel name per effect run: prevents the
    // "cannot add postgres_changes callbacks after subscribe()"
    // error when React Strict Mode mounts the effect twice.
    const channelName = `points-${Date.now()}`;

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
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) return;

      setPoints(data?.points ?? 0);

      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            if (!cancelled) {
              setPoints(payload.new.points);
            }
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
        Poin Reward
      </h1>


      {/* =================================
           POINTS BALANCE
      ================================== */}

      <div className="points">

        <div className="muted">
          Saldo poin kamu
        </div>

        <h2
          style={{
            fontSize: '42px',
            margin: '5px 0',
          }}
        >
          {points === null
            ? '—'
            : `${points.toLocaleString('id-ID')} poin`}
        </h2>

        <p>
          260 poin lagi menuju voucher premium.
        </p>


        {/* Progress Bar */}
        <div className="progress">

          <span />

        </div>

      </div>


      {/* =================================
           REWARD SECTION
      ================================== */}

      <section className="section">

        <h2>
          Tukar Reward
        </h2>


        <div className="grid">


          {/* =================================
               REWARD 1
          ================================== */}

          <div className="card">

            <div className="card-body">

              <h3>
                Voucher Rp10.000
              </h3>

              <p className="muted">
                1.000 poin
              </p>

              <button
                className="btn btn-primary redeem"
              >
                Tukar Poin
              </button>

            </div>

          </div>


          {/* =================================
               REWARD 2
          ================================== */}

          <div className="card">

            <div className="card-body">

              <h3>
                1 Bulan Music
              </h3>

              <p className="muted">
                1.500 poin
              </p>

              <button
                className="btn btn-primary redeem"
              >
                Tukar Poin
              </button>

            </div>

          </div>


          {/* =================================
               REWARD 3
          ================================== */}

          <div className="card">

            <div className="card-body">

              <h3>
                1 Bulan Education
              </h3>

              <p className="muted">
                1.800 poin
              </p>

              <button
                className="btn btn-primary redeem"
              >
                Tukar Poin
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* =================================
           REWARD NOTICE
      ================================== */}

      <div
        className="notice section"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >

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
          style={{ flexShrink: 0 }}
        >
          <rect x="3" y="8" width="18" height="4" rx="1" />
          <path d="M5 12v9h14v-9M12 8v13" />
          <path d="M12 8s-4-.5-4-2.8A1.9 1.9 0 0 1 12 3.8 1.9 1.9 0 0 1 16 5.2C16 7.5 12 8 12 8Z" />
        </svg>

        Poin diperoleh setelah transaksi selesai dan
        dapat ditukarkan dengan aplikasi premium tertentu
        sesuai syarat & ketentuan.

      </div>


      {/* =================================
           TOAST NOTIFICATION
      ================================== */}

      <div
        id="toast"
        className="toast"
      />

    </>
  );
}
