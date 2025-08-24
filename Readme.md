# Interview Drills - MERN Stack Application

A full-stack interview practice platform with Google OAuth, drill system, and performance monitoring.

## 💾 Correct Folder Structure
```
interview-drills-mern/
├── README.md                 ← HERE! (Root level)
├── docker-compose.yml        ← Root level
├── .env.example              ← Root level  
├── k6/
│   └── script.js             ← k6 performance script
├── docs/
│   ├── ERD.png               ← Database diagram
│   ├── sequence-diagram.png  ← Auth flow diagram
│   └── lighthouse-screenshots.png ← Performance results
├── api/                      ← Backend code
│   ├── src/
│   ├── package.json
│   └── Dockerfile.api
└── web/                      ← Frontend code
    ├── src/
    ├── package.json
    └── Dockerfile.web
```

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/sharmaHarshit2000/interview-drills-mern.git
cd interview-drills-mern

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your Google OAuth credentials

# 3. Start with Docker
docker-compose up --build

# 4. Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
# Mongo Express: http://localhost:8081 (admin/password)
```

## 📋 Features
- ✅ Google OAuth Authentication
- ✅ Drill Dashboard with Filtering
- ✅ Interactive Drill Taking Interface
- ✅ Keyword-based Scoring System
- ✅ Attempt History Tracking
- ✅ Docker Containerization
- ✅ Performance Monitoring

## 🔧 Environment Variables

Create `.env` file from `.env.example`:

```env
# API
PORT=4000
MONGO_URI=mongodb://mongo:27017/upivot
JWT_SECRET=your-super-secret-jwt-key
SESSION_COOKIE_NAME=upivot_sid

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback

# Web
VITE_API_URL=http://localhost:4000/api
VITE_GOOGLE_OAUTH_URL=http://localhost:4000/api/auth/google
```

## 📚 API Endpoints
- `GET /api/health` - Health check
- `GET /api/drills` - List all drills (cached)
- `GET /api/drills/:id` - Get drill details
- `POST /api/attempts` - Submit drill answers
- `GET /api/attempts?limit=5` - Get attempt history
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback

## 🐳 Docker Setup
`docker-compose.yml` includes:
- MongoDB database
- Express.js API server
- React frontend
- Mongo Express admin UI

## 📊 Performance Results
**k6 Load Testing (300 RPS)**
- ✅ p95 Response Time: 8.29ms (Requirement: < 150ms)
- ✅ Throughput: 299 requests per second
- ✅ Total Requests: 36,050 handled

**Lighthouse Audit**
- ⚡ Performance: 91/100
- ♿ Accessibility: 100/100
- ✅ Best Practices: 91/100
- 🔍 SEO: 37/100 (localhost environment)

## 🎯 Google OAuth Setup
- Create project at Google Cloud Console
- Configure OAuth consent screen
- Add authorized origins: http://localhost:3000
- Add redirect URI: http://localhost:4000/api/auth/google/callback

## 🧒 Testing

```bash
# Run k6 performance tests
k6 run k6/script.js

# Run Lighthouse audit
lighthouse http://localhost:3000/dashboard --view
```

## 📁 Project Structure
```
interview-drills-mern/
├── api/                 # Express.js backend
├── web/                 # React frontend
├── docker-compose.yml   # Docker configuration
├── k6/                  # Performance tests
├── docs/                # Documentation
└── README.md            # This file
```

## 🤝 Known Limitations
- SEO score affected by localhost environment
- Basic responsive design implementation
- Production would require Redis for session storage
- Error handling could be more comprehensive

## 🚀 Future Enhancements
- LinkedIn OAuth integration
- Redis caching for sessions
- Advanced question types
- Real-time progress saving
- Deployment to cloud platform

## 💻 Demo & Repository
- **Live Demo (Loom Video):** [Your Loom Link](https://www.loom.com/share/your-loom-video-link)
- **GitHub Repository:** [https://github.com/sharmaHarshit2000/

## 📜 License
MIT License - see LICENSE file for details

