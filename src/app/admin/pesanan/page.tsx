'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getBuyerEmails } from '@/app/actions/admin';

type ProductInfo = {
  name: string;
  icon: string | null;
  duration: string | null;
};

type ProfileInfo = {
  username: string | null;
};

type Purchase = {
  id: number | string;
  user_id: string;
  purchased_at: string;
  expires_at: string;
  status: string;
  delivery_email: string | null;
  account_details: string | null;
  payment_proof_url: string | null;
  products: ProductInfo | ProductInfo[] | null;
  profiles: ProfileInfo | ProfileInfo[] | null;
};

type Badge = {
  label: string;
  color: string;
  background: string;
};

const productOf = (p: Purchase) =>
  Array.isArray(p.products) ? (p.products[0] ?? null) : p.products;

const profileOf = (p: Purchase) =>
  Array.isArray(p.profiles) ? (p.profiles[0] ?? null) : p.profiles;

const productNameOf = (p: Purchase) => productOf(p)?.name ?? '-';

const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const badgeOf = (p: Purchase): Badge => {
  if (p.status === 'pending') {
    return p.payment_proof_url
      ? { label: 'Menunggu Verifikasi', color: '#7a5300', background: '#fde68a' }
      : { label: 'Belum Bayar', color: '#fff', background: '#d9534f' };
  }

  if (p.account_details !== null) {
    return { label: 'Selesai', color: '#fff', background: 'var(--green-dark)' };
  }

  if (p.status === 'active') {
    return { label: 'Perlu Dikirim', color: '#0b4a75', background: '#cfe6fb' };
  }

  return {
    label: p.status.charAt(0).toUpperCase() + p.status.slice(1),
    color: '#25352f',
    background: '#e3ebe7',
  };
};

// Tombol Input Akun hanya untuk pesanan yang sudah bayar tapi akun belum dikirim
const needsAccount = (p: Purchase) =>
  p.status === 'active' && p.account_details === null;

// Approve hanya untuk pembayaran manual yang sudah diunggah buktinya
const canApprove = (p: Purchase) =>
  p.status === 'pending' && p.payment_proof_url !== null;

