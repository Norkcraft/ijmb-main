-- Include the study centre selected by the student during registration.
CREATE OR REPLACE FUNCTION public.export_payment_records(period text DEFAULT 'all', start_date date DEFAULT NULL, end_date date DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public AS $$
DECLARE
  generated timestamptz := statement_timestamp();
  today date := (generated AT TIME ZONE 'Africa/Lagos')::date;
  first_day date;
  last_day date;
  result jsonb;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'coordinator')) THEN RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501'; END IF;
  CASE period
    WHEN 'today' THEN first_day := today; last_day := today;
    WHEN 'week' THEN first_day := date_trunc('week', today)::date; last_day := today;
    WHEN 'month' THEN first_day := date_trunc('month', today)::date; last_day := today;
    WHEN 'custom' THEN
      IF start_date IS NULL OR end_date IS NULL OR start_date > end_date THEN RAISE EXCEPTION 'Choose a valid start and end date'; END IF;
      first_day := start_date; last_day := end_date;
    WHEN 'all' THEN NULL;
    ELSE RAISE EXCEPTION 'Invalid report period';
  END CASE;
  SELECT jsonb_build_object('generatedAt', generated, 'startDate', first_day, 'endDate', last_day,
    'records', coalesce(jsonb_agg(jsonb_build_object(
      'id', p.id, 'studentId', p.user_id, 'reference', p.reference,
      'fullName', coalesce(nullif(trim(concat_ws(' ', a.first_name, a.middle_name, a.surname)), ''), nullif(pr.full_name, ''), 'Not available'),
      'course', coalesce(nullif(a.intended_course, ''), 'Not available'),
      'intendedCenter', coalesce(nullif(trim(concat_ws(', ', c.name, c.location, c.state)), ''), 'Not available'),
      'amount', p.amount, 'paymentType', coalesce(p.metadata->>'payment_type', to_jsonb(p)->>'fee_type', p.type),
      'paymentDate', p.created_at, 'paymentStatus', p.status,
      'admissionStatus', CASE WHEN a.status IN ('admitted', 'fees_pending', 'active') THEN 'Admitted'
        WHEN a.status = 'rejected' THEN 'Not Admitted' WHEN a.status IS NULL THEN 'Not available' ELSE 'Pending Admission' END
    ) ORDER BY p.created_at DESC, p.id), '[]'::jsonb)) INTO result
  FROM public.payments p
  LEFT JOIN public.profiles pr ON pr.id = p.user_id
  LEFT JOIN public.applications a ON a.id = p.application_id
  LEFT JOIN public.centres c ON c.id = a.preferred_centre_id
  WHERE p.created_at <= generated
    AND (first_day IS NULL OR p.created_at >= (first_day::timestamp AT TIME ZONE 'Africa/Lagos'))
    AND (last_day IS NULL OR p.created_at < ((last_day + 1)::timestamp AT TIME ZONE 'Africa/Lagos'));
  RETURN result;
END;
$$;
REVOKE ALL ON FUNCTION public.export_payment_records(text, date, date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.export_payment_records(text, date, date) TO authenticated;
