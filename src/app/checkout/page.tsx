'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { createClient } from '@/lib/supabase/client';
import { createMidtransTransaction } from '@/app/actions/checkout';
import { BuyerTopbar } from '@/components/BuyerChrome';
import '@/styles/checkout.css';

type SnapCallbacks = {
  onSuccess?: () => void;
  onPending?: () => void;
  onError?: () => void;
  onClose?: () => void;
};

declare global {
  interface Window {
    snap: {
      pay: (token: string, callbacks: SnapCallbacks) => void;
    };
  }
}

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

  const [product, setProduct] = useState<CartProduct | null>(null);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();

      // Profil user untuk field Data Pembelian
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const fallbackName = user.email?.split('@')[0] ?? 'User';

        setEmail(user.email ?? '');
        // Fallback langsung agar input tidak stuck "Memuat..."
        setNama(fallbackName);

        try {
          const profileQuery = supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();

          // Batas waktu: jika terlalu lama, pakai fallback
          const timeout = new Promise<null>((resolve) =>
            setTimeout(() => resolve(null), 5000)
          );

          const result = await Promise.race([profileQuery, timeout]);
          const username = result?.data?.username;

          if (username) {
            setNama(username);
          }
        } catch {
          // Profile gagal diambil -> fallback sudah terpasang
        }
      } else {
        setNama('User');
      }

      // Produk dari keranjang (hanya 1 produk)
      let firstId: number | null = null;

      try {
        const raw = JSON.parse(localStorage.getItem('cart') || '[]');
        if (Array.isArray(raw)) {
          firstId =
            raw
              .map((value) => Number(value))
              .find((n) => Number.isFinite(n) && n > 0) ?? null;
        }
      } catch {
        firstId = null;
      }

      if (firstId === null) {
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('id, name, icon, price, seller, duration')
        .eq('id', firstId)
        .single();

      if (fetchError) {
        setError(fetchError.message ?? 'Gagal memuat keranjang.');
      } else if (data) {
        setProduct(data as CartProduct);
      }

      setLoading(false);
    };

    load();
  }, []);

  const handlePay = async () => {
    if (!product || paying) return;

    setPaying(true);
    setError(null);

    // Pastikan Midtrans Snap sudah dimuat
    if (typeof window.snap === 'undefined') {
      setError(
        'Halaman pembayaran Midtrans belum siap. Muat ulang halaman dan coba lagi.'
      );
      setPaying(false);
      return;
    }

    let res: Awaited<ReturnType<typeof createMidtransTransaction>>;

    try {
      res = await createMidtransTransaction(product.id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan. Coba lagi.'
      );
      setPaying(false);
      return;
    }

    if (res.error) {
      // Tampilkan pesan error asli dari server
      setError(res.error);
      setPaying(false);
      return;
    }

    if (!res.token) {
      setError('Gagal membuat transaksi pembayaran.');
      setPaying(false);
      return;
    }

    window.snap.pay(res.token, {
      onSuccess: () => {
        localStorage.removeItem('cart');
        router.push('/riwayat');
      },
      onPending: () => {
        localStorage.removeItem('cart');
        router.push('/riwayat?status=pending');
      },
      onError: () => {
        setError('Pembayaran gagal. Silakan coba lagi.');
        setPaying(false);
      },
      onClose: () => {
        setPaying(false);
      },
    });
  };

  return (
    <>

      {/* =================================
           MIDTRANS SNAP
      ================================== */}

      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      {/* =================================
           HEADER / TOPBAR
      ================================== */}

      <BuyerTopbar />


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
                  value={nama}
                  readOnly
                  placeholder="Nama"
                />

              </div>


              {/* Email */}
              <div className="field">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  readOnly
                  placeholder="email@contoh.com"
                />

              </div>


              {/* Info pembayaran */}
              <p
                className="muted"
                style={{ marginTop: 14 }}
              >
                Metode pembayaran (e-wallet, virtual account, QRIS, dll.)
                dipilih langsung di popup Midtrans saat menekan tombol bayar.
              </p>

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
                ) : !product ? (
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
                    <div className="row">
                      <span>
                        {product.icon} {product.name}
                      </span>
                      <b>{rupiah(product.price)}</b>
                    </div>

                    <p className="muted">
                      Paket {product.duration} · Seller {product.seller}
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
                        {rupiah(product.price)}
                      </strong>
                    </div>
                  </>
                )}
              </div>


              {/* Tombol Pembayaran */}
              <button
                id="pay"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '18px' }}
                onClick={handlePay}
                disabled={loading || paying || !product}
              >
                {paying ? 'Memproses...' : 'Bayar Sekarang'}
              </button>


              {/* Error, tepat di bawah tombol */}
              {error && (
                <p
                  role="alert"
                  style={{
                    color: '#d9534f',
                    textAlign: 'center',
                    marginTop: 12,
                    fontWeight: 600,
                  }}
                >
                  {error}
                </p>
              )}

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
