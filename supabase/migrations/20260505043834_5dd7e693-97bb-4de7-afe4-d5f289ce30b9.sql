
-- 1. Fix handle_new_user to always assign 'patient' role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  
  -- Always assign patient role - doctor role must be granted by admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'patient'::app_role);
  
  RETURN new;
END;
$$;

-- 2. Fix patient INSERT policy to enforce safe initial state
DROP POLICY IF EXISTS "Patients can create requests" ON public.emergency_requests;
CREATE POLICY "Patients can create requests"
ON public.emergency_requests
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = patient_id
  AND status = 'pending'
  AND assigned_doctor_id IS NULL
);

-- 3. Add trigger to restrict which columns doctors can update
CREATE OR REPLACE FUNCTION public.enforce_doctor_update_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow changes to status and assigned_doctor_id
  IF NEW.patient_id IS DISTINCT FROM OLD.patient_id
     OR NEW.patient_name IS DISTINCT FROM OLD.patient_name
     OR NEW.request_type IS DISTINCT FROM OLD.request_type
     OR NEW.details IS DISTINCT FROM OLD.details
     OR NEW.latitude IS DISTINCT FROM OLD.latitude
     OR NEW.longitude IS DISTINCT FROM OLD.longitude
     OR NEW.created_at IS DISTINCT FROM OLD.created_at
  THEN
    RAISE EXCEPTION 'Only status and assigned_doctor_id can be updated';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_doctor_update_fields_trigger
BEFORE UPDATE ON public.emergency_requests
FOR EACH ROW
EXECUTE FUNCTION public.enforce_doctor_update_fields();
