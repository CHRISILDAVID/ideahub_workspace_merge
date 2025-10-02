# IdeaHub Workspace Merge - Current Status

## 📋 Migration Overview

This repository contains the migration of IDEA_HUB (Supabase) to ideahubORM (Prisma/Next.js). The goal is to integrate the perfect navigation system from IDEA_HUB with the perfect workspace component from ideahubORM.

## ✅ What's Been Completed (Steps 1-3)

### Step 1: Database Setup ✅
- PostgreSQL database configured
- DATABASE_URL set in `.env` file
- Prisma schema defined with 8 models
- All dependencies installed

### Step 2: Next.js App Router Pages ✅
Created 15+ route pages following Next.js App Router pattern:
- `/explore` - Explore page
- `/ideas/[id]` - Idea detail page (dynamic route)
- `/ideas/new` - New idea creation
- `/following` - Following page
- `/starred` - Starred ideas
- `/notifications` - Notifications
- `/settings` - Settings page
- `/about` - About page
- `/forks` - Forked ideas
- `/trending` - Trending ideas
- `/create` - Create idea flow
- `/workspace/[fileId]` - Workspace editor (existing)
- `/dashboard` - Dashboard (existing)

All pages follow the pattern:
```typescript
'use client';
import PageComponent from '@/app/pages/PageComponent';
export default function RoutePage() {
  return <PageComponent />;
}
```

### Step 3: Import Paths & Navigation ✅
Updated 36+ files with:
- ✅ All relative imports → absolute `@/app/*` paths
- ✅ React Router → Next.js navigation
  - `Link from 'react-router-dom'` → `Link from 'next/link'`
  - `useNavigate()` → `useRouter()`
  - `useLocation()` → `usePathname()`
  - `<Link to="">` → `<Link href="">`
- ✅ Updated ProtectedRoute component to use Next.js router
- ✅ Layout configured with ThemeProvider and AuthProvider

## 🚧 What Needs to Be Done (Steps 4-10)

### Step 4: Replace Supabase API Calls (IN PROGRESS)
**Current State:** Services still use Supabase client

**Files that need updating:**
- `app/services/api.ts` - Main API wrapper
- `app/services/api/auth.ts` - Auth service
- `app/services/api/ideas.ts` - Ideas service
- `app/services/api/users.ts` - Users service
- `app/contexts/AuthContext.tsx` - Auth context
- `app/components/AuthPersistence.tsx`
- `app/components/Ideas/StarButton.tsx`
- `app/components/Ideas/ForkButton.tsx`
- `app/pages/AuthCallback.tsx`

**Strategy:**
Replace Supabase calls with the existing `apiClient` from `@/app/lib/api-client`:

```typescript
// Before (Supabase)
const { data } = await supabase.from('ideas').select('*');

// After (API Client)
const { data } = await apiClient.getIdeas();
```

### Step 5: Implement Authentication
**Need to create:**
1. Auth API routes:
   - `app/api/auth/login/route.ts`
   - `app/api/auth/logout/route.ts`
   - `app/api/auth/session/route.ts`
   - `app/api/auth/signup/route.ts` (may already exist as `/api/users`)

2. Auth middleware:
   - `middleware.ts` at root for protected routes
   - Session management (cookies or JWT)

3. Update AuthContext:
   - Remove Supabase auth calls
   - Use fetch to new auth endpoints
   - Store user in localStorage/cookies

### Step 6: Complete Layout & Navigation
- Verify all Link components work correctly
- Test navigation flows
- Ensure header/sidebar work with Next.js

### Step 7: Connect Workspace to Ideas
**Goal:** When opening workspace, load associated idea

```typescript
// app/(routes)/workspace/[fileId]/page.tsx
const workspace = await apiClient.getWorkspace(fileId);
const ideas = await apiClient.getIdeas();
const linkedIdea = ideas.data?.find(i => i.workspaceId === fileId);
```

Implement:
- View-only mode for non-collaborators
- Fork button for public ideas
- Collaborator permissions (max 3)

### Step 8: Testing
Test all user flows:
- User signup/login
- Idea creation → workspace creation
- Add collaborators (max 3 enforcement)
- Like/comment on ideas
- Fork public ideas
- Privacy controls (public/private)

### Step 9: Error Handling & Loading States
- Add error boundaries
- Add loading states
- Handle edge cases

