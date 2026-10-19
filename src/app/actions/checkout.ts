'use server';

import midtransClient from 'midtrans-client';
import { createClient } from '@/lib/supabase/server';

type MidtransResult = {
  token?: string;
  error?: string;
};

export async function createMidtransTransaction(
  productId: number
): Promise<MidtransResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Silakan login terlebih dahulu.' };
  }

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name, price')
    .eq('id', productId)
    .single();

  if (productError || !product) {
    return { error: 'Produk tidak ditemukan.' };
  }

  const orderId = `ORDER-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase()}`;

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const { error: insertError } = await supabase.from('purchases').insert({
    user_id: user.id,
    product_id: product.id,
    price_paid: product.price,
    order_id: orderId,
    status: 'pending',
    expires_at: expiresAt.toISOString(),
    purchased_at: new Date().toISOString(),
  });

  if (insertError) {
    console.error('SUPABASE INSERT ERROR:', insertError);
    return { error: insertError.message || 'Gagal menyimpan pembelian' };
  }

  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: product.price,
      },
      item_details: [
        {
          id: product.id,
          price: product.price,
          quantity: 1,
          name: product.name,
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);

    return { token: transaction.token };
  } catch (error) {
    // Transaksi gagal dibuat di Midtrans -> hapus purchase pending
    await supabase.from('purchases').delete().eq('order_id', orderId);

    return {
      error:
        error instanceof Error
          ? error.message
          : 'Gagal membuat transaksi. Coba lagi.',
    };
  }
}
