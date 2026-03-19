# Render Keep-Alive & Production Stability Setup

Use this guide to keep your free Render backend warm and reduce runtime failures.

## 1) Health endpoints now available

- `GET /check` → basic health response (safe for cron ping)
- `GET /healthz` → liveness endpoint (server process is up)
- `GET /readyz` → readiness endpoint (also checks MongoDB connection)

For cron keep-alive, prefer `GET /healthz`.

## 2) Cron URL to use

If your Render URL is:

`https://your-service-name.onrender.com`

Set cron target URL to:

`https://your-service-name.onrender.com/healthz`

## 3) Cron schedule

Render free instances can spin down after inactivity. Use a cron interval of every **10 minutes**.

Examples:

- crontab expression: `*/10 * * * *`
- UptimeRobot: monitor every 5–10 minutes
- cron-job.org: interval every 10 minutes

## 4) Expected response

A successful response returns HTTP `200` and JSON like:

```json
{
  "ok": true,
  "status": "alive",
  "uptimeSeconds": 123,
  "timestamp": "2026-03-19T00:00:00.000Z"
}
```

## 5) Render environment checks

Make sure these env vars are set in Render:

- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_KEY`
- any additional keys your routes use (`BREVO_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`, `GEMINI_API_KEY`, etc.)

Missing required env vars can terminate startup.

## 6) What was improved in server runtime

- Graceful shutdown on `SIGTERM`/`SIGINT`
- Global handling for unhandled promise rejections and uncaught exceptions
- MongoDB connection lifecycle logging (`disconnected`, `reconnected`, `error`)
- CORS error responses returned as JSON instead of uncaught errors
- No-cache headers on health endpoints to avoid cached stale status
