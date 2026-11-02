'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import '@/styles/account.css';

type ProductInfo = {
  name: string;
  icon: string;
  duration: string;
};

type Purchase = {
  id: number | string;
  purchased_at: string;
  expires_at: string;
  status: string;
  account_details: string | null;
  payment_proof_url: string | null;
  products: ProductInfo | ProductInfo[] | null;
};

const productOf = (p: Purchase) =>
  Array.isArray(p.products) ? (p.products[0] ?? null) : p.products;

const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

// "Berakhir" hanya jika masa berlakunya sudah lewat.
const isEnded = (p: Purchase, now: number) =>
  new Date(p.expires_at).getTime() < now;

// Akun aktif = status aktif dan belum lewat masa berlaku.
const isActive = (p: Purchase, now: number) =>
  p.status === 'active' && !isEnded(p, now);

const daysLeft = (p: Purchase, now: number) =>
  Math.ceil((new Date(p.expires_at).getTime() - now) / 86400000);

const statusLabel = (status: string) => {
  if (status === 'pending') return 'Menunggu Pembayaran';
  if (status === 'active') return 'Aktif';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Badge untuk pesanan yang masih menunggu pembayaran manual.
const pendingBadge = (p: Purchase) =>
  p.payment_proof_url
    ? { label: 'Menunggu Verifikasi', color: '#7a5300', background: '#fde68a' }
    : { label: 'Belum Bayar', color: '#fff', background: '#d9534f' };

export default function Riwayat() {
  const router = useRouter();

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(0);
  const [accountModal, setAccountModal] = useState<{
    id: string;
    details: string;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const [purchaseRes, profileRes] = await Promise.all([
        supabase
          .from('purchases')
          .select(
            'id, purchased_at, expires_at, status, account_details, payment_proof_url, products(name, icon, duration)',
          )
          .eq('user_id', user.id)
          .order('purchased_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('points')
          .eq('id', user.id)
          .maybeSingle(),
      ]);

      setPurchases((purchaseRes.data as Purchase[]) ?? []);
      setPoints(profileRes.data?.points ?? 0);
      setNow(Date.now());
      setLoading(false);
    };

    load();
  }, [router]);

  const activeList = purchases.filter((p) => isActive(p, now));
  const nearestDays = activeList.length
    ? Math.min(...activeList.map((p) => daysLeft(p, now)))
    : null;

  return (
    <>

      <h1>
        Riwayat Pesanan
      </h1>


      <div className="stats">

        <div className="stat">
          Pesanan
          <strong>
            {loading ? '—' : purchases.length}
          </strong>
        </div>

        <div className="stat">
          Aktif
          <strong>
            {loading ? '—' : activeList.length}
          </strong>
        </div>

        <div className="stat">
          Poin
          <strong>
            {loading ? '—' : points.toLocaleString('id-ID')}
          </strong>
        </div>

        <div className="stat">
          Berakhir terdekat
          <strong>
            {nearestDays === null ? '—' : `${nearestDays} hari`}
          </strong>
        </div>

      </div>


      <section className="section">

        <div className="table-wrap">

          <table className="table">

            <thead>

              <tr>
                <th>
                  ID
                </th>

                <th>
                  Produk
                </th>

                <th>
                  Durasi
                </th>

                <th>
                  Tanggal
                </th>

                <th>
                  Status
                </th>

                <th>
                  Akun Premium
                </th>
              </tr>

            </thead>


            <tbody id="orders">

              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="muted"
                    style={{ textAlign: 'center' }}
                  >
                    Memuat riwayat...
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty">
                      Belum ada pembelian.

                      <div style={{ marginTop: 14 }}>
                        <Link className="btn btn-soft" href="/katalog">
                          Belanja dulu
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                purchases.map((p) => {
                  const active = isActive(p, now);
                  const ended = isEnded(p, now);
                  const left = daysLeft(p, now);
                  const product = productOf(p);
                  const details = p.account_details;

                  // Pending manual payment selalu ditampilkan lebih dulu.
                  const badge = active
                    ? { label: 'Aktif', color: '#fff', background: 'var(--green-dark)' }
                    : p.status === 'pending'
                      ? pendingBadge(p)
                      : ended
                        ? { label: 'Berakhir', color: '#fff', background: '#d9534f' }
                        : {
                            label: statusLabel(p.status),
                            color: '#25352f',
                            background: '#e3ebe7',
                          };

                  return (
                    <tr key={String(p.id)}>
                      <td>
                        #{String(p.id)}
                      </td>

                      <td>
                        {product?.icon} {product?.name}
                      </td>

                      <td>
                        {product?.duration}
                      </td>

                      <td>
                        {fmtDate(p.purchased_at)}

                        <br />

                        <small className="muted">
                          s/d {fmtDate(p.expires_at)}
                        </small>
                      </td>

                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 800,
                            color: badge.color,
                            background: badge.background,
                          }}
                        >
                          {badge.label}
                        </span>

                        {active && (
                          <>
                            {' '}
                            <span className="muted">
                              {left} hari lagi
                            </span>
                          </>
                        )}
                      </td>

                      <td>
                        {details ? (
                          <button
                            className="btn btn-soft"
                            onClick={() =>
                              setAccountModal({
                                id: String(p.id),
                                details,
                              })
                            }
                          >
                            Lihat Akun
                          </button>
                        ) : (
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              fontWeight: 800,
                              color: '#7a5300',
                              background: '#fde68a',
                            }}
                          >
                            Menunggu Pengiriman
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>

      </section>


      <section className="section">

        <div
          className="notice"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
            <path d="M10 20a2.5 2.5 0 0 0 4 0" />
          </svg>
          Sistem akan mengirim pengingat H-3 sebelum masa premium berakhir.
        </div>

      </section>


      {/* =================================
           MODAL — DETAIL AKUN PREMIUM
      ================================== */}

      {accountModal && (
        <div
          className="modal show"
          role="dialog"
          aria-modal="true"
          aria-label="Detail Akun Premium"
        >
          <div className="modal-box">

            <button
              className="close"
              onClick={() => setAccountModal(null)}
              aria-label="Tutup"
            >
              ×
            </button>

            <h2 style={{ margin: '0 0 6px' }}>
              Akun Premium
            </h2>

            <p className="muted" style={{ marginTop: 0 }}>
              Pesanan #{accountModal.id}
            </p>

            <pre
              style={{
                margin: 0,
                padding: 14,
                background: '#f4f6f5',
                borderRadius: 12,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'monospace',
                fontSize: 14,
              }}
            >
              {accountModal.details}
            </pre>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 20,
              }}
            >
              <button
                className="btn btn-primary"
                onClick={() => setAccountModal(null)}
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
}
