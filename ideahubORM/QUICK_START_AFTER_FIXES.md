# Quick Start Guide - After Migration Fixes

## What Was Fixed
All React Router references have been successfully migrated to Next.js App Router:
- ✅ 24 files updated
- ✅ Build succeeds without errors
- ✅ Dev server starts successfully

## How to Test the Site

### 1. Prerequisites
```bash
# Install dependencies (if not already done)
cd ideahubORM
npm install
```

### 2. Set Up Database

#### Option A: Use Existing PostgreSQL Database
```bash
# Create .env file
echo 'DATABASE_URL="postgresql://username:password@localhost:5432/ideahub"' > .env

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

#### Option B: Use Docker for Quick Setup
```bash
# Start PostgreSQL in Docker
docker run --name ideahub-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=ideahub -p 5432:5432 -d postgres

# Create .env file
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/ideahub"' > .env

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 3. Run Development Server
```bash
npm run dev
```

The site will be available at http://localhost:3000

### 4. Test Key Pages
- `/` - Home page
- `/explore` - Explore ideas
- `/trending` - Popular ideas
- `/login` - Login page
- `/register` - Register page
- `/dashboard` - User dashboard (requires login)
- `/ideas/new` - Create new idea (requires login)

## Build for Production
```bash
npm run build
npm start
```

## Expected Behavior
- ✅ Pages load without errors
- ✅ Navigation works (clicking links)
- ✅ Authentication flows work (login/register)
- ✅ Protected routes redirect to login when not authenticated
- ⚠️ API calls will fail if database is not set up

## Troubleshooting

### Error: "Cannot find module '@prisma/client'"
Run: `npx prisma generate`

### Error: Database connection failed
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in .env
3. Run: `npx prisma db push`

### Pages show blank or errors
1. Check browser console for errors
2. Check terminal for server errors
3. Ensure all dependencies are installed

## What's Already Working
- ✅ Next.js App Router navigation
- ✅ Client/Server component separation
- ✅ All routing hooks (useRouter, usePathname, useSearchParams)
- ✅ Link components
- ✅ Auth context providers
- ✅ Theme context provider
- ✅ Build system

## What Needs Database to Work
- User authentication
- Creating ideas
- Viewing user-specific data
- Comments and interactions
- Workspace functionality

## Additional Configuration (Optional)

### JWT Secret
Add to .env for authentication:
```bash
JWT_SECRET="your-secret-key-here"
```

### Other Environment Variables
See `.env.example` if it exists, or check `app/api/*/route.ts` files for required variables.