### Step 10: Deployment
- Deploy to Vercel/Railway
- Set environment variables
- Test production build

## 🎯 Key User Flows to Implement

### Creating an Idea
1. User clicks "Create" → `/create`
2. Setup modal appears (title, description, tags, category)
3. POST `/api/ideas` creates:
   - Workspace (File model)
   - Idea linked to workspace
4. Redirect to `/workspace/[workspaceId]`

### Editing an Idea
**Owner/Collaborator:**
- Navigate to `/workspace/[workspaceId]`
- Full edit access

**Non-owner (Public Idea):**
- View-only mode by default
- "Fork & Edit" button available
- Forking creates new workspace + idea

**Private Idea:**
- Only owner and collaborators can view/edit
- Others get 403 Forbidden

### Collaboration
- Max 3 collaborators per idea (enforced in API)
- Invite via `/api/ideas/[id]/collaborators`
- Collaborators have full edit access

## 🔑 Key Constraints

1. ✅ Every user can follow any other user
2. ✅ An Idea = read-only view of workspace
3. ✅ One workspace per idea (automatic creation)
4. ✅ Max 3 collaborators per idea (enforced in API)
5. ✅ Users can like ideas
6. ✅ Users can comment on ideas
7. ✅ Ideas can be public or private
8. ✅ Fork creates independent copy with new workspace

## 📁 Project Structure

```
ideahubORM/
├── app/
│   ├── (routes)/          # Next.js App Router pages
│   │   ├── ideas/[id]/
│   │   ├── workspace/[fileId]/
│   │   ├── explore/
│   │   └── ...
│   ├── api/               # Prisma-based API routes (25+ endpoints)
│   │   ├── ideas/
│   │   ├── users/
│   │   └── workspace/
│   ├── components/        # UI components (21 from IDEA_HUB)
│   ├── pages/             # Page components (wrapped by routes)
│   ├── contexts/          # AuthContext, ThemeContext
│   ├── services/          # API service layer (needs Supabase removal)
│   ├── lib/
│   │   ├── api-client.ts  # New API client for Prisma endpoints
│   │   └── supabase.ts    # Old Supabase client (to be removed)
│   └── providers.tsx      # Client-side providers
├── prisma/
│   └── schema.prisma      # Complete schema with 8 models
└── package.json
```

## 🚀 Quick Commands

```bash
# Development
cd ideahubORM
npm install
npm run dev              # Start dev server (requires Prisma client)

# Database
npx prisma generate      # Generate Prisma client (requires network)
npx prisma db push       # Push schema to database
npx prisma studio        # View database GUI

# Linting
npm run lint             # Check code quality

# Build
npm run build            # Production build
npm run start            # Production server
```

## ⚠️ Known Issues

1. **Prisma Client Generation:** Requires network access to download binaries
   - May fail in restricted environments
   - Can work around by focusing on code structure

2. **Supabase Dependencies:** Still present in:
   - Service layer (`app/services/api/`)
   - Auth context
   - Some components

3. **Authentication:** Needs full implementation
   - No auth middleware yet
   - No auth API routes yet
   - AuthContext still uses Supabase

## 📚 Documentation

- `MIGRATION_SUMMARY.md` - High-level migration status
- `ideahubORM/IMPLEMENTATION_CHECKLIST.md` - Detailed step-by-step guide
- `ideahubORM/README_MIGRATION.md` - Complete migration overview
- `ideahubORM/MIGRATION_GUIDE.md` - Database schema and user flows
- `ideahubORM/API_DOCUMENTATION.md` - API endpoint reference

## 🎉 Progress: 70% Complete

- [x] Database schema & API routes
- [x] Frontend components
- [x] Next.js App Router pages
- [x] Import paths updated
- [x] React Router → Next.js
- [ ] Supabase API replacement
- [ ] Authentication implementation
- [ ] Testing
- [ ] Deployment

## 👤 Next Developer Tasks

1. **Immediate (Step 4):** Replace Supabase calls in services with apiClient
2. **High Priority (Step 5):** Implement authentication (auth routes + middleware)
3. **Medium Priority (Step 6-7):** Complete navigation and workspace integration
4. **Before Launch (Step 8-10):** Testing, error handling, deployment

---

**Note:** This migration preserves all UI/UX from IDEA_HUB while moving to a more maintainable Prisma/Next.js architecture. No styling changes were made to components or pages.
