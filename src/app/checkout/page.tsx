'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createManualPurchase } from '@/app/actions/checkout';
import { BuyerTopbar } from '@/components/BuyerChrome';
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

  const [product, setProduct] = useState<CartProduct | null>(null);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryEmail, setDeliveryEmail] = useState('');
  const [productLoading, setProductLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal pembayaran manual
  const [showPayModal, setShowPayModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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
        setDeliveryEmail(user.email ?? '');
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
        setProductLoading(false);
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

      setProductLoading(false);
    };

    load();
  }, []);

  const handlePay = () => {
    if (!product || loading) return;

    const recipient = deliveryEmail.trim();

    if (!recipient) {
      setError('Email penerima akun wajib diisi.');
      return;
    }

    setError(null);
    setFile(null);
    setShowPayModal(true);
  };

  const handleManualPay = async () => {
    if (!product || loading) return;

    if (!file) {
      setError('Bukti transfer wajib diunggah terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // 1. Upload bukti transfer ke Supabase Storage
      const path = `proof-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(path, file, { upsert: false });

      if (uploadError) {
        setError(uploadError.message || 'Gagal mengunggah bukti transfer.');
        setLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('payment-proofs').getPublicUrl(path);

      if (!publicUrl) {
        setError('Gagal mendapatkan URL bukti transfer.');
        setLoading(false);
        return;
      }

      // 2. Simpan pembelian manual
      const res = await createManualPurchase(
        product.id,
        deliveryEmail.trim(),
        publicUrl
      );

      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      // 3. Selesai -> ke riwayat
      localStorage.removeItem('cart');
      router.push('/riwayat');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.'
      );
      setLoading(false);
    }
  };

  return (
    <>

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
                Selesaikan pembayaran untuk melanjutkan
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
                {productLoading ? (
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


              {/* Email Penerima Akun */}
              <div className="field">

                <label htmlFor="delivery-email">
                  Email Penerima Akun
                </label>

                <input
                  id="delivery-email"
                  type="email"
                  value={deliveryEmail}
                  onChange={(e) => setDeliveryEmail(e.target.value)}
                  placeholder="email@contoh.com"
                />

              </div>


              {/* Tombol Pembayaran */}
              <button
                id="pay"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '18px' }}
                onClick={handlePay}
                disabled={productLoading || loading || !product}
              >
                Bayar
              </button>


              {/* Error, tepat di bawah tombol */}
              {error && !showPayModal && (
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
           MODAL — PEMBAYARAN MANUAL (QRIS)
      ================================== */}

      {showPayModal && product && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowPayModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}
            >
              ✕
            </button>

            <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Scan QRIS</h2>
            <p className="muted" style={{ marginBottom: '16px', fontSize: '14px' }}>
              {product.icon} {product.name} · Paket {product.duration}
            </p>

            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <strong>Total</strong>
              <strong style={{ color: 'var(--green-dark)', fontSize: '18px' }}>{rupiah(product.price)}</strong>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Scan QRIS di bawah</p>
              <div style={{ padding: '8px', background: '#f8f9fa', borderRadius: '12px', display: 'inline-block' }}>
                {/* GANTI DENGAN GAMBAR QRIS KAMU */}
                <img src="/qris-dummy.jpeg" alt="QRIS" style={{ width: '100%', maxWidth: '220px', height: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
              </div>
              <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>Pastikan nominal transfer sesuai.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Bukti Transfer</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>

            <button
              onClick={handleManualPay}
              disabled={!file || loading}
              style={{
                width: '100%', 
                padding: '14px', 
                background: 'var(--green-dark)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '8px', 
                fontWeight: 'bold', 
                cursor: (!file || loading) ? 'not-allowed' : 'pointer',
                opacity: (!file || loading) ? 0.7 : 1,
                marginTop: '16px'
              }}
            >
              {loading ? 'Mengirim...' : 'Saya Sudah Transfer'}
            </button>
          </div>
        </div>
      )}


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
