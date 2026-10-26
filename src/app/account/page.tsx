'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

                <div style={{ maxWidth: 800 }}>
                  <div className="profile-card">
                    Loading...
                  </div>
                </div>

              ) : (

                <div style={{ maxWidth: 800 }}>


                  {/* =================================
                       TWO-COLUMN PROFILE GRID
                  ================================== */}
                  <div className="profile-grid">


                    {/* ==============================
                         LEFT: IDENTITY
                    =============================== */}
                    <div
                      className="profile-card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >

                      {/* Avatar */}
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: 'var(--pink-soft)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--pink-dark)',
                          margin: '0 auto',
                        }}
                      >
                        <svg
                          width="38"
                          height="38"
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
                      <h3
                        style={{
                          margin: '14px 0 2px',
                          fontSize: 20,
                          textAlign: 'center',
                        }}
                      >
                        {username}
                      </h3>

                      <div
                        className="muted"
                        style={{ textAlign: 'center', fontSize: 14 }}
                      >
                        {email}
                      </div>


                      {/* Divider */}
                      <hr
                        style={{
                          border: 0,
                          borderTop: '1px solid var(--line)',
                          margin: '20px 0',
                        }}
                      />


                      {/* Logout */}
                      <button
                        className="btn"
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          background: '#d6455c',
                          color: '#fff',
                        }}
                      >
                        Keluar
                      </button>

                    </div>


                    {/* ==============================
                         RIGHT: DETAILS
                    =============================== */}
                    <div
                      className="profile-card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20,
                      }}
                    >


                      {/* ==============================
                           POIN REWARD
                      =============================== */}
                      <div>

                        <div className="muted" style={{ fontSize: 13 }}>
                          Poin Reward
                        </div>

                        <div style={{ fontSize: 24, fontWeight: 800, margin: '4px 0' }}>
                          {points.toLocaleString('id-ID')}
                        </div>

                        <div className="muted" style={{ fontSize: 13 }}>
                          Tukarkan poin dengan voucher premium dan reward menarik.
                        </div>

                      </div>


                      {/* Divider */}
                      <hr
                        style={{
                          border: 0,
                          borderTop: '1px solid var(--line)',
                          margin: 0,
                        }}
                      />


                      {/* ==============================
                           STATUS
                      =============================== */}
                      <div>

                        <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
                          Status
                        </div>

                        <span
                          style={{
                            display: 'inline-block',
                            background: 'var(--green-soft)',
                            color: 'var(--green-dark)',
                            padding: '5px 14px',
                            borderRadius: 999,
                            fontSize: 13,
                            fontWeight: 800,
                          }}
                        >
                          Member Aktif
                        </span>

                      </div>


                      {/* Divider */}
                      <hr
                        style={{
                          border: 0,
                          borderTop: '1px solid var(--line)',
                          margin: 0,
                        }}
                      />


                      {/* ==============================
                           SHORTCUT LINKS
                      =============================== */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 10,
                        }}
                      >

                        <Link
                          href="/riwayat"
                          className="btn btn-soft"
                          style={{ textAlign: 'center' }}
                        >
                          Lihat Riwayat Pembelian
                        </Link>

                        <Link
                          href="/notifications"
                          className="btn btn-outline"
                          style={{ textAlign: 'center' }}
                        >
                          Lihat Notifikasi
                        </Link>

                      </div>


                    </div>

                  </div>

                </div>

              )}

            </section>

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
