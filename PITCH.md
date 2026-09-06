# Investor pitch (`/pitch`)

Password-gated static pages under `public/pitch/`. Worker cookie gate in `src/worker.ts`.

## Secret

Set once (never commit the value):

```bash
npx wrangler secret put PITCH_PASSWORD
```

If the secret is missing, gated routes return 503.

## URLs

- https://fundthekid.com/pitch
- https://fundthekid.com/pitch/campaigns/stem-austin
- Lanes: `/pitch/lanes/advocacy`, `/pitch/lanes/supply`, `/pitch/lanes/confidence`
- Login: `/pitch/login`

Login posts to `/pitch/api/login`. Logout: `/pitch/api/logout`.
