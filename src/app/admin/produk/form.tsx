'use client';

import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';

export type Product = {
  id: number;
  name: string;
  cat: string;
  icon: string;
  price: number;
  old: number | null;
  duration: string;
  rating: number;
  stock: number;
  features: string[];
  seller: string | null;
};

type FormState = {
  name: string;
  cat: string;
  icon: string;
  price: string;
  old_price: string;
  stock: string;
  duration: string;
  seller: string;
  features: string;
};

const toFormState = (product: Product | null): FormState => ({
  name: product?.name ?? '',
  cat: product?.cat ?? '',
  icon: product?.icon ?? '',
  price: product ? String(product.price) : '',
  old_price: product && product.old != null ? String(product.old) : '',
  stock: product ? String(product.stock) : '',
  duration: product?.duration ?? '',
  seller: product?.seller ?? '',
  features: product ? product.features.join(', ') : '',
});

type ProductFormProps = {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function ProductForm({ product, onClose, onSaved }: ProductFormProps) {
  const isEdit = product !== null;

  const [form, setForm] = useState<FormState>(() => toFormState(product));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (key: keyof FormState) => (value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();

    const payload = {
      name: form.name.trim(),
      cat: form.cat.trim(),
      icon: form.icon.trim(),
      price: Number(form.price),
      old: form.old_price.trim() === '' ? null : Number(form.old_price),
      stock: Number(form.stock),
      duration: form.duration.trim(),
      seller: form.seller.trim(),
      features: form.features
        .split(',')
        .map(f => f.trim())
        .filter(f => f !== ''),
    };

    if (isEdit) {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      let { error } = await supabase.from('products').insert(payload);

      if (error && error.message.includes('rating')) {
        ({ error } = await supabase
          .from('products')
          .insert({ ...payload, rating: 0 }));
      }

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    onSaved();
  };

  return (
    <div
      className="modal show"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
    >
      <div
        className="modal-box"
        style={{ maxHeight: '90vh', overflow: 'auto' }}
      >

        {/* Close */}
        <button
          className="close"
          onClick={onClose}
          disabled={saving}
          aria-label="Tutup"
        >
          ×
        </button>


        {/* Title */}
        <h2 style={{ margin: '0 0 18px' }}>
          {isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
        </h2>


        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Nama */}
          <div className="field">
            <label htmlFor="f-name">Nama Produk</label>
            <input
              id="f-name"
              name="name"
              required
              value={form.name}
              onChange={e => setField('name')(e.target.value)}
            />
          </div>


          {/* Kategori */}
          <div className="field">
            <label htmlFor="f-cat">Kategori</label>
            <input
              id="f-cat"
              name="cat"
              required
              placeholder="Desain, Music, Education..."
              value={form.cat}
              onChange={e => setField('cat')(e.target.value)}
            />
          </div>


          {/* Icon */}
          <div className="field">
            <label htmlFor="f-icon">Icon (emoji)</label>
            <input
              id="f-icon"
              name="icon"
              required
              placeholder="🎨"
              value={form.icon}
              onChange={e => setField('icon')(e.target.value)}
            />
          </div>


          {/* Harga */}
          <div className="field">
            <label htmlFor="f-price">Harga</label>
            <input
              id="f-price"
              name="price"
              type="number"
              min={0}
              required
              placeholder="45000"
              value={form.price}
              onChange={e => setField('price')(e.target.value)}
            />
          </div>


          {/* Harga Coret */}
          <div className="field">
            <label htmlFor="old_price">Harga Coret (old_price)</label>
            <input
              id="old_price"
              name="old_price"
              type="number"
              min={0}
              placeholder="65000 (opsional)"
              value={form.old_price}
              onChange={e => setField('old_price')(e.target.value)}
            />
          </div>


          {/* Stok */}
          <div className="field">
            <label htmlFor="f-stock">Stok</label>
            <input
              id="f-stock"
              name="stock"
              type="number"
              min={0}
              required
              value={form.stock}
              onChange={e => setField('stock')(e.target.value)}
            />
          </div>


          {/* Durasi */}
          <div className="field">
            <label htmlFor="f-duration">Durasi</label>
            <input
              id="f-duration"
              name="duration"
              required
              placeholder="30 hari"
              value={form.duration}
              onChange={e => setField('duration')(e.target.value)}
            />
          </div>


          {/* Seller */}
          <div className="field">
            <label htmlFor="f-seller">Seller</label>
            <input
              id="f-seller"
              name="seller"
              required
              placeholder="PrimeStore"
              value={form.seller}
              onChange={e => setField('seller')(e.target.value)}
            />
          </div>


          {/* Features */}
          <div className="field">
            <label htmlFor="f-features">Features (pisahkan dengan koma)</label>
            <input
              id="f-features"
              name="features"
              placeholder="Template premium, Magic Resize, Background Remover"
              value={form.features}
              onChange={e => setField('features')(e.target.value)}
            />
          </div>


          {/* Error */}
          {error && (
            <p style={{ color: '#d33', margin: '12px 0 0' }}>
              {error}
            </p>
          )}


          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={saving}
            >
              Batal
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
