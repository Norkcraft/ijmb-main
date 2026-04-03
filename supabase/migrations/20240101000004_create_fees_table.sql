
create table if not exists fees (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  amount numeric not null default 0,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table fees enable row level security;

-- Policies
create policy "Fees are viewable by everyone" 
  on fees for select 
  using (true);

create policy "Fees are updatable by admins only" 
  on fees for update 
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Fees are insertable by admins only" 
  on fees for insert 
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Seed default fees
insert into fees (name, amount, description) values
  ('form_fee', 5500, 'Registration form fee'),
  ('acceptance_fee', 20000, 'Acceptance fee for admitted students'),
  ('tuition_fee', 80000, 'Standard tuition fee (may vary by centre)'),
  ('hostel_fee', 30000, 'Standard hostel fee (may vary by centre)')
on conflict (name) do nothing;
