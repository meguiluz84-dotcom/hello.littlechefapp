create table public.step_jobs (
  id uuid primary key default gen_random_uuid(),
  recipe_id text not null,
  step_index int not null,
  prompt text not null,
  status text not null default 'pending' check (status in ('pending','processing','done','failed')),
  image_url text,
  error text,
  attempts int not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (recipe_id, step_index)
);

alter table public.step_jobs enable row level security;

create policy "step_jobs public read" on public.step_jobs for select using (true);

insert into storage.buckets (id, name, public) values ('recipe-steps','recipe-steps', true)
on conflict (id) do nothing;

create policy "recipe-steps public read"
on storage.objects for select
using (bucket_id = 'recipe-steps');