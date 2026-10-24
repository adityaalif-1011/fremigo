'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { BuyerSidebar, BuyerTopbar } from '@/components/BuyerChrome';
import PageTransition from '@/components/PageTransition';
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

const gridContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
} as const;

const gridItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
};

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

      <BuyerTopbar
        search={{
          placeholder: 'Cari nama aplikasi...',
          value: q,
          onChange: setQ,
        }}
      />


      {/* =================================
           LAYOUT
      ================================== */}

      <div className="layout">


        {/* =================================
             SIDEBAR
        ================================== */}

        <BuyerSidebar />


        {/* =================================
             MAIN CONTENT
        ================================== */}

        <main className="main">

          <PageTransition>

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
                <motion.div
                  className="grid"
                  variants={gridContainer}
                  initial="hidden"
                  animate="show"
                >

                  {filtered.map((p) => (
                    <motion.article
                      className="card"
                      key={p.id}
                      variants={gridItem}
                      whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                      transition={{ duration: 0.2 }}
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
                    </motion.article>
                  ))}

                </motion.div>
              )}

            </div>

          </div>

          </PageTransition>

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
