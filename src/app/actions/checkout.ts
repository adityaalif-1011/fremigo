'use server';

import { createClient } from '@/lib/supabase/server';

type ManualPurchaseResult = {
  error?: string;
};

export async function createManualPurchase(
  productId: number,
  deliveryEmail: string,
  proofUrl: string
): Promise<ManualPurchaseResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Silakan login terlebih dahulu.' };
  }

  if (!proofUrl) {
    return { error: 'Bukti transfer wajib diunggah.' };
  }

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, price')
    .eq('id', productId)
    .single();

  if (productError || !product) {
    return { error: 'Produk tidak ditemukan.' };
  }

  const { error: insertError } = await supabase.from('purchases').insert({
    user_id: user.id,
    product_id: product.id,
    price_paid: product.price,
    order_id: 'MANUAL-' + Date.now(),
    status: 'pending',
    payment_proof_url: proofUrl,
    delivery_email: deliveryEmail,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    purchased_at: new Date().toISOString(),
  });

  if (insertError) {
    console.error('SUPABASE INSERT ERROR:', insertError);
    return { error: insertError.message || 'Gagal menyimpan pembelian' };
  }

  return {};
}
