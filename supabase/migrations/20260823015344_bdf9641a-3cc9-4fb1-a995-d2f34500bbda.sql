REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP FUNCTION IF EXISTS public.match_incidents(UUID, vector, INT);

CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO anon, authenticated, service_role;
ALTER EXTENSION vector SET SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.match_incidents(_embedding extensions.vector(768), _limit INT DEFAULT 5)
RETURNS TABLE (id UUID, ref TEXT, stack TEXT, remediation TEXT, distance FLOAT)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public, extensions AS $$
  SELECT i.id, i.ref, i.stack, i.remediation, (i.embedding <=> _embedding)::float AS distance
  FROM public.incidents i
  WHERE i.embedding IS NOT NULL
  ORDER BY i.embedding <=> _embedding
  LIMIT _limit;
$$;
REVOKE EXECUTE ON FUNCTION public.match_incidents(extensions.vector, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.match_incidents(extensions.vector, INT) TO authenticated, service_role;