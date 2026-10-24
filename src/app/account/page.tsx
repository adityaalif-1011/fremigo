'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BuyerSidebar, BuyerTopbar } from '@/components/BuyerChrome';
import '@/styles/home.css';

export default function Account() {
  const router = useRouter();

  const [username, setUsername] = useState('User');
  const [email, setEmail] = useState('');
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setEmail(user.email ?? '');

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, points')
        .eq('id', user.id)
        .single();

      setUsername(profile?.username ?? 'User');
      setPoints(profile?.points ?? 0);
      setLoading(false);
    };

    load();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <>
      {/* ==============================
           HEADER / TOPBAR
      =============================== */}
      <BuyerTopbar
        search={{
          placeholder: 'Cari aplikasi, paket, atau transaksi...',
          onClick: () => router.push('/katalog'),
        }}
      />


      {/* ==============================
           LAYOUT
      =============================== */}
      <div className="layout">


        {/* ==============================
             SIDEBAR
        =============================== */}
        <BuyerSidebar />


        {/* ==============================
             MAIN CONTENT
        =============================== */}
        <main className="main">

          <div className="container">


            {/* ==============================
                 PROFILE SECTION
            =============================== */}
            <section className="section">

              <div className="section-head">

                <div>

                  <h2>
                    Profil Saya
                  </h2>

                  <p className="muted">
                    Kelola akun dan lihat poin reward kamu.
                  </p>

                </div>

              </div>


              {loading ? (

                <div className="card">
                  <div className="card-body">
                    Loading...
                  </div>
                </div>

              ) : (

                <div className="card">
                  <div className="card-body">

                    {/* Avatar */}
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: 'var(--pink-soft)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--pink-dark)',
                      }}
                    >
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
                      </svg>
                    </div>


                    {/* Identity */}
                    <h3 style={{ margin: '14px 0 2px' }}>
                      {username}
                    </h3>

                    <div className="muted">
                      {email}
                    </div>


                    {/* Divider */}
                    <hr
                      style={{
                        border: 0,
                        borderTop: '1px solid #eee',
                        margin: '16px 0',
                      }}
                    />


                    {/* Details */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                      }}
                    >

                      <div className="row">
                        <span className="muted">
                          Poin Reward
                        </span>
                        <span>
                          {points}
                        </span>
                      </div>

                      <div className="row">
                        <span className="muted">
                          Status
                        </span>
                        <span>
                          Member Aktif
                        </span>
                      </div>

                      <button
                        className="btn btn-primary"
                        onClick={handleLogout}
                      >
                        Keluar
                      </button>

                    </div>

                  </div>
                </div>

              )}

            </section>


            {/* ==============================
                 FOOTER
            =============================== */}
            <footer className="footer">

              © 2026 Primogo.id ·
              Marketplace aplikasi premium ·
              Demo UI/UX

            </footer>

          </div>

        </main>

      </div>


      {/* ==============================
           TOAST NOTIFICATION
      =============================== */}
      <div
        id="toast"
        className="toast"
      />
    </>
  );
}
