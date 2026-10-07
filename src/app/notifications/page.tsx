'use client';

import Link from 'next/link';
import '@/styles/account.css';

export default function Notifications() {
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
            onClick={() => {}}
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
            {/* TODO: replace with Supabase realtime */}
            <div className="notification unread">
              <div style={{ fontSize: '25px' }}>
                🔔
              </div>

              <div>
                <b>
                  Canva Pro akan berakhir dalam 3 hari.
                </b>

                <p className="muted">
                  Perpanjang agar akses premium tetap aktif.
                </p>

                <small className="muted">
                  Baru saja
                </small>
              </div>
            </div>

            <div className="notification unread">
              <div style={{ fontSize: '25px' }}>
                🎁
              </div>

              <div>
                <b>
                  Kamu mendapatkan 120 poin reward.
                </b>

                <p className="muted">
                  Poin dapat dikumpulkan dan ditukar sesuai syarat.
                </p>

                <small className="muted">
                  Baru saja
                </small>
              </div>
            </div>

            <div className="notification">
              <div style={{ fontSize: '25px' }}>
                ✓
              </div>

              <div>
                <b>
                  Pembayaran pesanan #PM-28174 berhasil.
                </b>

                <p className="muted">
                  Akses premium sudah diproses.
                </p>

                <small className="muted">
                  Baru saja
                </small>
              </div>
            </div>
          </div>

        </div>

      </main>
    </>
  );
}
