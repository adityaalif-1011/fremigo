'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { deleteUserAccount } from '@/app/actions/admin';

type Profile = {
  id: string;
  username: string | null;
  role: string | null;
  points: number | null;
  created_at: string;
};

const ROLES = ['buyer', 'admin'] as const;

const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export default function AdminPenggunaPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);

  // Local-only draft of selected roles (user.id -> role).
  // Nothing touches Supabase until "Simpan Perubahan" is clicked.
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(() => {
    const supabase = createClient();

    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError.message);
        } else {
          const rows = (data as Profile[]) ?? [];
          setUsers(rows);

          // Seed the local dropdown state from the fetched roles.
          const map: Record<string, string> = {};
          rows.forEach(u => {
            map[u.id] = u.role ?? 'buyer';
          });
          setSelectedRoles(map);

          setError(null);
        }

        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentAdminId(user?.id ?? null);
    });

    load();
  }, [load]);

  // Users whose dropdown differs from the role stored in the database.
  const changedUsers = useMemo(
    () =>
      users.filter(u => {
        const selected = selectedRoles[u.id];
        return selected !== undefined && selected !== (u.role ?? 'buyer');
      }),
    [users, selectedRoles],
  );

  const handleRoleSelect = (userId: string, newRole: string) => {
    // Local state ONLY — no API call here.
    setSelectedRoles(prev => ({ ...prev, [userId]: newRole }));
  };

  const handleSave = async () => {
    if (changedUsers.length === 0) return;

    setSaving(true);
    setError(null);

    const supabase = createClient();

    try {
      for (const user of changedUsers) {
        const newRole = selectedRoles[user.id];

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', user.id);

        if (updateError) throw updateError;
      }

      window.alert('Perubahan role berhasil disimpan.');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan perubahan.');
    }

    setSaving(false);
  };

  const handleReset = () => {
    const map: Record<string, string> = {};
    users.forEach(u => {
      map[u.id] = u.role ?? 'buyer';
    });
    setSelectedRoles(map);
  };

  const handleDelete = async (user: Profile) => {
    const label = user.username ?? user.id;

    if (!window.confirm(`Hapus akun "${label}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }

    setDeletingId(user.id);
    setError(null);

    const result = await deleteUserAccount(user.id);

    if ('error' in result) {
      setError(result.error);
    } else {
      window.alert('Akun berhasil dihapus.');
      load();
    }

    setDeletingId(null);
  };

  // Options per user: buyer/admin, plus the current role if it is something
  // else (e.g. legacy 'seller') so the select stays controlled.
  const optionsFor = (user: Profile) => {
    const current = user.role ?? 'buyer';
    return ROLES.includes(current as (typeof ROLES)[number])
      ? [...ROLES]
      : [...ROLES, current];
  };

  return (
    <div className="section">

      {/* ==============================
           PAGE HEADING + SAVE BUTTON
      =============================== */}
      <div className="section-head">

        <h2>Kelola Pengguna</h2>

        <div style={{ display: 'flex', gap: 8 }}>

          {changedUsers.length > 0 && (
            <button
              className="btn btn-soft"
              onClick={handleReset}
              disabled={saving}
            >
              Batalkan
            </button>
          )}

          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || changedUsers.length === 0}
          >
            {saving
              ? 'Menyimpan...'
              : changedUsers.length > 0
                ? `Simpan Perubahan (${changedUsers.length})`
                : 'Simpan Perubahan'}
          </button>

        </div>

      </div>


      {/* Error */}
      {error && (
        <div className="notice" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}


      {/* ==============================
           USERS TABLE
      =============================== */}
      {loading ? (

        <p className="muted">
          Memuat pengguna...
        </p>

      ) : (

        <div className="table-wrap" style={{ maxHeight: '65vh' }}>

          <table className="table">

            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Poin</th>
                <th>Tanggal Daftar</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>

              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty">
                    Belum ada pengguna.
                  </td>
                </tr>
              ) : (
                users.map(user => {
                  const selected = selectedRoles[user.id] ?? user.role ?? 'buyer';
                  const isChanged = selected !== (user.role ?? 'buyer');
                  const isSelf = currentAdminId !== null && user.id === currentAdminId;
                  const isDeleting = deletingId === user.id;

                  return (
                    <tr key={user.id}>

                      <td>
                        {user.username ?? '-'}
                        {isSelf && (
                          <span className="muted" style={{ marginLeft: 8, fontSize: 12 }}>
                            (kamu)
                          </span>
                        )}
                      </td>

                      <td style={{ textTransform: 'capitalize' }}>
                        {user.role ?? '-'}
                      </td>

                      <td>
                        {(user.points ?? 0).toLocaleString('id-ID')}
                      </td>

                      <td>
                        {fmtDate(user.created_at)}
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>

                          <select
                            style={{
                              maxWidth: 140,
                              padding: '8px 10px',
                              border: isChanged
                                ? '1px solid #3d8f6d'
                                : '1px solid var(--line)',
                              borderRadius: 12,
                              outline: 'none',
                              background: isChanged ? '#eef7f2' : '#fff',
                              textTransform: 'capitalize',
                            }}
                            value={selected}
                            disabled={saving || isDeleting}
                            onChange={(e) => handleRoleSelect(user.id, e.target.value)}
                          >
                            {optionsFor(user).map(role => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>

                          <button
                            className="btn btn-pink"
                            onClick={() => handleDelete(user)}
                            disabled={isSelf || saving || isDeleting}
                            title={isSelf ? 'Tidak bisa menghapus akun sendiri' : undefined}
                          >
                            {isDeleting ? 'Menghapus...' : 'Hapus'}
                          </button>

                        </div>

                        {isChanged && (
                          <span
                            className="muted"
                            style={{ marginLeft: 8, fontSize: 13 }}
                          >
                            Belum disimpan
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

      )}

    </div>
  );
}
