-- Add org_name and team_size to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS org_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS team_size TEXT;

-- Update the handle_new_user trigger to populate these fields from raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, org_id, role, full_name, email, org_name, team_size)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'org_id')::uuid, NEW.id),
    COALESCE(NEW.raw_user_meta_data->>'role', 'owner'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'org_name',
    NEW.raw_user_meta_data->>'team_size'
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$;
