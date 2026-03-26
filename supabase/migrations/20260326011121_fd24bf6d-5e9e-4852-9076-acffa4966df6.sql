
CREATE OR REPLACE FUNCTION public.admin_delete_user_by_email(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_id uuid;
BEGIN
  SELECT id INTO target_id FROM auth.users WHERE email = target_email;
  IF target_id IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = target_id;
  END IF;
END;
$$;
