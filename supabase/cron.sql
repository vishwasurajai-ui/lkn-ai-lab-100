-- Run once in Supabase SQL Editor AFTER deploying the poll-news Edge Function
-- Dashboard → Edge Functions → poll-news → Secrets: set CRON_SECRET

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

-- Remove old schedule if re-running
select cron.unschedule(jobid)
from cron.job
where jobname = 'poll-news-every-15-min';

-- Replace YOUR_CRON_SECRET with the same value as Edge Function secret CRON_SECRET
select cron.schedule(
  'poll-news-every-15-min',
  '*/15 * * * *',
  $$
  select net.http_post(
    url := 'https://dhrrhruukfdzujhmofgw.supabase.co/functions/v1/poll-news',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', 'YOUR_CRON_SECRET'
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);
