-- Users table is handled by Supabase Auth

-- Brand profiles
create table brand_profiles (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text not null default '',
  description text not null default '',
  audience text not null default '',
  keywords text[] not null default '{}',
  tone text not null default 'professional',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table brand_profiles enable row level security;

create policy "Users can manage their own brand profile"
  on brand_profiles for all
  using (auth.uid() = user_id);

-- Generated posts
create table generated_posts (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  topic text not null,
  platform text not null,
  content text not null,
  language text not null default 'en',
  tone text not null default 'professional',
  created_at timestamp with time zone not null default now()
);

alter table generated_posts enable row level security;

create policy "Users can manage their own posts"
  on generated_posts for all
  using (auth.uid() = user_id);

create index idx_generated_posts_user_id on generated_posts(user_id);
create index idx_generated_posts_created_at on generated_posts(created_at desc);

-- User subscriptions (synced from Stripe webhooks)
create table user_subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'inactive',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table user_subscriptions enable row level security;

create policy "Users can view their own subscription"
  on user_subscriptions for select
  using (auth.uid() = user_id);
