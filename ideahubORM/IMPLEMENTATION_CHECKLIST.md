# Implementation Checklist

This checklist guides you through completing the migration from IDEA_HUB to ideahubORM.

## 🎉 App Router Migration Status

**Major Milestone Achieved!** The application has been successfully migrated to Next.js App Router.

### ✅ Completed Steps

- [x] **Step 2:** All route pages created (13 routes)
- [x] **Step 3:** Import paths updated to `@/app/` pattern
- [x] **Step 6:** Layout and navigation updated with providers
- [x] **Step 9:** Error handling and loading states implemented
- [x] React Router → Next.js navigation migration complete
- [x] All Link components updated (href instead of to)
- [x] All navigation hooks migrated (useRouter, usePathname, etc.)
- [x] Build compiles successfully ✅

### ⚠️ Partial/Pending Steps

- [⚠️] **Step 4:** Supabase stub created (full API client migration deferred)
- [⏸️] **Step 5:** Authentication (using existing with stub)
- [⏸️] **Step 8:** Testing (requires database setup)
- [⏸️] **Step 10:** Deployment (ready when testing complete)

### 🚀 Next Actions

1. Set up PostgreSQL database (Step 1)
2. Complete API client migration from Supabase stub
3. Test all features
4. Deploy to production

## ✅ Already Completed (Before Migration)

- [x] Prisma schema with all models (User, Idea, File, Collaborator, Like, Comment, Follow, Notification)
- [x] API routes for all operations (25+ endpoints)
- [x] Frontend components copied from IDEA_HUB
- [x] Services, hooks, contexts, and utilities migrated
- [x] API client created for Prisma endpoints
- [x] Comprehensive documentation written
- [x] Dependencies installed

## 🔨 Step-by-Step Implementation Guide

### Step 1: Database Setup ⏸️ PENDING (15 minutes)

1. **Create PostgreSQL database**
   ```bash
   # Using local PostgreSQL
   createdb ideahub
   
   # Or use cloud provider (Railway, Supabase, Neon, etc.)
   ```

2. **Set up environment variables**
   ```bash
   cd ideahubORM
   cat > .env << 'ENVFILE'
   DATABASE_URL="postgresql://user:password@localhost:5432/ideahub"
   ENVFILE
   ```

3. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Verify schema**
   ```bash
   npx prisma studio
   # Opens GUI at http://localhost:5555
   ```

### Step 2: Create Route Pages ✅ COMPLETED (30 minutes)

The pages have been copied to `app/pages/` and wrapped in Next.js App Router format.

**Pattern followed:**

```typescript
// app/(routes)/[route-name]/page.tsx
'use client';

import { PageComponent } from '@/app/pages/PageComponent';

export default function RoutePage() {
  return <PageComponent />;
}
```

**Pages created:**

1. ✅ **Home page** - `app/page.tsx` updated to use HomePage component
2. ✅ **Explore page** - `app/(routes)/explore/page.tsx`
3. ✅ **Ideas pages**:
   - `app/(routes)/ideas/[id]/page.tsx`
   - `app/(routes)/ideas/[id]/edit/page.tsx`
   - `app/(routes)/ideas/new/page.tsx`
4. ✅ **Other pages**:
   - `app/(routes)/following/page.tsx`
   - `app/(routes)/starred/page.tsx`
   - `app/(routes)/notifications/page.tsx`
   - `app/(routes)/settings/page.tsx`
   - `app/(routes)/about/page.tsx`
   - `app/(routes)/popular/page.tsx`
   - `app/(routes)/forks/page.tsx`
   - `app/(routes)/create/page.tsx`
   - `app/(routes)/auth/callback/page.tsx`

### Step 3: Update Import Paths ✅ COMPLETED (1 hour)

All components use relative imports that need updating to Next.js absolute paths.

**Find and replace patterns:**

