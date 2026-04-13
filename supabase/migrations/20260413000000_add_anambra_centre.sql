-- Add Anambra City Centre
INSERT INTO public.centres (name, location, state, active)
VALUES ('Anambra City Centre', 'Awka', 'Anambra', true)
ON CONFLICT DO NOTHING;
