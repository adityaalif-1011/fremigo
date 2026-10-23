'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ProductForm, { type Product } from './form';

const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

export default function AdminProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const load = useCallback(() => {
    const supabase = createClient();

    supabase
      .from('products')
      .select('*')
      .order('id')
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setProducts((data as Product[]) ?? []);
          setError(null);
        }

        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Hapus produk "${product.name}"?`)) return;

    setDeletingId(product.id);
    setError(null);

    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id);

    if (deleteError) {
      setError(deleteError.message);
    }

    setDeletingId(null);
    load();
  };

  return (
    <div className="section">


      {/* =================================
           HEADER + CREATE BUTTON
      ================================== */}
      <div className="section-head">

        <h2>
          Produk
        </h2>

        <button
          className="btn btn-primary"
          onClick={openCreate}
        >
          + Tambah Produk Baru
        </button>

      </div>


      {/* Error */}
      {error && (
        <div className="notice" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}


      {/* =================================
           PRODUCT TABLE
      ================================== */}
      {loading ? (

        <p className="muted">
          Memuat produk...
        </p>

      ) : (

        <div className="table-wrap">

          <table className="table">

            <thead>
              <tr>
                <th>Icon</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>

              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty">
                    Belum ada produk.
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id}>

                    <td style={{ fontSize: 24 }}>
                      {product.icon}
                    </td>

                    <td>
                      {product.name}
                    </td>

                    <td>
                      {product.cat}
                    </td>

                    <td>
                      {rupiah(product.price)}
                    </td>

                    <td>
                      {product.stock}
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>

                        <button
                          className="btn btn-soft"
                          onClick={() => openEdit(product)}
                          disabled={deletingId === product.id}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-pink"
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                        >
                          {deletingId === product.id ? 'Menghapus...' : 'Hapus'}
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      )}


      {/* =================================
           CREATE / EDIT FORM (MODAL)
      ================================== */}
      {showForm && (
        <ProductForm
          key={editing?.id ?? 'new'}
          product={editing}
          onClose={closeForm}
          onSaved={() => {
            closeForm();
            load();
          }}
        />
      )}

    </div>
  );
}
