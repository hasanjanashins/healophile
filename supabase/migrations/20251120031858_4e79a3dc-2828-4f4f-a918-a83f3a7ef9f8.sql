-- Fix Critical Security Issues: User Roles Protection

-- 1. Add strict RLS policies to prevent client-side role manipulation
-- These policies ensure ONLY the database trigger can modify roles

-- Prevent all users from inserting roles (only trigger can insert)
CREATE POLICY "Only triggers can insert roles" ON public.user_roles
  FOR INSERT 
  WITH CHECK (false);

-- Prevent all users from updating roles
CREATE POLICY "Roles cannot be updated" ON public.user_roles
  FOR UPDATE 
  USING (false);

-- Prevent all users from deleting roles
CREATE POLICY "Roles cannot be deleted" ON public.user_roles
  FOR DELETE 
  USING (false);

-- 2. Update the trigger to read role from metadata
-- This allows doctors to register properly while maintaining security
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  user_role app_role;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  
  -- Read role from metadata, default to patient if not specified
  user_role := COALESCE(
    (new.raw_user_meta_data->>'role')::app_role,
    'patient'::app_role
  );
  
  -- Insert role (only trigger can do this due to RLS)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, user_role);
  
  RETURN new;
END;
$function$;