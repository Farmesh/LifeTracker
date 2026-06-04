# Life Dashboard - Project Instructions

## Project Overview
Modern, premium-quality personal productivity and daily life tracking web application with Google Drive integration, PWA support, and offline capabilities.

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, ShadCN UI
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Authentication**: Google OAuth 2.0
- **Storage**: Google Drive API (AppData Folder)
- **PWA**: next-pwa with Service Workers
- **Export**: PDF, CSV, JSON

## Key Features
1. Dashboard with daily overview and progress rings
2. Daily timeline for activity logging
3. Goal management (daily, weekly, monthly, yearly)
4. Habit tracker with GitHub-style heatmap
5. Daily journal with rich text editor
6. Study tracker with analytics
7. Weekly/monthly analytics dashboard
8. Interactive calendar view
9. Global search functionality
10. Life Areas Dashboard (Study, Fitness, Reading, Career, etc.)
11. Export capabilities
12. Light/dark mode
13. Fully responsive mobile-first design
14. Offline support with PWA

## Setup Checklist

- [x] Verify copilot-instructions.md created
- [ ] Scaffold Next.js 14 project with TypeScript
- [ ] Install all dependencies (Tailwind CSS, ShadCN UI, Framer Motion, Recharts, Zustand, next-pwa)
- [ ] Configure TypeScript, Tailwind, and Next.js
- [ ] Create folder structure and base components
- [ ] Set up Google OAuth configuration templates
- [ ] Set up Google Drive API integration setup
- [ ] Create Zustand store structure
- [ ] Create API routes for authentication and Drive
- [ ] Install and test PWA setup
- [ ] Verify compilation and build
- [ ] Update README.md with setup instructions

## Project Structure
```
life-dashboard/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── page.tsx
│   │   ├── goals/page.tsx
│   │   ├── habits/page.tsx
│   │   ├── journal/page.tsx
│   │   ├── study/page.tsx
│   │   ├── timeline/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── life-areas/page.tsx
│   └── api/
│       ├── auth/
│       └── drive/
├── components/
│   ├── ui/ (ShadCN components)
│   ├── dashboard/
│   ├── goals/
│   ├── habits/
│   ├── journal/
│   ├── study/
│   ├── analytics/
│   └── common/
├── lib/
│   ├── stores/ (Zustand stores)
│   ├── api/ (Google Drive API client)
│   ├── auth/ (Google OAuth)
│   └── utils/
├── public/
│   ├── manifest.json
│   ├── service-worker.js
│   └── icons/
├── styles/
│   └── globals.css
└── .env.local.example

```

## Environment Variables Template
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Design Principles
- Minimalistic and extremely clean
- Soft white backgrounds with light gray cards
- Smooth shadows and rounded corners
- Premium, peaceful, and focused feeling
- Apple/Notion/Linear inspired aesthetic
- Full responsive mobile-first design

## Development Notes
- All user data stored in Google Drive AppData folder as JSON files
- No traditional database required
- Service workers handle offline functionality
- PWA installable on mobile devices
- Data syncs automatically when connection restored
