# Interview Drills - MERN Stack Application

A full-stack interview practice platform with Google OAuth authentication, drill management, and performance tracking. Built with the MERN stack and Dockerized for easy development.

## 🚀 Features

- *Google OAuth Authentication* - Secure login with Google SSO
- *Interview Drills* - Practice with 5-question technical interviews
- *Real-time Scoring* - Keyword-based scoring system
- *Attempt History* - Track your progress over time
- *Dockerized Setup* - Consistent development environment
- *Performance Optimized* - Caching and rate limiting
- *Responsive Design* - Works on desktop and mobile

## 📦 Tech Stack

- *Frontend*: React 18 + Vite + TypeScript + Tailwind CSS
- *Backend*: Node.js + Express + TypeScript
- *Database*: MongoDB 6.0
- *Authentication*: Google OAuth 2.0 + JWT
- *Containerization*: Docker + Docker Compose
- *Testing*: k6 (performance), Postman (API)

## 🏃‍♂ Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Google OAuth credentials

### 1. Clone and Setup

bash
git clone https://github.com/sharmaHarshit2000/interview-drills-mern.git
cd interview-drills-mern


### 2. Environment Setup

bash
# Copy environment examples
cp api/.env.example api/.env
cp web/.env.example web/.env.local


### 3. Configure Google OAuth

1. Go to Google Cloud Console
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:


http://localhost:4000/auth/google/callback


6. Update api/.env with your credentials:

env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback


### 4. Start with Docker

bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d


### 5. Access the Application

- Frontend: http://localhost:3000  
- Backend API: http://localhost:4000  
- Mongo Express: http://localhost:8081  
- API Health: http://localhost:4000/api/health
