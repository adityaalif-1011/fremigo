-- Premigo: trigger untuk poin reward + notifikasi setelah pembelian.
-- Jalankan manual di Supabase SQL Editor (Dashboard > SQL Editor > New query > Run).

create or replace function public.handle_new_purchase()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  gained integer;
begin
  gained := floor(new.price_paid * 0.10)::integer;

  update public.profiles
     set points = coalesce(points, 0) + gained
   where id = new.user_id;

  insert into public.notifications (user_id, title, message, type, is_read)
  values (
    new.user_id,
    'Pembelian berhasil',
    'Pembelian berhasil! Poin kamu bertambah ' || gained || ' poin.',
    'reward',
    false
  );

  return new;
end;
$$;

drop trigger if exists on_purchase_created on public.purchases;

create trigger on_purchase_created
  after insert on public.purchases
  for each row
  execute function public.handle_new_purchase();
