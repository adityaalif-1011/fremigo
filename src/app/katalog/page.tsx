'use client';

import Link from 'next/link';
import '@/styles/catalog.css';

export default function Katalog() {
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
            id="q"
            placeholder="Cari nama aplikasi..."
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


          {/* Tombol Login */}
          <button
            className="icon-btn"
            onClick={() => {}}
          >
            👤
          </button>

        </div>

      </header>


      {/* =================================
           LAYOUT
      ================================== */}

      <div className="layout">


        {/* =================================
             SIDEBAR
        ================================== */}

        <aside className="sidebar">

          {/* Beranda */}
          <Link
            className="side-link"
            href="/"
          >
            🏠
            <span>
              Beranda
            </span>
          </Link>


          {/* Katalog */}
          <Link
            className="side-link active"
            href="/katalog"
          >
            🛍️
            <span>
              Katalog
            </span>
          </Link>


          {/* Bandingkan */}
          <Link
            className="side-link"
            href="/compare"
          >
            ⚖️
            <span>
              Bandingkan
            </span>
          </Link>


          {/* Riwayat */}
          <Link
            className="side-link"
            href="/riwayat"
          >
            🧾
            <span>
              Riwayat
            </span>
          </Link>


          {/* Notifikasi */}
          <Link
            className="side-link"
            href="/notifications"
          >
            🔔
            <span>
              Notifikasi
            </span>
          </Link>


          {/* Poin Reward */}
          <Link
            className="side-link"
            href="/reward"
          >
            🎁
            <span>
              Poin Reward
            </span>
          </Link>


          {/* Seller Center */}
          <Link
            className="side-link"
            href="/seller"
          >
            🏪
            <span>
              Seller Center
            </span>
          </Link>

        </aside>


        {/* =================================
             MAIN CONTENT
        ================================== */}

        <main className="main">

          <div className="container">


            {/* =================================
                 CATALOG HEADER
            ================================== */}

            <div className="catalog-head">

              <div>

                <h1>
                  Semua Aplikasi Premium
                </h1>

                <p className="muted">
                  Temukan produk berdasarkan kebutuhanmu.
                </p>

              </div>


              {/* Jumlah Hasil */}
              <span
                id="count"
                className="result-count"
              />

            </div>


            {/* =================================
                 FILTER
            ================================== */}

            <div className="filters">


              {/* Filter Kategori */}
              <select id="cat">

                <option value="all">
                  Semua kategori
                </option>

                <option>
                  Desain
                </option>

                <option>
                  Music
                </option>

                <option>
                  Education
                </option>

                <option>
                  Produktivitas
                </option>

                <option>
                  Entertainment
                </option>

                <option>
                  Storage
                </option>

              </select>


              {/* Filter Harga */}
              <select id="price">

                <option value="100000">
                  Semua harga
                </option>

                <option value="40000">
                  ≤ Rp40.000
                </option>

                <option value="50000">
                  ≤ Rp50.000
                </option>

                <option value="60000">
                  ≤ Rp60.000
                </option>

                <option value="70000">
                  ≤ Rp70.000
                </option>

              </select>


              {/* Filter Rating */}
              <select id="ratingFilter">

                <option value="0">
                  Semua rating
                </option>

                <option value="4.5">
                  ★ 4.5+
                </option>

                <option value="4.8">
                  ★ 4.8+
                </option>

              </select>


              {/* Tombol Reset Filter */}
              <button
                className="btn btn-soft"
                onClick={() => {}}
              >
                Reset Filter
              </button>

            </div>


            {/* =================================
                 PRODUCT GRID
            ================================== */}

            <div
              id="productGrid"
              className="grid"
            >
              {/* TODO: replace with Supabase data */}
              {/* Product 1: Canva Pro */}
              <article className="card">
                <Link href="/produk/1">
                  <div className="app-cover">
                    <span>🎨</span>
                    <span className="stock">
                      Sisa 8
                    </span>
                  </div>
                </Link>

                <div className="card-body">
                  <div
                    className="muted"
                    style={{ fontSize: '12px' }}
                  >
                    Desain
                  </div>

                  <p className="card-title">
                    Canva Pro
                  </p>

                  <div className="rating">
                    ★ 4.9
                    <span className="muted">
                      · 30 hari
                    </span>
                  </div>

                  <p>
                    <span className="price">
                      Rp45.000
                    </span>
                    <span className="old">
                      Rp65.000
                    </span>
                  </p>

                  <div className="card-actions">
                    <button
                      className="btn btn-soft"
                      onClick={() => {}}
                    >
                      Bandingkan
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {}}
                    >
                      Beli
                    </button>
                  </div>
                </div>
              </article>

              {/* Product 2: Spotify Premium */}
              <article className="card">
                <Link href="/produk/2">
                  <div className="app-cover">
                    <span>🎵</span>
                    <span className="stock">
                      Sisa 12
                    </span>
                  </div>
                </Link>

                <div className="card-body">
                  <div
                    className="muted"
                    style={{ fontSize: '12px' }}
                  >
                    Music
                  </div>

                  <p className="card-title">
                    Spotify Premium
                  </p>

                  <div className="rating">
                    ★ 4.8
                    <span className="muted">
                      · 30 hari
                    </span>
                  </div>

                  <p>
                    <span className="price">
                      Rp35.000
                    </span>
                    <span className="old">
                      Rp50.000
                    </span>
                  </p>

                  <div className="card-actions">
                    <button
                      className="btn btn-soft"
                      onClick={() => {}}
                    >
                      Bandingkan
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {}}
                    >
                      Beli
                    </button>
                  </div>
                </div>
              </article>

              {/* Product 3: Duolingo Super */}
              <article className="card">
                <Link href="/produk/3">
                  <div className="app-cover">
                    <span>🦉</span>
                    <span className="stock">
                      Sisa 5
                    </span>
                  </div>
                </Link>

                <div className="card-body">
                  <div
                    className="muted"
                    style={{ fontSize: '12px' }}
                  >
                    Education
                  </div>

                  <p className="card-title">
                    Duolingo Super
                  </p>

                  <div className="rating">
                    ★ 4.8
                    <span className="muted">
                      · 30 hari
                    </span>
                  </div>

                  <p>
                    <span className="price">
                      Rp39.000
                    </span>
                    <span className="old">
                      Rp55.000
                    </span>
                  </p>

                  <div className="card-actions">
                    <button
                      className="btn btn-soft"
                      onClick={() => {}}
                    >
                      Bandingkan
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {}}
                    >
                      Beli
                    </button>
                  </div>
                </div>
              </article>

              {/* Product 4: Zoom Pro */}
              <article className="card">
                <Link href="/produk/4">
                  <div className="app-cover">
                    <span>📹</span>
                    <span className="stock">
                      Sisa 5
                    </span>
                  </div>
                </Link>

                <div className="card-body">
                  <div
                    className="muted"
                    style={{ fontSize: '12px' }}
                  >
                    Produktivitas
                  </div>

                  <p className="card-title">
                    Zoom Pro
                  </p>

                  <div className="rating">
                    ★ 4.7
                    <span className="muted">
                      · 30 hari
                    </span>
                  </div>

                  <p>
                    <span className="price">
                      Rp52.000
                    </span>
                    <span className="old">
                      Rp70.000
                    </span>
                  </p>

                  <div className="card-actions">
                    <button
                      className="btn btn-soft"
                      onClick={() => {}}
                    >
                      Bandingkan
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {}}
                    >
                      Beli
                    </button>
                  </div>
                </div>
              </article>

            </div>

          </div>

        </main>

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