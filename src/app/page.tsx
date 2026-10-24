'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BuyerIcons, BuyerSidebar, BuyerTopbar } from '@/components/BuyerChrome';
import PageTransition from '@/components/PageTransition';
import '@/styles/home.css';

export default function Home() {
  const router = useRouter();
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

          <PageTransition>

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

              </div>


              {/* HERO ART */}
              <div className="hero-art">

                <div className="orb">
                  <svg
                    width="96"
                    height="96"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="7" y="2" width="10" height="20" rx="2" />
                    <path d="M11 18h2" />
                  </svg>
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
                    {BuyerIcons.search}
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
                    {BuyerIcons.scale}
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
                    {BuyerIcons.bell}
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

          </PageTransition>

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