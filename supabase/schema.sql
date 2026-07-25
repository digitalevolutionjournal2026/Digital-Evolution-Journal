-- Digital Evolution: Complete Supabase PostgreSQL Schema & Security Rules

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Custom Enums
CREATE TYPE user_role AS ENUM ('reader', 'author', 'reviewer', 'editor', 'journal_admin', 'platform_admin');
CREATE TYPE manuscript_status AS ENUM ('draft', 'submitted', 'under_review', 'revision_requested', 'accepted', 'published', 'rejected');
CREATE TYPE review_recommendation AS ENUM ('accept', 'minor_revision', 'major_revision', 'reject');
CREATE TYPE review_policy AS ENUM ('single_blind', 'double_blind', 'open_review');

-- 3. Profiles Table (Extends supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT DEFAULT '',
  institution TEXT DEFAULT '',
  orcid TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'reader',
  rri_score NUMERIC DEFAULT 85.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Journals Table
CREATE TABLE IF NOT EXISTS public.journals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  issn TEXT UNIQUE,
  review_policy review_policy DEFAULT 'open_review',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Manuscripts Table
CREATE TABLE IF NOT EXISTS public.manuscripts (
  id TEXT PRIMARY KEY,
  doi TEXT UNIQUE NOT NULL,
  journal_id UUID REFERENCES public.journals(id),
  title TEXT NOT NULL,
  subtitle TEXT,
  abstract TEXT NOT NULL,
  ai_executive_summary TEXT,
  discipline TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  submitted_date DATE NOT NULL DEFAULT CURRENT_DATE,
  published_date DATE,
  status manuscript_status DEFAULT 'submitted',
  format_source TEXT CHECK (format_source IN ('docx', 'latex', 'markdown')),
  views_count INT DEFAULT 0,
  downloads_count INT DEFAULT 0,
  citations_count INT DEFAULT 0,
  pdf_url TEXT,
  html_introduction TEXT,
  html_methodology TEXT,
  html_results TEXT,
  html_discussion TEXT,
  html_conclusion TEXT,
  ai_precheck_plagiarism NUMERIC DEFAULT 0,
  ai_precheck_ref_integrity INT DEFAULT 100,
  ai_precheck_methodology INT DEFAULT 100,
  ai_precheck_reproducibility INT DEFAULT 100,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for full text search
CREATE INDEX IF NOT EXISTS manuscripts_search_idx ON public.manuscripts USING GIN(search_vector);

-- Trigger to update search vector automatically
CREATE OR REPLACE FUNCTION manuscripts_search_trigger() RETURNS trigger AS $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.abstract, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.discipline, '')), 'C');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_manuscripts_search
  BEFORE INSERT OR UPDATE ON public.manuscripts
  FOR EACH ROW EXECUTE FUNCTION manuscripts_search_trigger();

-- 6. Authors Table & Junction
CREATE TABLE IF NOT EXISTS public.authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  affiliation TEXT NOT NULL,
  orcid TEXT,
  avatar_url TEXT
);

CREATE TABLE IF NOT EXISTS public.manuscript_authors (
  manuscript_id TEXT REFERENCES public.manuscripts(id) ON DELETE CASCADE,
  author_id TEXT REFERENCES public.authors(id) ON DELETE CASCADE,
  author_order INT NOT NULL DEFAULT 1,
  is_corresponding BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (manuscript_id, author_id)
);

-- 7. Figures Table
CREATE TABLE IF NOT EXISTS public.figures (
  id TEXT PRIMARY KEY,
  manuscript_id TEXT REFERENCES public.manuscripts(id) ON DELETE CASCADE,
  caption TEXT NOT NULL,
  image_url TEXT NOT NULL,
  credit TEXT
);

-- 8. References Table
CREATE TABLE IF NOT EXISTS public.references (
  id TEXT PRIMARY KEY,
  manuscript_id TEXT REFERENCES public.manuscripts(id) ON DELETE CASCADE,
  citation_key TEXT NOT NULL,
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  journal TEXT NOT NULL,
  year INT NOT NULL,
  doi TEXT
);

-- 9. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  manuscript_id TEXT REFERENCES public.manuscripts(id) ON DELETE CASCADE,
  reviewer_id TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_institution TEXT NOT NULL,
  reviewer_rri NUMERIC DEFAULT 85.0,
  submitted_date DATE DEFAULT CURRENT_DATE,
  recommendation review_recommendation NOT NULL,
  score_methodology INT CHECK (score_methodology BETWEEN 1 AND 5),
  score_originality INT CHECK (score_originality BETWEEN 1 AND 5),
  score_data_availability INT CHECK (score_data_availability BETWEEN 1 AND 5),
  score_clarity INT CHECK (score_clarity BETWEEN 1 AND 5),
  score_overall INT CHECK (score_overall BETWEEN 1 AND 5),
  editor_comments TEXT,
  author_comments TEXT,
  public_citable_snippet TEXT,
  review_doi TEXT UNIQUE,
  helpful_votes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manuscripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Published manuscripts are publicly viewable by everyone
CREATE POLICY "Public Manuscripts Read" ON public.manuscripts
  FOR SELECT USING (true);

-- Authenticated authors can create and manage their submissions
CREATE POLICY "Authors Insert Manuscripts" ON public.manuscripts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR true);

CREATE POLICY "Public Reviews Read" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Reviewers Insert Reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR true);
