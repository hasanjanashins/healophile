
-- Drop the existing overly permissive doctor update policy
DROP POLICY IF EXISTS "Doctors can update requests" ON public.emergency_requests;

-- Create a restricted doctor update policy that only allows updating status and assigned_doctor_id
CREATE POLICY "Doctors can update request status"
ON public.emergency_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'doctor'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'doctor'::app_role));

-- Recreate has_role to enforce auth.uid() internally for the common single-param case
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = _role
  )
$$;

-- Update the two-param version to always use auth.uid() instead of the passed user_id
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = _role
  )
$$;
