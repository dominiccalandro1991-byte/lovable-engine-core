CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  engine INT NOT NULL,
  name TEXT NOT NULL,
  mime TEXT,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  sha256 TEXT,
  storage_path TEXT NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX artifacts_user_engine_idx ON public.artifacts (user_id, engine, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.artifacts TO authenticated;
GRANT ALL ON public.artifacts TO service_role;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own artifacts" ON public.artifacts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  engine INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ok',
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  output JSONB NOT NULL DEFAULT '{}'::jsonb,
  duration_ms INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX runs_user_engine_idx ON public.runs (user_id, engine, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.runs TO authenticated;
GRANT ALL ON public.runs TO service_role;
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own runs" ON public.runs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.engine_config (
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  engine INT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, engine)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.engine_config TO authenticated;
GRANT ALL ON public.engine_config TO service_role;
ALTER TABLE public.engine_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own config" ON public.engine_config FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.baselines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  label TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX baselines_user_idx ON public.baselines (user_id, sha256);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.baselines TO authenticated;
GRANT ALL ON public.baselines TO service_role;
ALTER TABLE public.baselines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own baselines" ON public.baselines FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  ref TEXT NOT NULL,
  stack TEXT NOT NULL,
  remediation TEXT NOT NULL DEFAULT '',
  embedding vector(768),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX incidents_user_idx ON public.incidents (user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.incidents TO authenticated;
GRANT ALL ON public.incidents TO service_role;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own incidents" ON public.incidents FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.match_incidents(_user_id UUID, _embedding vector(768), _limit INT DEFAULT 5)
RETURNS TABLE (id UUID, ref TEXT, stack TEXT, remediation TEXT, distance FLOAT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT i.id, i.ref, i.stack, i.remediation, (i.embedding <=> _embedding)::float AS distance
  FROM public.incidents i
  WHERE i.user_id = _user_id AND i.embedding IS NOT NULL
  ORDER BY i.embedding <=> _embedding
  LIMIT _limit;
$$;
GRANT EXECUTE ON FUNCTION public.match_incidents(UUID, vector, INT) TO authenticated, service_role;

CREATE TABLE public.webhook_endpoints (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  secret TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.webhook_endpoints TO authenticated;
GRANT ALL ON public.webhook_endpoints TO service_role;
ALTER TABLE public.webhook_endpoints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own endpoint" ON public.webhook_endpoints FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  hash TEXT NOT NULL,
  signature TEXT NOT NULL,
  cls TEXT NOT NULL DEFAULT 'UNCLASSIFIED',
  freq INT NOT NULL DEFAULT 1,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, hash)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.traces TO authenticated;
GRANT ALL ON public.traces TO service_role;
ALTER TABLE public.traces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own traces" ON public.traces FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  payload_limit_lb NUMERIC NOT NULL DEFAULT 0,
  motor_type TEXT NOT NULL DEFAULT '',
  price_usd NUMERIC NOT NULL DEFAULT 0,
  is_own BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.competitors TO authenticated;
GRANT ALL ON public.competitors TO service_role;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own competitors" ON public.competitors FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.deploy_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deploy_targets TO authenticated;
GRANT ALL ON public.deploy_targets TO service_role;
ALTER TABLE public.deploy_targets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own targets" ON public.deploy_targets FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.upstream_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  label TEXT NOT NULL,
  upstream_url TEXT NOT NULL,
  header_name TEXT NOT NULL DEFAULT 'Authorization',
  header_prefix TEXT NOT NULL DEFAULT 'Bearer ',
  ciphertext TEXT NOT NULL,
  iv TEXT NOT NULL,
  tokens NUMERIC NOT NULL DEFAULT 20,
  capacity NUMERIC NOT NULL DEFAULT 20,
  refill_per_sec NUMERIC NOT NULL DEFAULT 0.83,
  last_refill TIMESTAMPTZ NOT NULL DEFAULT now(),
  error_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.upstream_keys TO authenticated;
GRANT ALL ON public.upstream_keys TO service_role;
ALTER TABLE public.upstream_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own keys" ON public.upstream_keys FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own folder read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'engine-artifacts' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own folder insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'engine-artifacts' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own folder update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'engine-artifacts' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own folder delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'engine-artifacts' AND (storage.foldername(name))[1] = auth.uid()::text);