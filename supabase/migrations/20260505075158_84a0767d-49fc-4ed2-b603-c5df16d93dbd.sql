
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _role app_role;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  
  -- Assign role from metadata, default to patient
  _role := COALESCE(
    NULLIF(new.raw_user_meta_data->>'role', '')::app_role,
    'patient'::app_role
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, _role);
  
  RETURN new;
END;
$function$;
