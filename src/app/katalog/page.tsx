'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import '@/styles/catalog.css';

type Product = {
  id: number;
  name: string;
  cat: string;
  icon: string;
  price: number;
  old: number | null;
  duration: string;
  rating: number;
  stock: number;
  features: string[];
  seller: string | null;
};

const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

export default function Katalog() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from('products')
      .select('*')
      .order('id')
      .then(({ data }) => {
        setProducts((data as Product[]) ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter((p) => {
    const matchQ = q === '' || p.name.toLowerCase().includes(q.toLowerCase());
    const matchCat = cat === 'all' || p.cat === cat;
    const matchPrice = p.price <= maxPrice;
    const matchRating = p.rating >= minRating;
    return matchQ && matchCat && matchPrice && matchRating;
  });

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
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

        </div>


        {/* Top Actions */}
        <div className="top-actions">

          {/* Tombol Keranjang */}
          <button
            className="icon-btn"
            onClick={() => router.push('/checkout')}
          >
            🛒
          </button>


          {/* Tombol Login */}
          <button
            className="icon-btn"
            onClick={() => router.push('/account')}
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
              >
                Menampilkan {filtered.length} dari {products.length} produk
              </span>

            </div>


            {/* =================================
                 FILTER
            ================================== */}

            <div className="filters">


              {/* Filter Kategori */}
              <select
                id="cat"
                value={cat}
                onChange={(e) => setCat(e.target.value)}
              >

                <option value="all">
                  Semua kategori
                </option>

                <option value="Desain">
                  Desain
                </option>

                <option value="Music">
                  Music
                </option>

                <option value="Education">
                  Education
                </option>

                <option value="Produktivitas">
                  Produktivitas
                </option>

                <option value="Entertainment">
                  Entertainment
                </option>

                <option value="Storage">
                  Storage
                </option>

              </select>


              {/* Filter Harga */}
              <select
                id="price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              >

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
              <select
                id="ratingFilter"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
              >

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
                onClick={() => {
                  setQ('');
                  setCat('all');
                  setMaxPrice(100000);
                  setMinRating(0);
                }}
              >
                Reset Filter
              </button>

            </div>


            {/* =================================
                 PRODUCT GRID
            ================================== */}

            <div id="productGrid">

              {loading ? (
                <p>
                  Memuat produk...
                </p>
              ) : filtered.length === 0 ? (
                <p>
                  Belum ada produk yang cocok dengan filter.
                </p>
              ) : (
                <div className="grid">

                  {filtered.map((p) => (
                    <article
                      className="card"
                      key={p.id}
                    >
                      <Link href={`/produk/${p.id}`}>
                        <div className="app-cover">
                          <span>
                            {p.icon}
                          </span>

                          <span className="stock">
                            Sisa {p.stock}
                          </span>
                        </div>
                      </Link>

                      <div className="card-body">
                        <div
                          className="muted"
                          style={{ fontSize: '12px' }}
                        >
                          {p.cat}
                        </div>

                        <p className="card-title">
                          {p.name}
                        </p>

                        <div className="rating">
                          ★ {p.rating}
                          <span className="muted">
                            · {p.duration}
                          </span>
                        </div>

                        <p>
                          <span className="price">
                            {rupiah(p.price)}
                          </span>

                          {p.old && (
                            <span className="old">
                              {rupiah(p.old)}
                            </span>
                          )}
                        </p>

                        <div className="card-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              localStorage.setItem(
                                'cart',
                                JSON.stringify([p.id]),
                              );
                              router.push('/checkout');
                            }}
                          >
                            Beli
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}

                </div>
              )}

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
