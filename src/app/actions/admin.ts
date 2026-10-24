'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

type DeleteResult = { success: true } | { error: string };

export async function deleteUserAccount(userId: string): Promise<DeleteResult> {
  if (!userId) {
    return { error: 'User ID tidak valid.' };
  }

  // 1) Verify the caller is an authenticated admin (server-side check)
  const supabase = await createClient();

  const {
    data: { user: caller },
  } = await supabase.auth.getUser();

  if (!caller) {
    return { error: 'Silakan login terlebih dahulu.' };
  }

  if (caller.id === userId) {
    return { error: 'Kamu tidak bisa menghapus akun sendiri.' };
  }

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', caller.id)
    .single();

  if (callerProfile?.role?.toLowerCase().trim() !== 'admin') {
    return { error: 'Hanya admin yang bisa menghapus akun.' };
  }

  // 2) Delete from Auth via the Admin API (regular client cannot touch auth.users)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    return { error: 'SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi.' };
  }

  const adminClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);

  if (deleteError) {
    console.error('DELETE_USER_ERROR:', deleteError.message);
    return { error: deleteError.message || 'Gagal menghapus akun.' };
  }

  // 3) Clean up the profile row if ON DELETE CASCADE is not set.
  //    Ignore the error — the row may already be gone via cascade.
  await adminClient.from('profiles').delete().eq('id', userId);

  return { success: true };
}
