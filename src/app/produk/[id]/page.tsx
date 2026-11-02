'use client';

import {
  Suspense,
  useEffect,
  useState,
  type FormEvent,
} from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BuyerTopbar } from '@/components/BuyerChrome';
import '@/styles/detail.css';

// --- Tipe Data ---
type Review = {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: { username: string | null } | { username: string | null }[] | null;
};

type Product = {
  id: number;
  name: string;
  cat: string;
  icon: string;
  price: number;
  image_url: string | null;
  description: string | null;
  duration: string;
  rating: number;
  stock: number;
  features: string[] | null;
};

// --- Helper ---
const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

const reviewName = (profiles: Review['profiles']) => {
  const profile = Array.isArray(profiles) ? profiles[0] : profiles;
  return profile?.username ?? 'Pembeli';
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(
    new Date(iso),
  );

const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);


function ProdukDetailContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Fetch Product & Reviews
  useEffect(() => {
    const supabase = createClient();
    
    // Ambil data produk
    supabase.from('products').select('*').eq('id', productId).single().then(({ data }) => {
      if (data) setProduct(data as Product);
    });

    // Ambil ulasan
    supabase
      .from('reviews')
      .select('*, profiles(username)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReviews((data as Review[]) ?? []);
        setLoadingReviews(false);
      });
  }, [productId]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSubmitting(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setFormError('Silakan login terlebih dahulu untuk mengulas produk.');
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      product_id: productId,
      rating,
      comment,
    });

    if (error) {
      if (error.code === '23505' || error.message.toLowerCase().includes('duplicate')) {
        setFormError('Anda sudah mengulas produk ini.');
      } else {
        setFormError(error.message);
      }
      setSubmitting(false);
      return;
    }

    setComment('');
    setRating(5);
    setFormSuccess('Terima kasih! Ulasan Anda berhasil dikirim.');
    setSubmitting(false);
    
    // Refresh ulasan setelah submit
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(username)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    setReviews((data as Review[]) ?? []);
  };

  if (!product) {
    return <p style={{ padding: 40, textAlign: 'center' }}>Memuat produk...</p>;
  }

  return (
    <>
      <BuyerTopbar
        search={{
          placeholder: 'Cari aplikasi...',
          onClick: () => router.push('/katalog'),
        }}
      />

      <main className="main" style={{ marginLeft: 0, width: '100%' }}>
        <div className="container">
          <p>
            <Link href="/katalog" className="muted">
              ← Kembali ke katalog
            </Link>
          </p>

          <div id="detail" className="detail">
            <div className="detail-cover" style={{ overflow: 'hidden', padding: 0 }}>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ fontSize: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  {product.icon}
                </div>
              )}
            </div>

            <div className="detail-info">
              <div className="muted">
                {product.cat} · Seller terverifikasi ✓
              </div>

              <h1>{product.name}</h1>

              <div className="rating">
                ★ {avgRating !== null ? avgRating.toFixed(1) : product.rating} / 5
                <span className="muted">
                  {' '}· {reviews.length} ulasan · {product.stock} stok tersedia
                </span>
              </div>

              <p className="muted">
                {product.description || 'Akses premium resmi dengan informasi paket, durasi, aktivasi, dan bantuan yang ditampilkan secara transparan.'}
              </p>

              <div className="package-list">
                <div className="package active">
                  <b>{product.duration}</b>
                  <br />
                  <span className="price">{rupiah(product.price)}</span>
                </div>
              </div>

              <div className="checklist" style={{ margin: '20px 0' }}>
                {product.features && product.features.map((f: string, i: number) => (
                  <div key={i}>✓ {f}</div>
                ))}
              </div>

              <div className="row">
                <strong className="price">{rupiah(product.price)}</strong>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    localStorage.setItem('cart', JSON.stringify([product.id]));
                    router.push('/checkout');
                  }}
                >
                  Beli Sekarang
                </button>
              </div>

              <div className="notice" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
                  <path d="M10 20a2.5 2.5 0 0 0 4 0" />
                </svg>
                Pengingat otomatis dikirim H-3 sebelum masa premium berakhir.
              </div>
            </div>
          </div>

          <section id="reviewForm" className="section">
            <h2>Tulis Ulasan</h2>
            <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', maxWidth: '640px' }}>
              <div className="field">
                <label>Rating</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '28px', padding: 0, color: n <= rating ? '#f5b301' : '#d8d8d8' }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label htmlFor="reviewComment">Komentar</label>
                <textarea
                  id="reviewComment"
                  required
                  placeholder="Ceritakan pengalamanmu..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              {formError && <p style={{ color: '#d33', margin: '0 0 12px' }}>{formError}</p>}
              {formSuccess && <p style={{ color: 'var(--green)', margin: '0 0 12px' }}>{formSuccess}</p>}

              <button className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </form>
          </section>

          <section id="reviews" className="section">
            <h2>Review Pembeli</h2>
            {loadingReviews ? (
              <p className="muted">Memuat ulasan...</p>
            ) : reviews.length === 0 ? (
              <p className="muted">Belum ada ulasan untuk produk ini.</p>
            ) : (
              reviews.map((r) => (
                <div className="review" key={r.id}>
                  <b>{stars(r.rating)}</b>
                  {r.comment && <p>{r.comment}</p>}
                  <small className="muted">
                    {reviewName(r.profiles)} · {formatDate(r.created_at)}
                  </small>
                </div>
              ))
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default function ProdukDetail() {
  return (
    <Suspense fallback={<p style={{ padding: 40, textAlign: 'center' }}>Memuat produk...</p>}>
      <ProdukDetailContent />
    </Suspense>
  );
}