'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { createClient } from '@/lib/supabase/client';

type ProductInfo = {
  name: string;
};

type Purchase = {
  id: number | string;
  purchased_at: string;
  price_paid: number;
  status: string;
  user_id: string;
  products: ProductInfo | ProductInfo[] | null;
};

const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

const compactRupiah = (n: number) =>
  'Rp' +
  new Intl.NumberFormat('id-ID', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);

const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const fmtDay = (d: Date) =>
  d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
  });

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const productNameOf = (p: Purchase) => {
  const info = Array.isArray(p.products) ? p.products[0] : p.products;
  return info?.name ?? '-';
};

// Dihitung saat fetch selesai (client), bukan saat prerender:
// Next.js memblokir pembacaan waktu saat ini (new Date()) saat render.
const buildDailyRevenue = (rows: Purchase[]) => {
  const revenueByDay = new Map<string, number>();

  rows.forEach(p => {
    if (p.status !== 'active') return;

    const purchasedAt = new Date(p.purchased_at);
    if (Number.isNaN(purchasedAt.getTime())) return;

    const key = dayKey(purchasedAt);
    revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + (p.price_paid ?? 0));
  });

  const today = new Date();
  const days: { label: string; revenue: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - i,
    );

    days.push({
      label: fmtDay(d),
      revenue: revenueByDay.get(dayKey(d)) ?? 0,
    });
  }

  return days;
};

export default function AdminLaporanPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<
    { label: string; revenue: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    const supabase = createClient();

    supabase
      .from('purchases')
      .select('id, purchased_at, price_paid, status, user_id, products(name)')
      .order('purchased_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError.message);
        } else {
          const rows = (data as Purchase[]) ?? [];
          setPurchases(rows);
          setDailyRevenue(buildDailyRevenue(rows));
          setError(null);
        }

        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);


  /* =================================
       SUMMARY
  ================================== */
  const activePurchases = purchases.filter(p => p.status === 'active');

  const totalRevenue = activePurchases.reduce(
    (sum, p) => sum + (p.price_paid ?? 0),
    0,
  );
  const totalTransactions = purchases.length;
  const totalSold = activePurchases.length;


  /* =================================
       LAST 10 TRANSACTIONS
  ================================== */
  const last10 = purchases.slice(0, 10);

  return (
    <div className="section">


      {/* =================================
           PAGE TITLE
      ================================== */}
      <div className="section-head">
        <h2>Laporan</h2>
      </div>


      {/* Error */}
      {error && (
        <div className="notice" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}


      {loading ? (

        <p className="muted">
          Memuat laporan...
        </p>

      ) : (
        <>


          {/* =================================
               SUMMARY CARDS
          ================================== */}
          <div
            className="stats"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
          >

            <div className="stat">
              <span className="muted">Total Pendapatan</span>
              <strong>{rupiah(totalRevenue)}</strong>
            </div>

            <div className="stat">
              <span className="muted">Total Transaksi</span>
              <strong>{totalTransactions.toLocaleString('id-ID')}</strong>
            </div>

            <div className="stat">
              <span className="muted">Total Produk Terjual</span>
              <strong>{totalSold.toLocaleString('id-ID')}</strong>
            </div>

          </div>


          {/* =================================
               LINE CHART — DAILY REVENUE (7 DAYS)
          ================================== */}
          <div
            className="card"
            style={{ padding: 20, marginTop: 24 }}
          >

            <div
              className="row"
              style={{ marginBottom: 16 }}
            >
              <h3 style={{ margin: 0 }}>
                Pendapatan 7 Hari Terakhir
              </h3>

              <span className="muted" style={{ fontSize: 13 }}>
                Transaksi berstatus active
              </span>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={dailyRevenue}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e8eee9" />

                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  tickFormatter={(value: number) => compactRupiah(value)}
                  tick={{ fontSize: 12 }}
                  width={80}
                />

                <Tooltip
                  formatter={(value) => rupiah(Number(value))}
                  labelStyle={{ color: '#25352f' }}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Pendapatan"
                  stroke="#3d8f6d"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>


          {/* =================================
               LAST 10 TRANSACTIONS
          ================================== */}
          <div className="section">

            <div className="section-head">
              <h2 style={{ fontSize: 20 }}>
                10 Transaksi Terakhir
              </h2>
            </div>

            <div className="table-wrap">

              <table className="table">

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Product Name</th>
                    <th>Buyer ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {last10.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="empty">
                        Belum ada transaksi.
                      </td>
                    </tr>
                  ) : (
                    last10.map(p => (
                      <tr key={p.id}>
                        <td>{fmtDate(p.purchased_at)}</td>
                        <td>{productNameOf(p)}</td>
                        <td style={{ fontSize: 12, fontFamily: 'monospace' }}>
                          {p.user_id}
                        </td>
                        <td>{rupiah(p.price_paid)}</td>
                        <td>{p.status}</td>
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
