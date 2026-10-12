# Turning on login (Google, GitHub, LinkedIn)

The site already has login built in. It stays "not configured" until you do this once (free tier is enough).

## 1. Create the Supabase project
1. Go to supabase.com, sign in with GitHub, click **New project**.
2. Open **Project Settings > API**. Copy the **Project URL** and the **anon public** key.

## 2. Add the keys to Vercel
Vercel > your project > **Settings > Environment Variables**. Add for Production (and Preview):
- `NEXT_PUBLIC_SUPABASE_URL` = the Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = the anon public key

Then **Redeploy**. (For local dev, copy `.env.example` to `.env.local`.)

## 3. Tell Supabase your site URLs
Supabase > **Authentication > URL Configuration**:
- Site URL: `https://akops-labs.vercel.app` (or your custom domain)
- Redirect URLs: add `https://akops-labs.vercel.app/auth/callback` and `http://localhost:3000/auth/callback`

## 4. Enable each login provider
Supabase > **Authentication > Providers**. For each one, create an OAuth app at the provider and paste its Client ID and Secret. Supabase shows the exact **callback URL** (`https://YOUR-PROJECT.supabase.co/auth/v1/callback`) to give the provider.

- **Google**: Google Cloud Console > APIs & Services > Credentials > OAuth client ID (Web).
- **GitHub**: GitHub > Settings > Developer settings > OAuth Apps > New.
- **LinkedIn (OIDC)**: linkedin.com/developers > create app > add "Sign In with LinkedIn using OpenID Connect" product. Enable the **LinkedIn (OIDC)** provider in Supabase.

## 5. Project downloads
Set `downloadUrl` for each project in `src/lib/projects.ts` (for example a Supabase Storage URL or GitHub release link). Downloads show only to signed-in users.
