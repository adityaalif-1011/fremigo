'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type PurchaseRow = {
  id: number | string;
  price_paid: number;
  status: string;
  purchased_at: string;
  products: { name: string } | { name: string }[] | null;
};

type RecentPurchase = {
  id: number | string;
  purchased_at: string;
  price_paid: number;
  status: string;
  product_name: string;
};

const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const productNameOf = (p: PurchaseRow) => {
  const info = Array.isArray(p.products) ? p.products[0] : p.products;
  return info?.name ?? '-';
};

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const statIcons = {
  wallet: (
    <svg {...iconProps}>
      <path d="M20 7V6a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6" />
      <path d="M16 12h.01" />
    </svg>
  ),
  receipt: (
    <svg {...iconProps}>
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z" />
      <path d="M9 7h6M9 11h6" />
    </svg>
  ),
  users: (
    <svg {...iconProps}>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21c0-3.5 3-5.5 7-5.5s7 2 7 5.5" />
      <path d="M16 4.5a4 4 0 0 1 0 7" />
      <path d="M18.5 15.5c2 .8 3.5 2.3 3.5 4.5" />
    </svg>
  ),
  bag: (
    <svg {...iconProps}>
      <path d="M6 7h12l1 13H5L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  ),
};

export default function AdminOverviewPage() {
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalTransactions, setTotalTransactions] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalSold, setTotalSold] = useState<number | null>(null);
  const [recent, setRecent] = useState<RecentPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const init = async () => {
      const [purchasesRes, usersRes, recentRes] = await Promise.all([
        supabase.from('purchases').select('price_paid, status'),
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('purchases')
          .select('id, purchased_at, price_paid, status, products(name)')
          .order('purchased_at', { ascending: false })
          .limit(5),
      ]);

      if (purchasesRes.error) {
        setError(purchasesRes.error.message);
        setLoading(false);
        return;
      }

      const rows = (purchasesRes.data ?? []) as {
        price_paid: number;
        status: string;
      }[];

      const active = rows.filter(r => r.status === 'active');

      setTotalRevenue(active.reduce((sum, r) => sum + (r.price_paid ?? 0), 0));
      setTotalTransactions(rows.length);
      setTotalSold(active.length);
      setTotalUsers(usersRes.count ?? 0);

      if (recentRes.error) {
        setError(recentRes.error.message);
      } else {
        setRecent(
          ((recentRes.data ?? []) as PurchaseRow[]).map(p => ({
            id: p.id,
            purchased_at: p.purchased_at,
            price_paid: p.price_paid,
            status: p.status,
            product_name: productNameOf(p),
          })),
        );
      }

      setLoading(false);
    };

    init();
  }, []);

  const stats = [
    {
      label: 'Total Pendapatan',
      value: totalRevenue === null ? '—' : rupiah(totalRevenue),
      icon: statIcons.wallet,
    },
    {
      label: 'Total Transaksi',
      value: totalTransactions === null ? '—' : totalTransactions.toLocaleString('id-ID'),
      icon: statIcons.receipt,
    },
    {
      label: 'Total Pengguna',
      value: totalUsers === null ? '—' : totalUsers.toLocaleString('id-ID'),
      icon: statIcons.users,
    },
    {
      label: 'Produk Terjual',
      value: totalSold === null ? '—' : totalSold.toLocaleString('id-ID'),
      icon: statIcons.bag,
    },
  ];

  return (
    <div className="section">

      {/* ==============================
           PAGE HEADING
      =============================== */}
      <div className="section-head">
        <h2>Overview Dashboard</h2>
      </div>


      {/* Error */}
      {error && (
        <div className="notice" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}


      {loading ? (

        <p className="muted">
          Memuat data...
        </p>

      ) : (
        <>


          {/* ==============================
               STAT CARDS
          =============================== */}
          <div
            className="stats"
            style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
          >

            {stats.map(s => (
              <div className="stat" key={s.label}>

                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'var(--green-soft)',
                    color: 'var(--green-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {s.icon}
                </div>

                <span className="muted" style={{ fontSize: 13 }}>
                  {s.label}
                </span>

                <strong>{s.value}</strong>

              </div>
            ))}

          </div>


          {/* ==============================
               RECENT TRANSACTIONS
          =============================== */}
          <div className="section">

            <div className="section-head">

              <h2 style={{ fontSize: 20 }}>
                Transaksi Terakhir
              </h2>

              <Link className="btn btn-soft" href="/admin/laporan">
                Lihat Laporan
              </Link>

            </div>

            <div className="table-wrap">

              <table className="table">

                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Produk</th>
                    <th>Jumlah</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {recent.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="empty">
                        Belum ada transaksi.
                      </td>
                    </tr>
                  ) : (
                    recent.map(t => (
                      <tr key={t.id}>
                        <td>{fmtDate(t.purchased_at)}</td>
                        <td>{t.product_name}</td>
                        <td>{rupiah(t.price_paid)}</td>
                        <td style={{ textTransform: 'capitalize' }}>{t.status}</td>
                      </tr>
                    ))
                  )}

                </tbody>

              </table>

            </div>

          </div>


        </>
      )}

    </div>
  );
}