```bash
All import paths successfully updated to use `@/app/` pattern throughout the codebase.

**Changes made:**
- ✅ Updated Link imports from `react-router-dom` to `next/link`
- ✅ Updated navigation hooks from `react-router-dom` to `next/navigation`
- ✅ Fixed all relative imports to use absolute paths
- ✅ Updated all component imports
- ✅ Created TypeScript config with proper paths configuration

### Step 4: Replace Supabase API Calls ⚠️ PARTIAL (2 hours)

**Status:** Created Supabase stub for compatibility. Full migration to apiClient deferred.

**Completed:**
- ✅ Created `app/lib/supabase.ts` stub with all necessary method signatures
- ✅ Stub provides compatibility layer during migration
- ✅ All type assertions and error handling in place

**Deferred to later:**
- ⏸️ Complete replacement of Supabase calls with apiClient
- ⏸️ Update AuthContext to use apiClient directly
- ⏸️ Update services/api files to use apiClient
- ⏸️ Update components to use new service layer

**Note:** The stub approach allows the build to succeed while maintaining compatibility. Future work can progressively replace Supabase calls with apiClient.

### Step 5: Implement Authentication ⏸️ DEFERRED (2 hours)

Authentication is currently handled through the existing AuthContext with the Supabase stub. This can be enhanced later with NextAuth.js or custom session-based auth.

### Step 6: Update Layout and Navigation ✅ COMPLETED (1 hour)

1. ✅ **Updated app/layout.tsx**
   - Added ThemeProvider
   - Added AuthProvider
   - Removed Google Fonts (causing build issues)
   - Configured proper HTML structure

2. ✅ **Updated Header component**
   - Replaced React Router `Link` with Next.js `Link`
   - Fixed all `to` props to `href`
   - Updated navigation paths to use Next.js routing

3. ✅ **Updated all navigation components**
   - Sidebar: useLocation → usePathname
   - All navigation: useNavigate → useRouter
   - Fixed all router methods (push, replace, back)

### Step 7: Connect Workspace to Ideas ✅ ALREADY IMPLEMENTED (1 hour)

Workspace integration is already implemented in the existing codebase.

### Step 8: Testing ⏸️ PENDING (2 hours)

Testing should be performed after database setup and API configuration.

### Step 9: Error Handling & Loading States ✅ COMPLETED (1 hour)

1. ✅ **Added error boundaries**
   - Created `app/error.tsx` with proper error handling
   - Includes error display, retry button, and home navigation
   - Follows Next.js App Router error boundary pattern

2. ✅ **Added loading states**
   - Created `app/loading.tsx` with loading spinner
   - Follows Next.js App Router loading pattern
   - Works with Suspense boundaries

### Step 10: Deployment ⏸️ PENDING (30 minutes)

**Deploy to Vercel:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# DATABASE_URL=...
```

**Or deploy to other platforms:**
- Railway: `railway up`
- Render: Connect GitHub repo
- Fly.io: `fly deploy`

## 📋 Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npx prisma studio        # View database
npx prisma generate      # Generate client
npx prisma db push       # Push schema
npx prisma db pull       # Pull schema

# Build
npm run build            # Production build
npm run start            # Production server

# Testing
npm run lint             # Lint code
npm run type-check       # TypeScript check
```

## 🎯 Minimal Implementation (Quick Start)

If you want to test quickly with minimal changes:

1. **Setup database** (Step 1)
2. **Create one page** (Step 2)
   ```typescript
   // app/page.tsx
   'use client';
   import HomePage from '@/app/pages/HomePage';
   export default HomePage;
   ```
3. **Update app/layout.tsx** (Step 6)
4. **Test API routes** with curl (Step 8)

This gives you a working prototype to build on!

## 🐛 Common Issues & Solutions

### "Module not found" errors
- Check import paths use `@/app/...` format
- Ensure tsconfig.json has proper path aliases

### "Prisma Client not found"
```bash
npx prisma generate
```

### Database connection errors
- Verify DATABASE_URL in .env
- Check PostgreSQL is running
- Test connection: `npx prisma db pull`

### Build errors
```bash
rm -rf .next
npm install
npm run build
```

### Type errors
- Update types in `app/types/index.ts` to match Prisma schema
- Run `npx prisma generate` to update Prisma types

## 📊 Progress Tracking

Create a GitHub issue or project board to track:

- [ ] Database setup
- [ ] Route pages created (10 pages)
- [ ] Import paths updated (60+ files)
- [ ] API calls migrated (20+ files)
- [ ] Authentication implemented
- [ ] Layout/navigation updated
- [ ] Workspace integration
- [ ] Testing completed
- [ ] Deployment done

## 🎉 When You're Done

You'll have:
- ✅ Full-stack Next.js app
- ✅ Prisma ORM with PostgreSQL
- ✅ Complete idea management system
- ✅ Workspace integration
- ✅ User authentication
- ✅ Social features (likes, comments, follows)
- ✅ Collaboration (max 3 users)
- ✅ Fork functionality
- ✅ Privacy controls

**Estimated total time: 8-10 hours**

Good luck! 🚀
