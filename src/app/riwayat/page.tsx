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

const isActive = (p: Purchase, now: number) =>
  p.status === 'active' && new Date(p.expires_at).getTime() > now;

const daysLeft = (p: Purchase, now: number) =>
  Math.ceil((new Date(p.expires_at).getTime() - now) / 86400000);

export default function Riwayat() {
  const router = useRouter();

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(0);

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
            'id, purchased_at, expires_at, status, products(name, icon, duration)',
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
      <header className="topbar">

        <Link className="logo" href="/">
          pre<span>migo</span>.id
        </Link>

        <div className="top-actions">

          <button
            className="icon-btn"
            onClick={() => router.push('/notifications')}
          >
            🔔
          </button>

          <button
            className="icon-btn"
            onClick={() => router.push('/')}
          >
            🏠
          </button>

        </div>

      </header>


      <div className="layout">

        <aside className="sidebar">

          <Link
            className="side-link"
            href="/"
          >
            🏠
            <span>
              Beranda
            </span>
          </Link>

          <Link
            className="side-link"
            href="/katalog"
          >
            🛍️
            <span>
              Katalog
            </span>
          </Link>

          <Link
            className="side-link active"
            href="/riwayat"
          >
            🧾
            <span>
              Riwayat
            </span>
          </Link>

          <Link
            className="side-link"
            href="/notifications"
          >
            🔔
            <span>
              Notifikasi
            </span>
          </Link>

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


        <main className="main">

          <div className="container">

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
                    </tr>

                  </thead>


                  <tbody id="orders">

                    {loading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="muted"
                          style={{ textAlign: 'center' }}
                        >
                          Memuat riwayat...
                        </td>
                      </tr>
                    ) : purchases.length === 0 ? (
                      <tr>
                        <td colSpan={5}>
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
                        const left = daysLeft(p, now);
                        const product = productOf(p);

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
                                  color: '#fff',
                                  background: active
                                    ? 'var(--green-dark)'
                                    : '#d9534f',
                                }}
                              >
                                {active ? 'Aktif' : 'Berakhir'}
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
                          </tr>
                        );
                      })
                    )}

                  </tbody>

                </table>

              </div>

            </section>


            <section className="section">

              <div className="notice">
                🔔 Sistem akan mengirim pengingat H-3 sebelum masa premium berakhir.
              </div>

            </section>

          </div>

        </main>

      </div>
    </>
  );
}
