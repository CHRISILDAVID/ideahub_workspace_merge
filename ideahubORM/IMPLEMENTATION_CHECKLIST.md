# Implementation Checklist

This checklist guides you through completing the migration from IDEA_HUB to ideahubORM.

## ✅ Already Completed

- [x] Prisma schema with all models (User, Idea, File, Collaborator, Like, Comment, Follow, Notification)
- [x] API routes for all operations (25+ endpoints)
- [x] Frontend components copied from IDEA_HUB
- [x] Services, hooks, contexts, and utilities migrated
- [x] API client created for Prisma endpoints
- [x] Comprehensive documentation written
- [x] Dependencies installed

## 🔨 Step-by-Step Implementation Guide

### Step 1: Database Setup (15 minutes)

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

### Step 2: Create Route Pages (30 minutes)

The pages have been copied to `app/pages/` but need to be wrapped in Next.js App Router format.

**Pattern to follow:**

```typescript
// app/(routes)/[route-name]/page.tsx
'use client';

import PageComponent from '@/app/pages/PageComponent';

export default function RoutePage() {
  return <PageComponent />;
}
```

**Pages to create:**

1. **Home page** (already exists at `app/page.tsx`)
   ```bash
   # Update app/page.tsx to use HomePage component
   ```

2. **Explore page**
   ```bash
   mkdir -p app/\(routes\)/explore
   # Create app/(routes)/explore/page.tsx
   ```

3. **Ideas pages**
   ```bash
   mkdir -p app/\(routes\)/ideas/\[id\]
   # Create app/(routes)/ideas/[id]/page.tsx
   # Create app/(routes)/ideas/new/page.tsx (already done as example)
   ```

4. **Other pages**
   ```bash
   mkdir -p app/\(routes\)/{following,starred,notifications,settings,about}
   # Create page.tsx for each
   ```

### Step 3: Update Import Paths (1 hour)

All components use relative imports that need updating to Next.js absolute paths.

**Find and replace patterns:**

```bash
# In all files under app/components, app/pages, app/contexts:
sed -i "s|from '../../|from '@/app/|g" app/**/*.tsx
sed -i "s|from '../|from '@/app/|g" app/**/*.tsx
sed -i "s|from './|from '@/app/components/|g" app/components/**/*.tsx
```

**Or manually:**
- `../../lib/supabase` → `@/lib/prisma`
- `../components/` → `@/app/components/`
- `../contexts/` → `@/app/contexts/`

### Step 4: Replace Supabase API Calls (2 hours)

**Files to update:**

1. **app/services/api/ideas.ts**
   - Replace `supabase.from('ideas')` with `apiClient.getIdeas()`
   - Replace all Supabase queries with API client calls

2. **app/services/api/auth.ts**
   - Replace `supabase.auth` with custom auth logic
   - Use `apiClient.createUser()` for signup
   - Implement session management

3. **app/services/api/users.ts**
   - Replace with `apiClient.getUser()`, etc.

4. **Components using services**
   - Update imports to use new service layer
   - Handle async/await properly

**Example migration:**

```typescript
// Before (Supabase)
const { data, error } = await supabase
  .from('ideas')
  .select('*')
  .eq('visibility', 'public');

// After (API Client)
const { data, error } = await apiClient.getIdeas({ 
  visibility: 'PUBLIC' 
});
```

### Step 5: Implement Authentication (2 hours)

**Option A: Simple Session-based Auth**

1. Create auth middleware
   ```typescript
   // middleware.ts
   import { NextResponse } from 'next/server';
   import type { NextRequest } from 'next/server';
   
   export function middleware(request: NextRequest) {
     const token = request.cookies.get('auth-token');
     if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
       return NextResponse.redirect(new URL('/login', request.url));
     }
     return NextResponse.next();
   }
   ```

2. Create login API
   ```typescript
   // app/api/auth/login/route.ts
   import bcrypt from 'bcryptjs';
   import prisma from '@/lib/prisma';
   
   export async function POST(req: Request) {
     const { email, password } = await req.json();
     const user = await prisma.user.findUnique({ where: { email } });
     
     if (!user || !await bcrypt.compare(password, user.passwordHash)) {
       return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
     }
     
     // Set session cookie
     // Return user data
   }
   ```

**Option B: NextAuth.js** (Recommended)

```bash
npm install next-auth
```

Create `app/api/auth/[...nextauth]/route.ts` following NextAuth docs.

### Step 6: Update Layout and Navigation (1 hour)

1. **Update app/layout.tsx**
   ```typescript
   import { ThemeProvider } from '@/app/contexts/ThemeContext';
   import { AuthProvider } from '@/app/contexts/AuthContext';
   import '@/app/idea-hub.css';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <ThemeProvider>
             <AuthProvider>
               {children}
             </AuthProvider>
           </ThemeProvider>
         </body>
       </html>
     );
   }
   ```

2. **Update Header component**
   - Replace React Router `Link` with Next.js `Link`
   - Update navigation paths

### Step 7: Connect Workspace to Ideas (1 hour)

**Update workspace route to accept idea context:**

```typescript
// app/(routes)/workspace/[fileId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/app/lib/api-client';

export default function WorkspacePage({ params }) {
  const [idea, setIdea] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  
  useEffect(() => {
    // Load workspace
    apiClient.getWorkspace(params.fileId).then(res => {
      setWorkspace(res.data);
      
      // Find associated idea
      apiClient.getIdeas().then(ideas => {
        const linkedIdea = ideas.data?.find(i => i.workspaceId === params.fileId);
        setIdea(linkedIdea);
      });
    });
  }, [params.fileId]);
  
  // Render workspace with idea context
}
```

### Step 8: Testing (2 hours)

**Test each flow:**

```bash
# 1. User signup
curl -X POST http://localhost:3000/api/users \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","username":"testuser","fullName":"Test User","password":"password123"}'

# 2. Create idea
curl -X POST http://localhost:3000/api/ideas \
  -H 'Content-Type: application/json' \
  -d '{"title":"Test Idea","description":"Testing","category":"Technology","authorId":"USER_ID"}'

# 3. Add collaborator
curl -X POST http://localhost:3000/api/ideas/IDEA_ID/collaborators \
  -H 'Content-Type: application/json' \
  -d '{"userId":"COLLABORATOR_ID"}'

# 4. Fork idea
curl -X POST http://localhost:3000/api/ideas/IDEA_ID/fork \
  -H 'Content-Type: application/json' \
  -d '{"userId":"FORKER_ID"}'
```

**UI Testing:**
- [ ] Navigate to http://localhost:3000
- [ ] Sign up new user
- [ ] Create new idea
- [ ] Edit workspace
- [ ] Add collaborator (test max 3)
- [ ] Like idea
- [ ] Comment on idea
- [ ] Fork public idea
- [ ] Test privacy controls

### Step 9: Error Handling & Loading States (1 hour)

1. **Add error boundaries**
   ```typescript
   // app/error.tsx
   'use client';
   
   export default function Error({ error, reset }) {
     return (
       <div>
         <h2>Something went wrong!</h2>
         <button onClick={reset}>Try again</button>
       </div>
     );
   }
   ```

2. **Add loading states**
   ```typescript
   // app/loading.tsx
   export default function Loading() {
     return <div>Loading...</div>;
   }
   ```

### Step 10: Deployment (30 minutes)

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
