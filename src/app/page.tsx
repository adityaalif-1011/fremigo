'use client';

import Link from 'next/link';
import '@/styles/home.css';

export default function Home() {
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
            onClick={() => {}}
          />
        </div>

        <div className="top-actions">

          <button
            className="icon-btn badge"
            data-badge="2"
            onClick={() => {}}
          >
            🔔
          </button>

          <button
            className="icon-btn"
            onClick={() => {}}
          >
            🛒
          </button>

          <button
            className="icon-btn"
            onClick={() => {}}
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
            className="side-link active"
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
            href="/compare"
          >
            ⚖️
            <span>Bandingkan</span>
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

          <Link
            className="side-link"
            href="/seller"
          >
            🏪
            <span>Seller Center</span>
          </Link>

        </aside>


        {/* ==============================
             MAIN CONTENT
        =============================== */}
        <main className="main">

          <div className="container">


            {/* ==============================
                 HERO SECTION
            =============================== */}
            <section className="hero">

              <div>

                <div
                  className="chip active"
                  style={{ display: 'inline-block' }}
                >
                  Marketplace aplikasi premium
                </div>

                <h1>
                  Premium jadi lebih
                  <span style={{ color: 'var(--pink-dark)' }}>
                    mudah & nyaman.
                  </span>
                </h1>

                <p>
                  Cari, bandingkan, beli, dan pantau masa
                  berlangganan aplikasi premium dalam satu
                  platform. Informasi harga, durasi, fitur,
                  review, dan bantuan ditampilkan secara jelas.
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() => {}}
                >
                  Jelajahi Aplikasi →
                </button>

                <button
                  className="btn btn-outline"
                  onClick={() => {}}
                >
                  Bandingkan Produk
                </button>

              </div>


              {/* HERO ART */}
              <div className="hero-art">

                <div className="orb">
                  📱
                </div>

              </div>

            </section>


            {/* ==============================
                 FEATURE SECTION
            =============================== */}
            <section className="section">

              <div className="feature-strip">


                {/* Feature 1 */}
                <div className="feature">

                  <div className="ico">
                    🔎
                  </div>

                  <h3>
                    Search & Filter
                  </h3>

                  <p className="muted">
                    Cari berdasarkan nama, kategori,
                    harga, rating, dan durasi.
                  </p>

                </div>


                {/* Feature 2 */}
                <div className="feature">

                  <div className="ico">
                    ⚖️
                  </div>

                  <h3>
                    Perbandingan
                  </h3>

                  <p className="muted">
                    Bandingkan paket dan harga
                    sebelum membeli.
                  </p>

                </div>


                {/* Feature 3 */}
                <div className="feature">

                  <div className="ico">
                    🔔
                  </div>

                  <h3>
                    Pengingat H-3
                  </h3>

                  <p className="muted">
                    Dapatkan notifikasi sebelum
                    masa premium berakhir.
                  </p>

                </div>

              </div>

            </section>


            {/* ==============================
                 POPULAR APPLICATION SECTION
            =============================== */}
            <section className="section">

              <div className="section-head">

                <div>

                  <h2>
                    Aplikasi Populer
                  </h2>

                  <p className="muted">
                    Pilihan untuk belajar, bekerja,
                    desain, dan hiburan.
                  </p>

                </div>

                <Link
                  className="btn btn-soft"
                  href="/katalog"
                >
                  Lihat semua
                </Link>

              </div>


              {/* Product Grid */}
              <div
                id="popularGrid"
                className="grid"
              />

            </section>


            {/* ==============================
                 PROMO / BUNDLE SECTION
            =============================== */}
            <section className="section">

              <div className="promo">

                <div>

                  <h2 style={{ margin: '0 0 5px' }}>
                    Paket Mahasiswa
                  </h2>

                  <div>
                    Bundling hemat untuk kebutuhan
                    kuliah & produktivitas.
                  </div>

                </div>

                <button
                  id="bundleBtn"
                  className="btn"
                >
                  Lihat Paket
                </button>

              </div>

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