# Supabase Keep-Alive Cron Job

This background job prevents your Supabase database from pausing on the free plan by making periodic queries to keep it active.

**Deployed on Netlify?** Scheduled functions are automatically configured in `netlify.toml` — just push to deploy! ✨

## How It Works

- **Endpoint**: `/api/cron/keep-alive`
- **Function**: Makes a lightweight query to the `customer` table to keep the database active
- **Default Frequency**: Every 6 hours (configurable)

## Setup Options

### Option 1: Netlify (Recommended for Netlify deployments)

The easiest way if your app is deployed on Netlify.

1. **Configuration**: Already set up in `netlify.toml`
   ```toml
   [[functions]]
     path = "src/app/api/cron/keep-alive"
     schedule = "0 */6 * * *"
   ```

2. **Deploy**: Push to your main branch and Netlify will automatically enable scheduled functions

3. **Monitor**: Check Netlify dashboard → Site Settings → Functions → Scheduled Functions to see execution history and logs

### Option 2: External Cron Service (Fallback)

#### EasyCron (Free)
1. Go to https://www.easycron.com/
2. Create new cron job
3. URL: `https://your-app.com/api/cron/keep-alive`
4. Frequency: Every 6 hours (or your preference)
5. Optional: Add security by setting `CRON_SECRET` env var and passing it in Authorization header

#### UptimeRobot (Free)
1. Go to https://uptimerobot.com/
2. Create new monitor (HTTP(s) POST)
3. URL: `https://your-app.com/api/cron/keep-alive`
4. Interval: 6 hours (360 minutes)
5. Set authorization header if using `CRON_SECRET`

#### GitHub Actions (Free)
Create `.github/workflows/db-keepalive.yml`:
```yaml
name: Database Keep-Alive
on:
  schedule:
    - cron: '0 */6 * * *'
jobs:
  keepalive:
    runs-on: ubuntu-latest
    steps:
      - name: Keep database active
        run: |
          curl -X GET https://your-app.com/api/cron/keep-alive \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## Security

### Optional: Add Authorization Header

1. Set environment variable:
   ```bash
   CRON_SECRET=your-secret-key
   ```

2. Pass in request header:
   ```
   Authorization: Bearer your-secret-key
   ```

3. The endpoint will validate the secret before processing

## Monitoring & Troubleshooting

### Check Recent Executions

**Netlify**: Netlify Dashboard → Site Settings → Functions → Scheduled Functions

### Manual Testing

Test the endpoint manually:
```bash
# Without auth
curl https://your-app.com/api/cron/keep-alive

# With auth (if CRON_SECRET is set)
curl https://your-app.com/api/cron/keep-alive \
  -H "Authorization: Bearer your-secret-key"
```

### Expected Response

Success (200):
```json
{
  "success": true,
  "message": "Database keep-alive check completed",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "recordCount": 5
}
```

### Check Logs

- **Netlify**: Netlify Dashboard → Site Settings → Functions → Logs
- **Local**: Run `next dev` and check console output

## Cost Considerations

- **Vercel Crons**: Free tier includes cron jobs
- **External Services**: Most free tiers allow 1-5 cron jobs
- **Database Cost**: Minimal - just one simple read query every 6 hours

## Adjusting Frequency

To change the cron schedule:

**Netlify** - Edit `netlify.toml`:
```toml
[[functions]]
  path = "src/app/api/cron/keep-alive"
  schedule = "0 0 * * *"  # Daily at midnight UTC
```

**Cron Schedule Format** (Unix crontab):
- `0 */6 * * *` = Every 6 hours
- `0 0 * * *` = Daily at midnight UTC
- `*/30 * * * *` = Every 30 minutes
- Reference: https://crontab.guru/

## Additional Resources

- [Netlify Scheduled Functions Documentation](https://docs.netlify.com/functions/create-cli-functions/#schedule-functions)
- [Supabase Free Plan Limits](https://supabase.com/pricing)
- [Crontab Guru - Cron Schedule Helper](https://crontab.guru/)
