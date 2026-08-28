-- Fix infinite RLS recursion on profiles table.
-- The old get_current_org_id() queried profiles with RLS active, causing
-- a stack overflow when any policy tried to call it.
-- Solution: introduce a helper function that is SECURITY DEFINER so it
-- bypasses RLS entirely when fetching the org_id.

-- 1. Drop the recursive policy first
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- 2. Create a SECURITY DEFINER helper that reads profiles WITHOUT triggering RLS
CREATE OR REPLACE FUNCTION public.get_user_org_id(user_uuid uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM public.profiles WHERE user_id = user_uuid LIMIT 1;
$$;
ALTER FUNCTION public.get_user_org_id(uuid) OWNER TO postgres;

-- 3. Update get_current_org_id to use the helper
CREATE OR REPLACE FUNCTION public.get_current_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_org_id(auth.uid());
$$;
ALTER FUNCTION public.get_current_org_id() OWNER TO postgres;

-- 4. Re-create the profiles SELECT policy using the non-recursive helper
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (
    auth.uid() = user_id
    OR org_id = public.get_user_org_id(auth.uid())
  );


