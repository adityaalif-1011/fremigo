'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function createPurchase(productId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Silakan login terlebih dahulu.' };
  }

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, price')
    .eq('id', productId)
    .single();

  if (productError || !product) {
    return { error: 'Produk tidak ditemukan.' };
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { error: insertError } = await supabase.from('purchases').insert({
    user_id: user.id,
    product_id: product.id,
    price_paid: product.price,
    purchased_at: new Date().toISOString(),
    expires_at: expiresAt.toISOString(),
    status: 'active',
  });

  if (insertError) {
    return { error: 'Gagal menyimpan pembelian. Coba lagi.' };
  }

  revalidatePath('/riwayat');
  revalidatePath('/reward');
  revalidatePath('/notifications');

  return { success: true };
}
