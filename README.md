This is a Next.js life dashboard with Google sign-in and Google Drive AppData sync endpoints.

## Environment

Create `.env.local` for local development:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=generate-a-long-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate a strong secret with:

```bash
openssl rand -base64 32
```

## Google Cloud Setup

1. Create or choose a Google Cloud project.
2. Enable the Google Drive API.
3. Configure the OAuth consent screen.
4. Create an OAuth Client ID for a web application.
5. Add this authorized redirect URI for local development:

```text
http://localhost:3000/api/auth/google/callback
```

6. For production, also add:

```text
https://your-domain.com/api/auth/google/callback
```

7. Put the client ID and client secret in your local `.env.local` and in your host's production environment variables.

The app requests these Google scopes:

```text
openid email profile https://www.googleapis.com/auth/drive.appdata
```

Because it uses the Drive AppData scope, Google may require OAuth app verification before general public release.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If port 3000 is already busy, Next.js will print the alternate local URL in the terminal.

## Deploying

On Vercel or another Next.js host, set these environment variables:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-production-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
NEXTAUTH_SECRET=your-production-random-secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

Then redeploy after adding the production callback URL in Google Cloud.

## Production Notes

- Google tokens are stored only in an encrypted HTTP-only session cookie.
- The browser receives user profile data, not Google access or refresh tokens.
- Dashboard data is persisted locally in browser storage.
- Drive API routes are per signed-in user and use that user's Google Drive AppData folder.

## Useful Commands

```bash
npm run lint
npm run build
npm run dev
```
