import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Local testing: use ngrok to expose localhost:3000 and set the URL in Midtrans Dashboard -> Settings -> Configuration -> Payment Notification URL
export async function POST(request: Request) {
  const body = await request.json();

  const orderId = body.order_id;
  const statusCode = body.status_code;
  const grossAmount = body.gross_amount;
  const signatureKey = body.signature_key;
  const transactionStatus = body.transaction_status;
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  // Verifikasi signature: SHA512(order_id + status_code + gross_amount + serverKey)
  const expectedSignature = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex');

  const isValid =
    typeof signatureKey === 'string' &&
    signatureKey.length === expectedSignature.length &&
    crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signatureKey)
    );

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  // Status settlement/capture -> aktifkan purchase.
  // Database trigger akan menangani poin dan notifikasi.
  if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
    // Client service role: webhook dipanggil Midtrans tanpa auth, RLS harus dilewati
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Bypasses RLS
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await supabase
      .from('purchases')
      .update({
        status: 'active',
        expires_at: expiresAt.toISOString(),
      })
      .eq('order_id', orderId);
  }

  return NextResponse.json({ received: true });
}
