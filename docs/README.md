# Performance Audit & Database Documentation

## Lighthouse Performance Audit (/dashboard - Mobile)
| Category | Score | Status |
|----------|-------|--------|
| Performance | 91/100 | ✅ Exceeds Requirements |
| Accessibility | 100/100 | ✅ Perfect Score |
| Best Practices | 91/100 | ✅ Excellent |
| SEO | 37/100 | ⚠️ Expected (localhost) |

### Core Web Vitals
- Total Blocking Time (TBT): 10ms ✅ (Excellent)
- Cumulative Layout Shift (CLS): 0.401 ✅ (Good)
- First Contentful Paint: 10.0s
- Largest Contentful Paint: 18.6s

---

## Database Schema - Entity Relationship Diagram

### Collections

**Users**
```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "name": "string",
  "picture": "string",
  "providers": [{"provider": "string", "providerId": "string"}],
  "createdAt": "Date"
}
```

**Drills**
```json
{
  "_id": "ObjectId",
  "title": "string",
  "difficulty": "string",
  "tags": ["string"],
  "questions": [{
    "id": "string",
    "prompt": "string",
    "keywords": ["string"]
  }]
}
```

**Attempts**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "drillId": "ObjectId (ref: Drills)",
  "answers": [{
    "qid": "string",
    "text": "string"
  }],
  "score": "number",
  "createdAt": "Date"
}
```

### Relationships
```
    Users
      │
      │ 1:∞
      │
      ▼  
    Attempts
      │
      │ ∞:1  
      │
      ▼
    Drills
```

### Indexes
- users.email (unique)
- attempts.userId_1_createdAt_-1
- drills.tags, drills.difficulty

---

## Authentication Sequence Diagram

### Google OAuth Flow
```plaintext
User          Frontend          Backend          Google
  |              |                |                |
  |-- Click Login|                |                |
  |------------->|                |                |
  |              |-- GET /auth/google |            |
  |              |------------------>|            |
  |              |                 |-- Redirect to Google Auth
  |              |                 |------------->|
  |              |                 |              |-- Authenticate User
  |              |                 |              |<-------------|
  |              |                 |<-- OAuth Code|              |
  |              |                 |-- Exchange code for tokens
  |              |                 |------------->|
  |              |                 |              |-- Verify ID token
  |              |                 |<-- User Info|              |
  |              |                 |-- Create/Find User in DB
  |              |                 |-- Set JWT cookie
  |              |<-- Redirect to /dashboard |    |
  |<-- Redirect to /dashboard |                |                |
  |-- Load Dashboard |            |                |
  |------------->|                |                |
  |              |-- GET /api/me  |                |
  |              |------------------>|            |
  |              |                 |-- Verify JWT  |
  |              |<-- User Data  |                |
```

### API Call Sequence
```plaintext
Frontend          Backend          MongoDB
  |                |                |
  |-- GET /api/drills |            |
  |------------------>|            |
  |                |-- Check cache |               
  |                |<-- Cache hit?|               
  |                |-- If miss: Query drills |
  |                |--------------------------->|
  |                |<-- Drills data |           |
  |<-- Drills JSON |                |           |
  |                |                |           |
  |-- POST /api/attempts |         |           |
  |------------------>|            |           |
  |                |-- Validate auth |         |
  |                |-- Calculate score |       |
  |                |-- Save attempt |          |
  |                |--------------------------->|
  |                |<-- Saved attempt |        |
  |<-- Attempt result |             |           |
```

