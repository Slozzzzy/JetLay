-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  storage_path text,
  expiry_date date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  document_type text,
  type text,
  name text,
  document_name text,
  title text,
  google_calendar_event_id text,
  CONSTRAINT documents_pkey PRIMARY KEY (id),
  CONSTRAINT documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  avatar_url text,
  phone text,
  birth_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  first_name text,
  last_name text,
  email text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.travel_reviews (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  profile_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 0 AND rating <= 5),
  title text NOT NULL,
  description_text text,
  map_link text,
  image_path text,
  place_title text,
  CONSTRAINT travel_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT travel_reviews_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.visa_requirements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  visa_rule_id uuid NOT NULL,
  label text NOT NULL,
  sort_order integer DEFAULT 0,
  default_checked boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT visa_requirements_pkey PRIMARY KEY (id),
  CONSTRAINT visa_requirements_visa_rule_id_fkey FOREIGN KEY (visa_rule_id) REFERENCES public.visa_rules(id)
);
CREATE TABLE public.visa_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nationality text NOT NULL,
  destination text NOT NULL,
  official_url text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT visa_rules_pkey PRIMARY KEY (id)
);
CREATE TABLE public.visa_user_checklist (
  user_id uuid NOT NULL,
  visa_rule_id uuid NOT NULL,
  checked_items jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT visa_user_checklist_pkey PRIMARY KEY (user_id, visa_rule_id),
  CONSTRAINT visa_user_checklist_visa_rule_id_fkey FOREIGN KEY (visa_rule_id) REFERENCES public.visa_rules(id),
  CONSTRAINT visa_user_checklist_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);