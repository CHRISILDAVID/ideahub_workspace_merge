# Quick Start Guide - Test Your Migration

Get the migrated application running in **under 10 minutes**.

## Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud)

## Step 1: Setup Database (2 minutes)

### Option A: Local PostgreSQL
```bash
# Create database
createdb ideahub

# Set environment variable
cd ideahubORM
echo 'DATABASE_URL="postgresql://localhost:5432/ideahub"' > .env
```

### Option B: Cloud Database (Recommended for testing)

**Railway** (Free tier):
```bash
# Visit railway.app, create PostgreSQL database
# Copy connection string
cd ideahubORM
echo 'DATABASE_URL="your-connection-string"' > .env
```

**Supabase** (Free tier):
```bash
# Create new Supabase project
# Go to Settings > Database > Connection string (Prisma format)
cd ideahubORM
echo 'DATABASE_URL="your-connection-string"' > .env
```

## Step 2: Install & Initialize (3 minutes)

```bash
cd ideahubORM

# Install dependencies (if not already done)
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Verify with Prisma Studio
npx prisma studio
# Opens at http://localhost:5555
```

## Step 3: Start Development Server (1 minute)

```bash
npm run dev
```

Open http://localhost:3000

## Step 4: Test API Endpoints (3 minutes)

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "fullName": "Test User",
    "password": "password123"
  }'
```

**Copy the user ID from response!**

### Create an Idea (with automatic workspace)
```bash
curl -X POST http://localhost:3000/api/ideas \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "My First Idea",
    "description": "Testing the migration",
    "content": "This is the content",
    "category": "Technology",
    "authorId": "YOUR_USER_ID_HERE",
    "tags": ["test", "migration"]
  }'
```

**Note:** A workspace is automatically created! Copy the idea ID and workspace ID.

### Get the Workspace
```bash
curl http://localhost:3000/api/workspace/WORKSPACE_ID
```

### List All Ideas
```bash
curl http://localhost:3000/api/ideas
```

### Add a Collaborator
```bash
# First create another user, then:
curl -X POST http://localhost:3000/api/ideas/IDEA_ID/collaborators \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "COLLABORATOR_USER_ID"
  }'
```

### Test Max 3 Collaborators
```bash
# Try adding a 4th collaborator (should fail)
curl -X POST http://localhost:3000/api/ideas/IDEA_ID/collaborators \
  -H 'Content-Type: application/json' \
  -d '{"userId": "FOURTH_USER_ID"}'

# Should return: {"error":"Maximum of 3 collaborators allowed per idea"}
```

### Like an Idea
```bash
curl -X POST http://localhost:3000/api/ideas/IDEA_ID/like \
  -H 'Content-Type: application/json' \
  -d '{"userId": "YOUR_USER_ID"}'

# Returns: {"liked":true,"stars":1}
```

### Fork an Idea
```bash
curl -X POST http://localhost:3000/api/ideas/IDEA_ID/fork \
  -H 'Content-Type: application/json' \
  -d '{"userId": "ANOTHER_USER_ID"}'

# Creates new workspace + idea with copied data
```

### Comment on Idea
```bash
curl -X POST http://localhost:3000/api/ideas/IDEA_ID/comments \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "Great idea!",
    "authorId": "YOUR_USER_ID"
  }'
```

## Step 5: View Database (1 minute)

```bash
npx prisma studio
```

Navigate to http://localhost:5555 and explore:
- Users table
- Ideas table
- Files table (workspaces)
- Collaborators table
- Likes table
- Comments table

## 🎯 What to Verify

### ✅ Checklist

- [ ] Database connected successfully
- [ ] User creation works
- [ ] Idea creation auto-creates workspace
- [ ] Workspace is linked to idea (workspaceId field)
- [ ] Can add up to 3 collaborators
- [ ] Cannot add 4th collaborator
- [ ] Like/unlike toggles correctly
- [ ] Fork creates new workspace + idea
- [ ] Comments can be created
- [ ] Follow/unfollow works

## 🐛 Troubleshooting

### "Module not found: @/app/..."
This is expected - components need import path updates. The API routes work independently.

### "Cannot find module 'prisma'"
```bash
npm install prisma @prisma/client
npx prisma generate
```

### "Connection refused"
Check your DATABASE_URL is correct and database is running.

### "Schema not found"
```bash
npx prisma db push
```

## 📊 Test Results

After testing, you should see:

### In Database (Prisma Studio)
- User(s) in Users table
- Idea(s) in Ideas table  
- File(s) in Files table (workspaces)
- Collaborator(s) in Collaborators table
- Like(s) in Likes table
- Comment(s) in Comments table

### In API Responses
- User ID after signup
- Idea + Workspace created together
- Workspace has idea's title as fileName
- Idea has workspaceId pointing to File
- Fork creates duplicate workspace with new ID

## 🚀 Next Steps

Once basic testing works:

1. **Implement Authentication**
   - Add login API endpoint
   - Create session management
   - Protect routes with middleware

2. **Create Page Routes**
   - Convert React pages to Next.js App Router
   - See IMPLEMENTATION_CHECKLIST.md

3. **Update Components**
   - Fix import paths
   - Replace Supabase calls with API client

4. **Deploy**
   - Push to GitHub
   - Deploy to Vercel/Railway
   - Set environment variables

## 📚 More Resources

- **Complete Setup**: `MIGRATION_GUIDE.md`
- **API Reference**: `API_DOCUMENTATION.md`
- **Implementation**: `IMPLEMENTATION_CHECKLIST.md`
- **Overview**: `README_MIGRATION.md`

## ⏱️ Time Breakdown

- Database setup: 2 min
- Install & init: 3 min
- Start server: 1 min
- Test APIs: 3 min
- **Total: ~10 minutes**

## 🎉 Success!

If all API tests pass, your migration is working correctly! The backend is fully functional and ready for frontend integration.

**Next**: Follow `IMPLEMENTATION_CHECKLIST.md` to complete the integration.
