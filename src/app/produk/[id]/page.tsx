'use client';

import Link from 'next/link';
import '@/styles/detail.css';

export default function ProdukDetail() {
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

        {/* Search */}
        <div className="search">

          <span className="search-icon">
            ⌕
          </span>

          <input
            placeholder="Cari aplikasi..."
            onClick={() => {}}
          />

        </div>


        {/* Top Actions */}
        <div className="top-actions">

          {/* Tombol Bandingkan */}
          <button
            className="icon-btn"
            onClick={() => {}}
          >
            ⚖️
          </button>


          {/* Tombol Keranjang */}
          <button
            className="icon-btn"
            onClick={() => {}}
          >
            🛒
          </button>

        </div>

      </header>


      {/* =================================
           MAIN CONTENT
      ================================== */}

      <main
        className="main"
        style={{ marginLeft: 0, width: '100%' }}
      >

        <div className="container">


          {/* =================================
               BACK TO CATALOG
          ================================== */}

          <p>

            <Link
              href="/katalog"
              className="muted"
            >
              ← Kembali ke katalog
            </Link>

          </p>


          {/* =================================
               DETAIL PRODUK
          ================================== */}

          <div
            id="detail"
            className="detail"
          >
            {/* TODO: replace with Supabase */}
            <div className="detail-cover">
              🎨
            </div>

            <div className="detail-info">
              <div className="muted">
                Desain · Seller terverifikasi ✓
              </div>

              <h1>Canva Pro</h1>

              <div className="rating">
                ★ 4.9 / 5 · 8 stok tersedia
              </div>

              <p className="muted">
                Akses premium resmi dengan informasi paket,
                durasi, aktivasi, dan bantuan yang ditampilkan
                secara transparan.
              </p>

              <div className="package-list">
                <div
                  className="package active"
                  data-price="45000"
                >
                  <b>1 Bulan</b>
                  <br />
                  <span className="price">
                    Rp45.000
                  </span>
                </div>

                <div
                  className="package"
                  data-price="135000"
                >
                  <b>3 Bulan</b>
                  <br />
                  <span className="price">
                    Rp121.500
                  </span>
                </div>

                <div
                  className="package"
                  data-price="540000"
                >
                  <b>1 Tahun</b>
                  <br />
                  <span className="price">
                    Rp432.000
                  </span>
                </div>
              </div>

              <div
                className="checklist"
                style={{ margin: '20px 0' }}
              >
                <div>
                  ✓ Template premium
                </div>

                <div>
                  ✓ Magic Resize
                </div>

                <div>
                  ✓ Background Remover
                </div>

                <div>
                  ✓ Aktivasi terpandu
                </div>

                <div>
                  ✓ Garansi bantuan
                </div>
              </div>

              <div className="row">
                <strong
                  id="selectedPrice"
                  className="price"
                >
                  Rp45.000
                </strong>

                <button
                  className="btn btn-primary"
                  id="buy"
                >
                  Beli Sekarang
                </button>
              </div>

              <div
                className="notice"
                style={{ marginTop: '16px' }}
              >
                🔔 Pengingat otomatis dikirim H-3 sebelum masa
                premium berakhir.
              </div>
            </div>
          </div>


          {/* =================================
               REVIEW PRODUK
          ================================== */}

          <section
            id="reviews"
            className="section"
          >
            <h2>Review Pembeli</h2>

            <div className="review">
              <b>★★★★★</b>

              <p>
                Informasinya jelas dan proses pembelian lebih praktis.
              </p>

              <small className="muted">
                Pembeli terverifikasi
              </small>
            </div>

            <div className="review">
              <b>★★★★☆</b>

              <p>
                Harga dan durasi mudah dibandingkan sebelum membeli.
              </p>

              <small className="muted">
                Pembeli terverifikasi
              </small>
            </div>
          </section>


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
