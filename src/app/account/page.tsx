'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
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
      <header className="topbar">

        <Link className="logo" href="/">
          pre<span>migo</span>.id
        </Link>

        <div className="search">
          <span className="search-icon">⌕</span>

          <input
            placeholder="Cari aplikasi, paket, atau transaksi..."
            onClick={() => router.push('/katalog')}
          />
        </div>

        <div className="top-actions">

          <button
            className="icon-btn badge"
            data-badge="2"
            onClick={() => router.push('/notifications')}
          >
            🔔
          </button>

          <button
            className="icon-btn"
            onClick={() => router.push('/checkout')}
          >
            🛒
          </button>

          <button
            className="icon-btn"
            onClick={() => router.push('/account')}
          >
            👤
          </button>

        </div>

      </header>


      {/* ==============================
           LAYOUT
      =============================== */}
      <div className="layout">


        {/* ==============================
             SIDEBAR
        =============================== */}
        <aside className="sidebar">

          <Link
            className="side-link"
            href="/"
          >
            🏠
            <span>Beranda</span>
          </Link>

          <Link
            className="side-link"
            href="/katalog"
          >
            🛍️
            <span>Katalog</span>
          </Link>

          <Link
            className="side-link"
            href="/riwayat"
          >
            🧾
            <span>Riwayat</span>
          </Link>

          <Link
            className="side-link"
            href="/notifications"
          >
            🔔
            <span>Notifikasi</span>
          </Link>

          <Link
            className="side-link"
            href="/reward"
          >
            🎁
            <span>Poin Reward</span>
          </Link>

        </aside>


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
                        fontSize: 32,
                      }}
                    >
                      👤
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
