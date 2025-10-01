# IdeaHub Migration Guide

## Overview

This project is the result of migrating IDEA_HUB from Supabase to Prisma with Next.js. The existing workspace component has been preserved and integrated with a comprehensive idea management system.

## Architecture

### Database Schema (Prisma)

The application uses the following models:

1. **User** - User authentication and profiles
   - Authentication fields (email, username, passwordHash)
   - Profile information (fullName, avatarUrl, bio, location, website)
   - Social metrics (followers, following, publicRepos)

2. **Idea** - Main idea entity
   - Content fields (title, description, content, tags, category)
   - Metadata (license, version, visibility, status, language)
   - Social metrics (stars, forks)
   - One-to-one relationship with File (workspace)
   - Fork tracking (isFork, forkedFromId)

3. **File** - Workspace data (unchanged from original)
   - Document editor data (JSON)
   - Whiteboard/canvas data (JSON)
   - Linked to Idea via workspaceId

4. **Collaborator** - Idea collaborators
   - **Maximum 3 collaborators per idea** (enforced in API)
   - Roles: OWNER, COLLABORATOR

5. **Like** - Idea likes/stars
   - Unique constraint on (userId, ideaId)
   - Auto-updates idea.stars count

6. **Comment** - Nested comments
   - Supports replies via parentId
   - Vote tracking

7. **Follow** - User relationships
   - Unique constraint on (followerId, followingId)
   - Auto-updates user follow counts

8. **Notification** - User notifications
   - Types: STAR, FORK, COMMENT, MENTION, FOLLOW, COLLABORATION_INVITE

## API Routes

All API routes are located in `/app/api/`:

### Ideas
- `GET /api/ideas` - List ideas with filters (category, language, query, sort, visibility)
- `POST /api/ideas` - Create new idea (auto-creates workspace)
- `GET /api/ideas/[id]` - Get single idea with details
- `PATCH /api/ideas/[id]` - Update idea
- `DELETE /api/ideas/[id]` - Delete idea

### Collaborators
- `GET /api/ideas/[id]/collaborators` - List collaborators
- `POST /api/ideas/[id]/collaborators` - Add collaborator (max 3 enforced)
- `DELETE /api/ideas/[id]/collaborators?userId=X` - Remove collaborator

### Likes
- `POST /api/ideas/[id]/like` - Toggle like (body: {userId})
- `GET /api/ideas/[id]/like?userId=X` - Check like status

### Comments
- `GET /api/ideas/[id]/comments` - List comments with replies
- `POST /api/ideas/[id]/comments` - Add comment (body: {content, authorId, parentId?})

### Fork
- `POST /api/ideas/[id]/fork` - Fork idea (body: {userId})
  - Creates new workspace with copied data
  - Creates new idea linked to new workspace
  - Increments original idea fork count

### Users
- `POST /api/users` - Sign up (body: {email, username, fullName, password})
- `GET /api/users?query=X` - Search users
- `GET /api/users/[id]` - Get user profile
- `PATCH /api/users/[id]` - Update profile

### Follow
- `POST /api/users/[id]/follow` - Toggle follow (body: {followerId})
- `GET /api/users/[id]/follow?followerId=X` - Check follow status

### Workspace
- `GET /api/workspace/[id]` - Get workspace
- `PATCH /api/workspace/[id]` - Update workspace (body: {document?, whiteboard?})
- `POST /api/workspace` - Create workspace (body: {fileName})

## User Flow

### Creating an Idea

1. User clicks "Create" or navigates to `/create`
2. Setup modal appears prompting for:
   - Title (required)
   - Description (required)
   - Category (required)
   - Tags (optional)
   - Visibility (PUBLIC/PRIVATE)
3. On submit:
   - Workspace is created via `POST /api/ideas`
   - Idea is created and linked to workspace
   - User is redirected to workspace editor

### Editing an Idea

**Owner/Collaborator:**
- Navigate to `/workspace/[workspaceId]`
- Full edit access to both document and canvas
- Auto-save enabled

**Non-owner/collaborator (Public idea):**
- View-only mode by default
- "Fork & Edit" button available
- Forking creates a new workspace + idea under user's account

**Private idea:**
- Only owner and collaborators can view/edit
- Others get 403 Forbidden

### Collaboration

1. Idea owner can invite up to 3 collaborators
2. Navigate to idea settings/collaborators
3. Add user by username/email
4. Collaborators get full edit access to workspace

### Privacy Controls

- **PUBLIC**: Anyone can view, non-owners can fork
- **PRIVATE**: Only owner and collaborators can view/edit

## Frontend Components

### Migrated from IDEA_HUB

All components preserve original styling and functionality:

- **Components**
  - Auth: LoginForm, RegisterForm
  - Ideas: IdeaCard, IdeaList, StarButton, ForkButton
  - Canvas: CanvasEditor, DocumentEditor, IdeaSetupModal
  - Layout: Header, Sidebar

- **Pages** (need conversion to Next.js App Router)
  - HomePage
  - ExplorePage
  - CreatePage
  - IdeaDetailPage
  - IdeaCanvasPage
  - DashboardPage
  - FollowingPage
  - StarredPage
  - NotificationsPage
  - SettingsPage

- **Contexts**
  - AuthContext (needs adaptation for new API)
  - ThemeContext

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd ideahubORM
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env file
   DATABASE_URL="postgresql://user:password@localhost:5432/ideahub"
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Push schema to database:
   ```bash
   npx prisma db push
   ```

6. Run development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Testing

### Manual Testing Checklist

- [ ] User signup/login
- [ ] Create new idea (workspace created)
- [ ] Edit idea (owner access)
- [ ] View public idea (read-only)
- [ ] Fork public idea (new workspace created)
- [ ] Add collaborator (up to 3)
- [ ] Like/unlike idea
- [ ] Comment on idea
- [ ] Follow/unfollow user
- [ ] View private idea (access control)
- [ ] Update workspace (document + canvas)

### Test Collaborator Limit

```bash
# Add 3 collaborators (should succeed)
curl -X POST http://localhost:3000/api/ideas/{ideaId}/collaborators \
  -H 'Content-Type: application/json' \
  -d '{"userId":"user1"}'

# Add 4th collaborator (should fail with 400)
curl -X POST http://localhost:3000/api/ideas/{ideaId}/collaborators \
  -H 'Content-Type: application/json' \
  -d '{"userId":"user4"}'
```

## Key Differences from IDEA_HUB

1. **Database**: Supabase → Prisma + PostgreSQL
2. **Framework**: React + Vite → Next.js 14 (App Router)
3. **Authentication**: Supabase Auth → Custom (bcrypt)
4. **API**: Supabase Client → REST API routes
5. **Workspace**: New integration with existing File model

## Next Steps

1. Implement authentication middleware
2. Convert page components to Next.js App Router format
3. Add proper error boundaries
4. Implement loading states
5. Add real-time features (optional with Pusher/Socket.io)
6. Deploy to Vercel/Railway

## Migration Notes

- All frontend code from IDEA_HUB has been copied to preserve styling
- No changes made to existing workspace component
- API routes enforce business logic (max 3 collaborators, etc.)
- Workspace creation is automatic when creating an idea
- Fork functionality creates independent workspace copies

## Troubleshooting

### Prisma Client Not Found
```bash
npx prisma generate
```

### Database Connection Issues
Check DATABASE_URL in .env file

### Missing Dependencies
```bash
npm install
```

### Port Already in Use
```bash
# Change port in package.json or kill existing process
lsof -ti:3000 | xargs kill
```