export default function AdminPesananPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [akunModal, setAkunModal] = useState<Purchase | null>(null);
  const [akunText, setAkunText] = useState('');
  const [savingAkun, setSavingAkun] = useState(false);
  const [akunError, setAkunError] = useState<string | null>(null);

  const [approvingId, setApprovingId] = useState<string | number | null>(null);
  const [approveError, setApproveError] = useState<string | null>(null);

  const load = useCallback(() => {
    const supabase = createClient();

    supabase
      .from('purchases')
      .select(
        'id, user_id, purchased_at, expires_at, status, delivery_email, account_details, payment_proof_url, products(name, icon, duration), profiles(username)',
      )
      .order('purchased_at', { ascending: false })
      .then(async ({ data, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError.message);
          setLoading(false);
          return;
        }

        setPurchases((data as Purchase[]) ?? []);
        setError(null);

        const res = await getBuyerEmails();
        if (res.ok) {
          setEmails(res.emails);
        } else {
          console.error('GET_BUYER_EMAILS_ERROR:', res.error);
        }

        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);


  /* =================================
       INPUT AKUN PREMIUM
  ================================== */
  const emailOf = (p: Purchase) =>
    emails[p.user_id] ?? p.delivery_email ?? '—';

  const openAkunModal = (p: Purchase) => {
    setAkunModal(p);
    setAkunText('');
    setAkunError(null);
  };

  const saveAkun = async () => {
    if (!akunModal || savingAkun) return;

    const text = akunText.trim();

    if (!text) {
      setAkunError('Detail akun tidak boleh kosong.');
      return;
    }

    setSavingAkun(true);
    setAkunError(null);

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from('purchases')
      .update({ account_details: text })
      .eq('id', akunModal.id);

    if (updateError) {
      setAkunError(updateError.message);
      setSavingAkun(false);
      return;
    }

    // Notifikasi untuk buyer (non-fatal: akun sudah tersimpan)
    const { error: notifError } = await supabase.from('notifications').insert({
      user_id: akunModal.user_id,
      title: 'Akun Premium Telah Dikirim!',
      message:
        'Akun untuk ' +
        productNameOf(akunModal) +
        ' sudah siap. Silakan cek di menu Riwayat.',
      type: 'info',
    });

    if (notifError) {
      console.error('NOTIFICATION INSERT ERROR:', notifError);
    }

    setSavingAkun(false);
    setAkunModal(null);
    load();
  };


  /* =================================
       APPROVE PEMBAYARAN MANUAL
  ================================== */
  const approvePurchase = async (p: Purchase) => {
    if (approvingId !== null) return;

    setApprovingId(p.id);
    setApproveError(null);

    const supabase = createClient();

    const expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { error: updateError } = await supabase
      .from('purchases')
      .update({ status: 'active', expires_at: expiresAt })
      .eq('id', p.id)
      .eq('status', 'pending');

    if (updateError) {
      setApproveError(updateError.message);
      setApprovingId(null);
      return;
    }

    // Notifikasi untuk buyer (non-fatal: pembayaran sudah disetujui)
    const { error: notifError } = await supabase.from('notifications').insert({
      user_id: p.user_id,
      title: 'Pembayaran Diverifikasi!',
      message: 'Pembayaran Diverifikasi! Akun akan segera dikirim.',
      type: 'info',
    });

    if (notifError) {
      console.error('NOTIFICATION INSERT ERROR:', notifError);
    }

    setApprovingId(null);
    load();
  };


  return (
    <div className="section">


      {/* =================================
           PAGE TITLE
      ================================== */}
      <div className="section-head">
        <h2>Pesanan</h2>
      </div>


      {error && (
        <div className="notice" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}


      {approveError && (
        <div className="notice" style={{ marginBottom: 16 }}>
          {approveError}
        </div>
      )}


      {loading ? (

        <p className="muted">
          Memuat pesanan...
        </p>

      ) : (
        <>


          {/* =================================
               ORDER TABLE
          ================================== */}
          <div className="table-wrap">

            <table className="table">

              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Produk</th>
                  <th>Email Pembeli</th>
                  <th>Status</th>
                  <th>Bukti Transfer</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>

                {purchases.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty">
                      Belum ada pesanan.
                    </td>
                  </tr>
                ) : (
                  purchases.map(p => {
                    const product = productOf(p);
                    const profile = profileOf(p);
                    const badge = badgeOf(p);

                    return (
                      <tr key={String(p.id)}>
                        <td>{fmtDate(p.purchased_at)}</td>

                        <td>
                          {product?.icon} {product?.name}

                          <br />

                          <small className="muted">
                            #{String(p.id)} · {product?.duration ?? '-'}
                          </small>
                        </td>

                        <td>
                          {emailOf(p)}

                          {profile?.username && (
                            <>
                              <br />
                              <small className="muted">
                                @{profile.username}
                              </small>
                            </>
                          )}
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
                        </td>

                        <td>
                          {p.payment_proof_url ? (
                            <a
                              className="btn btn-soft"
                              href={p.payment_proof_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Lihat
                            </a>
                          ) : (
                            <span className="muted">—</span>
                          )}
                        </td>

                        <td>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {canApprove(p) && (
                              <button
                                className="btn"
                                style={{
                                  background: 'var(--green-dark)',
                                  color: '#fff',
                                }}
                                onClick={() => approvePurchase(p)}
                                disabled={approvingId !== null}
                              >
                                {approvingId === p.id
                                  ? 'Approving...'
                                  : 'Approve'}
                              </button>
                            )}

                            {needsAccount(p) ? (
                              <button
                                className="btn btn-soft"
                                onClick={() => openAkunModal(p)}
                              >
                                Input Akun
                              </button>
                            ) : (
                              !canApprove(p) && <span className="muted">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}

              </tbody>

            </table>

          </div>


          {/* =================================
               INFO
          ================================== */}
          <div
            className="notice"
            style={{
              marginTop: 16,
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
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Pesanan berstatus <b>Perlu Dikirim</b> berarti pembayarannya sudah
            masuk — isi detail akun, lalu pembeli otomatis menerima notifikasi
            dan bisa melihat akunnya di menu Riwayat.
          </div>


        </>
      )}


      {/* =================================
           MODAL — INPUT AKUN PREMIUM
      ================================== */}

      {akunModal && (
        <div
          className="modal show"
          role="dialog"
          aria-modal="true"
          aria-label="Input Akun Premium"
        >
          <div className="modal-box">

            <button
              className="close"
              onClick={() => {
                if (!savingAkun) setAkunModal(null);
              }}
              disabled={savingAkun}
              aria-label="Tutup"
            >
              ×
            </button>

            <h2 style={{ margin: '0 0 6px' }}>
              Input Akun Premium
            </h2>

            <p className="muted" style={{ marginTop: 0 }}>
              {productNameOf(akunModal)} · #{String(akunModal.id)} ·{' '}
              {emailOf(akunModal)}
            </p>

            <div className="field">
              <label htmlFor="account-details">
                Masukkan detail akun (Username/Password)
              </label>

              <textarea
                id="account-details"
                rows={5}
                value={akunText}
                onChange={e => setAkunText(e.target.value)}
                placeholder={'username: contoh@email.com\npassword: rahasia'}
              />
            </div>

            {akunError && (
              <p style={{ color: '#d33', margin: '12px 0 0' }}>
                {akunError}
              </p>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={saveAkun}
                disabled={savingAkun}
              >
                {savingAkun ? 'Menyimpan...' : 'Simpan'}
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setAkunModal(null)}
                disabled={savingAkun}
              >
                Batal
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
