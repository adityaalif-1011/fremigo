'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createPurchase } from '@/app/actions/checkout';
import '@/styles/checkout.css';

type CartProduct = {
  id: number;
  name: string;
  icon: string;
  price: number;
  seller: string;
  duration: string;
};

const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

export default function Checkout() {
  const router = useRouter();

  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      let ids: number[] = [];

      try {
        const raw = JSON.parse(localStorage.getItem('cart') || '[]');
        if (Array.isArray(raw)) {
          ids = raw
            .map((value) => Number(value))
            .filter((n) => Number.isFinite(n) && n > 0);
        }
      } catch {
        ids = [];
      }

      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('id, name, icon, price, seller, duration')
        .in('id', ids);

      if (fetchError) {
        setError(fetchError.message ?? 'Gagal memuat keranjang.');
      } else if (data) {
        setProducts(data as CartProduct[]);
      }

      setLoading(false);
    };

    load();
  }, []);

  const handlePay = async () => {
    if (products.length === 0 || paying) return;

    setPaying(true);
    setError(null);

    for (const product of products) {
      const res = await createPurchase(product.id);

      if (res.error) {
        setError(res.error);
        setPaying(false);
        return;
      }
    }

    localStorage.removeItem('cart');
    router.push('/riwayat');
  };

  const total = products.reduce((sum, p) => sum + p.price, 0);

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

          <button
            className="icon-btn"
            onClick={() => router.push('/katalog')}
          >
            🛍️
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
               PAGE TITLE
          ================================== */}

          <h1>
            Checkout
          </h1>


          {/* =================================
               CHECKOUT CONTENT
          ================================== */}

          <div className="checkout">


            {/* =================================
                 DATA PEMBELIAN
            ================================== */}

            <section className="panel">

              <h2>
                Data Pembelian
              </h2>


              {/* Nama */}
              <div className="field">

                <label>
                  Nama
                </label>

                <input
                  defaultValue="Rosa"
                  placeholder="Nama lengkap"
                />

              </div>


              {/* Email */}
              <div className="field">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  defaultValue="rosa@example.com"
                />

              </div>


              {/* Metode Pembayaran */}
              <div className="field">

                <label>
                  Metode Pembayaran
                </label>


                {/* E-Wallet */}
                <div className="pay-option selected">
                  💳 E-Wallet
                </div>


                {/* Virtual Account */}
                <div className="pay-option">
                  🏦 Virtual Account
                </div>


                {/* QRIS */}
                <div className="pay-option">
                  📱 QRIS
                </div>

              </div>


              {/* Notice */}
              <div className="notice">

                🔒 Transaksi demo.
                Sistem nyata perlu payment gateway
                dan verifikasi keamanan.

              </div>

            </section>


            {/* =================================
                 RINGKASAN PEMBELIAN
            ================================== */}

            <aside className="panel">

              <h2>
                Ringkasan
              </h2>


              {/* Summary diisi dari keranjang */}
              <div id="summary">
                {loading ? (
                  <p className="muted">
                    Memuat...
                  </p>
                ) : products.length === 0 ? (
                  <div className="empty" style={{ padding: '30px 10px' }}>
                    Keranjang kosong.

                    <div style={{ marginTop: 14 }}>
                      <Link className="btn btn-soft" href="/katalog">
                        Belanja dulu
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {products.map((p) => (
                      <div key={p.id} className="row">
                        <span>
                          {p.icon} {p.name}
                        </span>
                        <b>{rupiah(p.price)}</b>
                      </div>
                    ))}

                    <p className="muted">
                      Paket {products[0].duration} · Seller {products[0].seller}
                    </p>

                    <hr
                      style={{
                        border: 0,
                        borderTop: '1px solid var(--line)',
                      }}
                    />

                    <div className="row">
                      <b>Total</b>
                      <strong className="price">
                        {rupiah(total)}
                      </strong>
                    </div>
                  </>
                )}
              </div>


              {/* Error */}
              {error && (
                <p
                  style={{
                    color: '#d9534f',
                    textAlign: 'center',
                    marginTop: 14,
                  }}
                >
                  {error}
                </p>
              )}


              {/* Tombol Pembayaran */}
              <button
                id="pay"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '18px' }}
                onClick={handlePay}
                disabled={loading || paying || products.length === 0}
              >
                {paying ? 'Memproses...' : 'Bayar Sekarang'}
              </button>

            </aside>


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
