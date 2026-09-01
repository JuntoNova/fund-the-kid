# Fund the Kid

Education projects seeking capital. Filter by place, subject, and cost per kid.

Live domain: https://fundthekid.com

## Local

```bash
npm install --legacy-peer-deps
npm run dev
```

## Cloudflare Pages

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `/`

If the domain still shows `Hello world`, a Cloudflare Worker is bound to the hostname. Remove that Worker route (or the Worker) so Pages can serve this app.
