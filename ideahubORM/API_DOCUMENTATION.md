# IdeaHub API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

Currently using session-based authentication. Include credentials in requests.

---

## Ideas

### List Ideas
```
GET /api/ideas
```

**Query Parameters:**
- `category` (string, optional): Filter by category
- `language` (string, optional): Filter by programming language
- `query` (string, optional): Search in title/description
- `sort` (string, optional): Sort order
  - `newest` (default)
  - `oldest`
  - `most-stars`
  - `most-forks`
  - `recently-updated`
- `visibility` (string, optional): Filter by visibility (PUBLIC/PRIVATE)

**Response:**
```json
[
  {
    "id": "clx...",
    "title": "My Awesome Idea",
    "description": "A revolutionary concept",
    "content": "...",
    "authorId": "cly...",
    "tags": ["innovation", "tech"],
    "category": "Technology",
    "stars": 42,
    "forks": 5,
    "visibility": "PUBLIC",
    "workspaceId": "clz...",
    "author": {
      "id": "cly...",
      "username": "johndoe",
      "fullName": "John Doe",
      "avatarUrl": "..."
    },
    "_count": {
      "likes": 42,
      "comments": 15
    }
  }
]
```

### Create Idea
```
POST /api/ideas
```

**Body:**
```json
{
  "title": "My Idea",
  "description": "Description here",
  "content": "Detailed content",
  "authorId": "user_id",
  "category": "Technology",
  "tags": ["tag1", "tag2"],
  "visibility": "PUBLIC",
  "language": "JavaScript",
  "license": "MIT",
  "status": "PUBLISHED"
}
```

**Response:**
```json
{
  "id": "clx...",
  "title": "My Idea",
  "workspaceId": "clz...",
  "workspace": {
    "id": "clz...",
    "fileName": "My Idea",
    "document": null,
    "whiteboard": null
  },
  ...
}
```

**Note:** Workspace is automatically created when creating an idea.

### Get Idea
```
GET /api/ideas/[id]
```

**Response:**
```json
{
  "id": "clx...",
  "title": "My Idea",
  "author": { ... },
  "workspace": { ... },
  "collaborators": [
    {
      "id": "col_id",
      "role": "COLLABORATOR",
      "user": {
        "id": "user_id",
        "username": "jane",
        "fullName": "Jane Smith"
      }
    }
  ],
  "_count": {
    "likes": 42,
    "comments": 15,
    "forks_rel": 5
  }
}
```

### Update Idea
```
PATCH /api/ideas/[id]
```

**Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "visibility": "PRIVATE"
}
```

### Delete Idea
```
DELETE /api/ideas/[id]
```

---

## Collaborators

### List Collaborators
```
GET /api/ideas/[id]/collaborators
```

**Response:**
```json
[
  {
    "id": "col_id",
    "ideaId": "idea_id",
    "userId": "user_id",
    "role": "COLLABORATOR",
    "invitedAt": "2025-01-01T00:00:00Z",
    "user": {
      "id": "user_id",
      "username": "collaborator1",
      "fullName": "Collaborator One"
    }
  }
]
```

### Add Collaborator
```
POST /api/ideas/[id]/collaborators
```

**Body:**
```json
{
  "userId": "user_id",
  "role": "COLLABORATOR"
}
```

**Validation:**
- Maximum 3 collaborators per idea
- Returns 400 if limit exceeded
- Returns 400 if user already a collaborator

**Response:**
```json
{
  "id": "col_id",
  "ideaId": "idea_id",
  "userId": "user_id",
  "role": "COLLABORATOR",
  "user": { ... }
}
```

### Remove Collaborator
```
DELETE /api/ideas/[id]/collaborators?userId={userId}
```

---

## Likes

### Toggle Like
```
POST /api/ideas/[id]/like
```

**Body:**
```json
{
  "userId": "user_id"
}
```

**Response:**
```json
{
  "liked": true,
  "stars": 1
}
```

If already liked, unlikes and returns:
```json
{
  "liked": false,
  "stars": -1
}
```

### Check Like Status
```
GET /api/ideas/[id]/like?userId={userId}
```

**Response:**
```json
{
  "liked": true
}
```

---

## Comments

### List Comments
```
GET /api/ideas/[id]/comments
```

**Response:**
```json
[
  {
    "id": "comment_id",
    "content": "Great idea!",
    "authorId": "user_id",
    "ideaId": "idea_id",
    "parentId": null,
    "votes": 5,
    "createdAt": "2025-01-01T00:00:00Z",
    "author": {
      "id": "user_id",
      "username": "commenter",
      "fullName": "Commenter Name"
    },
    "replies": [
      {
        "id": "reply_id",
        "content": "Thanks!",
        "parentId": "comment_id",
        "author": { ... }
      }
    ]
  }
]
```

### Create Comment
```
POST /api/ideas/[id]/comments
```

**Body:**
```json
{
  "content": "This is a comment",
  "authorId": "user_id",
  "parentId": "parent_comment_id"  // optional, for replies
}
```

---

## Fork

### Fork Idea
```
POST /api/ideas/[id]/fork
```

**Body:**
```json
{
  "userId": "user_id"
}
```

**What happens:**
1. Creates new workspace with copied data
2. Creates new idea linked to new workspace
3. Sets isFork=true and forkedFromId
4. Increments original idea's fork count

**Response:**
```json
{
  "id": "new_idea_id",
  "title": "Original Title (Fork)",
  "isFork": true,
  "forkedFromId": "original_idea_id",
  "workspaceId": "new_workspace_id",
  "workspace": {
    "id": "new_workspace_id",
    "document": { ... },  // copied from original
    "whiteboard": { ... }  // copied from original
  }
}
```

**Restrictions:**
- Only public ideas can be forked
- Returns 403 for private ideas

---

## Users

### Sign Up
```
POST /api/users
```

**Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "fullName": "John Doe",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "username": "johndoe",
  "fullName": "John Doe",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

**Note:** Password is hashed with bcrypt before storage.

### Search Users
```
GET /api/users?query={searchTerm}
```

**Response:**
```json
[
  {
    "id": "user_id",
    "username": "johndoe",
    "fullName": "John Doe",
    "avatarUrl": "...",
    "bio": "...",
    "followers": 100,
    "following": 50
  }
]
```

### Get User Profile
```
GET /api/users/[id]
```

**Response:**
```json
{
  "id": "user_id",
  "username": "johndoe",
  "fullName": "John Doe",
  "avatarUrl": "...",
  "bio": "...",
  "location": "San Francisco",
  "website": "https://example.com",
  "joinedAt": "2024-01-01T00:00:00Z",
  "followers": 100,
  "following": 50,
  "publicRepos": 25,
  "isVerified": false,
  "_count": {
    "ideas": 25
  }
}
```

### Update Profile
```
PATCH /api/users/[id]
```

**Body:**
```json
{
  "fullName": "John Smith",
  "bio": "Software Engineer",
  "location": "New York",
  "website": "https://johnsmith.com",
  "avatarUrl": "https://..."
}
```

---

## Follow

### Toggle Follow
```
POST /api/users/[id]/follow
```

**Body:**
```json
{
  "followerId": "current_user_id"
}
```

**Response:**
```json
{
  "following": true
}
```

If already following, unfollows and returns:
```json
{
  "following": false
}
```

**What happens:**
- Creates/deletes Follow record
- Updates follower/following counts on both users

### Check Follow Status
```
GET /api/users/[id]/follow?followerId={followerId}
```

**Response:**
```json
{
  "following": true
}
```

---

## Workspace

### Get Workspace
```
GET /api/workspace/[id]
```

**Response:**
```json
{
  "id": "workspace_id",
  "fileName": "My Workspace",
  "document": { /* EditorJS data */ },
  "whiteboard": { /* Excalidraw data */ },
  "archived": false,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### Update Workspace
```
PATCH /api/workspace/[id]
```

**Body:**
```json
{
  "document": { /* EditorJS data */ },
  "whiteboard": { /* Excalidraw data */ }
}
```

### Create Workspace
```
POST /api/workspace
```

**Body:**
```json
{
  "fileName": "New Workspace"
}
```

**Note:** Usually created automatically when creating an idea.

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message here"
}
```

Common status codes:
- `400` - Bad Request (validation error, missing fields)
- `403` - Forbidden (permission denied)
- `404` - Not Found
- `500` - Internal Server Error

---

## Business Rules

### Collaborators
- **Maximum 3 collaborators per idea**
- Owner is not counted as a collaborator
- Enforced at API level (returns 400 if exceeded)

### Ideas
- Workspace is auto-created when idea is created
- One workspace per idea (one-to-one relationship)
- Deleting idea cascades to workspace

### Forks
- Only public ideas can be forked
- Fork creates new workspace with copied data
- Original workspace data is deep-copied to fork

### Privacy
- PUBLIC ideas: Anyone can view, non-owners can fork
- PRIVATE ideas: Only owner and collaborators can view/edit

### Workspace Access
- Owner: Full access
- Collaborators: Full access
- Others (public ideas): Read-only
- Others (private ideas): No access
