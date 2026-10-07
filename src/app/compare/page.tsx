'use client';

import Link from 'next/link';
import '@/styles/compare.css';

export default function Compare() {
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
               PAGE HEADER
          ================================== */}

          <div className="section-head">

            <div>

              <h1>
                Bandingkan Aplikasi
              </h1>

              <p className="muted">
                Lihat harga, durasi, kategori, seller,
                dan fitur secara berdampingan.
              </p>

            </div>


            {/* Tambah Produk */}
            <Link
              className="btn btn-soft"
              href="/katalog"
            >
              Tambah Produk
            </Link>

          </div>


          {/* =================================
               COMPARISON GRID
          ================================== */}

          <div
            id="compareGrid"
            className="compare-grid"
          >
            {/* TODO: replace with Supabase */}
            <div className="compare-item">
              <div className="compare-logo">
                🎨
              </div>

              <h2>Canva Pro</h2>

              <div className="rating">
                ★ 4.9
              </div>

              <div className="compare-row">
                <span>Harga</span>
                <b>Rp45.000</b>
              </div>

              <div className="compare-row">
                <span>Durasi</span>
                <b>30 hari</b>
              </div>

              <div className="compare-row">
                <span>Kategori</span>
                <b>Desain</b>
              </div>

              <div className="compare-row">
                <span>Seller</span>
                <b>PrimeStore</b>
              </div>

              <div className="compare-row">
                <span>Fitur</span>
                <b>3 fitur utama</b>
              </div>

              <button
                className="btn btn-primary"
                style={{ marginTop: '15px', width: '100%' }}
                onClick={() => {}}
              >
                Pilih Produk
              </button>
            </div>

            <div className="compare-item">
              <div className="compare-logo">
                🎵
              </div>

              <h2>Spotify Premium</h2>

              <div className="rating">
                ★ 4.8
              </div>

              <div className="compare-row">
                <span>Harga</span>
                <b>Rp35.000</b>
              </div>

              <div className="compare-row">
                <span>Durasi</span>
                <b>30 hari</b>
              </div>

              <div className="compare-row">
                <span>Kategori</span>
                <b>Music</b>
              </div>

              <div className="compare-row">
                <span>Seller</span>
                <b>SoundHub</b>
              </div>

              <div className="compare-row">
                <span>Fitur</span>
                <b>3 fitur utama</b>
              </div>

              <button
                className="btn btn-primary"
                style={{ marginTop: '15px', width: '100%' }}
                onClick={() => {}}
              >
                Pilih Produk
              </button>
            </div>
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
