'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import '@/styles/account.css';

export default function Reward() {
  const router = useRouter();

  const [points, setPoints] = useState<number | null>(null);

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
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .maybeSingle();

      if (!cancelled) {
        setPoints(data?.points ?? 0);
      }

      channel = supabase
        .channel('points')
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

          <div className="notice section">

            🎁 Poin diperoleh setelah transaksi selesai dan
            dapat ditukarkan dengan aplikasi premium tertentu
            sesuai syarat & ketentuan.

          </div>

        </div>

      </main>


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
