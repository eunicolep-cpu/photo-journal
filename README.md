# Photo Journal (Grid) — Starter Template

This is a ready-to-deploy starter project:
- React + Vite + Tailwind
- Grid-style feed
- Upload images to Cloudinary (browser -> Cloudinary)
- Store post metadata (image_url, caption, author) in Supabase via Netlify Functions
- Instagram OAuth callback via Netlify Function (demo)

## Quick steps
1. Create Cloudinary account -> create an unsigned upload preset.
2. Create Supabase project -> run SQL to create `posts` table:

```
create table posts (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  author text,
  created_at timestamptz default now()
);
```

3. Create a GitHub repo and upload this project.
4. In Netlify, import the repo and set environment variables:

```
VITE_CLOUDINARY_NAME=your_cloud_name
VITE_CLOUDINARY_PRESET=your_unsigned_preset
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_KEY=your_supabase_anon_or_service_key
INSTAGRAM_CLIENT_ID=...
INSTAGRAM_CLIENT_SECRET=...
INSTAGRAM_REDIRECT_URI=https://your-site.netlify.app/.netlify/functions/instagram-callback
NETLIFY_SITE_URL=https://your-site.netlify.app
```

5. Deploy on Netlify. Use `netlify dev` to test locally.

## Verification (non-biometric) ideas
- After Instagram login, request the user to add a short code to their IG bio. Then verify via IG Graph API that the bio contains the code.
- Or ask user to DM your Instagram account with a one-time code.

## Notes
- Do NOT collect biometric data (faces). This template avoids all face recognition.
- Secure your Supabase keys; do not expose service keys on client-side.
