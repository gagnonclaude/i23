-- Table pour les bilans de départ
create table if not exists public.bilans_depart (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  reponses jsonb default '{}',
  scores_dimensions jsonb default '{}',
  completed_at timestamptz default now(),
  unique(user_id)
);

-- RLS : un membre ne voit que son bilan
alter table public.bilans_depart enable row level security;

create policy "Un membre voit son bilan"
  on public.bilans_depart for select
  using (auth.uid() = user_id);

create policy "Un membre insère son bilan"
  on public.bilans_depart for insert
  with check (auth.uid() = user_id);

create policy "Un membre modifie son bilan"
  on public.bilans_depart for update
  using (auth.uid() = user_id);

-- Table pour les abonnements Stripe
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_customer_id text not null,
  stripe_subscription_id text not null,
  stripe_price_id text,
  status text default 'active',
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Un membre voit ses abonnements"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Table pour les schémas d'expérience
create table if not exists public.schemas_experience (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  thematique text not null,
  declencheur text not null,
  etapes jsonb default '[]',
  niveau text default 'i',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.schemas_experience enable row level security;

create policy "Un membre voit ses schémas"
  on public.schemas_experience for select
  using (auth.uid() = user_id);

create policy "Un membre crée ses schémas"
  on public.schemas_experience for insert
  with check (auth.uid() = user_id);

create policy "Un membre modifie ses schémas"
  on public.schemas_experience for update
  using (auth.uid() = user_id);

create policy "Un membre supprime ses schémas"
  on public.schemas_experience for delete
  using (auth.uid() = user_id);

-- Table pour les résultats d'outils i+
create table if not exists public.outils_resultats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  outil_type text not null,
  etape_numero int not null,
  reponses jsonb default '{}',
  menaces text[] default '{}',
  opportunites text[] default '{}',
  created_at timestamptz default now()
);

alter table public.outils_resultats enable row level security;

create policy "Un membre voit ses résultats d'outils"
  on public.outils_resultats for select
  using (auth.uid() = user_id);

create policy "Un membre crée ses résultats d'outils"
  on public.outils_resultats for insert
  with check (auth.uid() = user_id);

create policy "Un membre modifie ses résultats d'outils"
  on public.outils_resultats for update
  using (auth.uid() = user_id);

-- Table pour les emails d'attente (landing page, pas d'auth requise)
create table if not exists public.attente_emails (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  locale text default 'fr',
  created_at timestamptz default now()
);

alter table public.attente_emails enable row level security;

create policy "Insertion publique des emails d'attente"
  on public.attente_emails for insert
  with check (true);

-- Index pour les recherches fréquentes par user_id
create index if not exists idx_bilans_depart_user_id on public.bilans_depart(user_id);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_schemas_experience_user_id on public.schemas_experience(user_id);
create index if not exists idx_outils_resultats_user_id on public.outils_resultats(user_id);

-- Contrainte unique sur stripe_subscription_id (évite doublons webhook)
create unique index if not exists idx_subscriptions_stripe_sub_id on public.subscriptions(stripe_subscription_id) where stripe_subscription_id is not null;
create index if not exists idx_subscriptions_stripe_cust_id on public.subscriptions(stripe_customer_id);
create index if not exists idx_mc_progression_mc_id on public.mc_progression(mc_id);
create index if not exists idx_quiz_results_mc_id on public.quiz_results(mc_id);

-- RLS INSERT manquante sur subscriptions (le webhook en a besoin via admin, mais pour complétude)
create policy "Un membre insère ses abonnements"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Un membre modifie ses abonnements"
  on public.subscriptions for update
  using (auth.uid() = user_id);

-- Table pour la progression du parcours séquentiel
create table if not exists public.parcours_progression (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  etape_actuelle text not null default 'initialisation',
  date_modification timestamptz default now()
);

alter table public.parcours_progression enable row level security;

create policy "Un membre voit sa progression"
  on public.parcours_progression for select
  using (auth.uid() = user_id);

create policy "Un membre modifie sa progression"
  on public.parcours_progression for update
  using (auth.uid() = user_id);

create policy "Un membre insère sa progression"
  on public.parcours_progression for insert
  with check (auth.uid() = user_id);

-- Table pour les résultats de quiz
create table if not exists public.quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  mc_id text not null,
  score int not null,
  reussi boolean not null default false,
  reponses jsonb default '{}',
  created_at timestamptz default now()
);

alter table public.quiz_results enable row level security;

create policy "Un membre voit ses quiz"
  on public.quiz_results for select
  using (auth.uid() = user_id);

create policy "Un membre insère ses quiz"
  on public.quiz_results for insert
  with check (auth.uid() = user_id);

-- Table pour les badges obtenus
create table if not exists public.badges_earned (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  badge_type text not null,
  thematique text,
  created_at timestamptz default now(),
  unique(user_id, badge_type, thematique)
);

alter table public.badges_earned enable row level security;

create policy "Un membre voit ses badges"
  on public.badges_earned for select
  using (auth.uid() = user_id);

create policy "Un membre insère ses badges"
  on public.badges_earned for insert
  with check (auth.uid() = user_id);

-- Table pour la progression dans les Masterclass
create table if not exists public.mc_progression (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  mc_id text not null,
  section_actuelle int not null default 0,
  completee boolean not null default false,
  updated_at timestamptz default now(),
  unique(user_id, mc_id)
);

alter table public.mc_progression enable row level security;

create policy "Un membre voit sa progression MC"
  on public.mc_progression for select
  using (auth.uid() = user_id);

create policy "Un membre modifie sa progression MC"
  on public.mc_progression for update
  using (auth.uid() = user_id);

create policy "Un membre insère sa progression MC"
  on public.mc_progression for insert
  with check (auth.uid() = user_id);

-- Modifier schemas_experience : ajouter colonnes parcours
alter table public.schemas_experience
  add column if not exists statut text default 'brouillon',
  add column if not exists badge_earned boolean default false;

-- Index pour les nouvelles tables
create index if not exists idx_parcours_progression_user_id on public.parcours_progression(user_id);
create index if not exists idx_quiz_results_user_id on public.quiz_results(user_id);
create index if not exists idx_badges_earned_user_id on public.badges_earned(user_id);
create index if not exists idx_mc_progression_user_id on public.mc_progression(user_id);
