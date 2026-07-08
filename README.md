# 🚨 Disaster Relief Coordination Platform

A full-stack, real-time web platform that connects citizens, volunteers, and relief coordinators during a disaster — combining emergency reporting, resource management, volunteer coordination, live mapping, and chat into a single system.

Built as a Summer Training Project (CA2) at Lovely Professional University.

---

## 📖 Overview

During natural or man-made disasters, response efforts are often slowed down by delayed communication, poor coordination between agencies and volunteers, and inefficient allocation of resources like food, water, medical aid, and shelter. This platform addresses that gap by giving every stakeholder — a citizen reporting an emergency, a volunteer ready to help, or an administrator coordinating relief — a live, shared picture of the situation on the ground.

## ✨ Key Features

- 🔐 **Authentication** — Registration with role selection, OTP-based email verification, JWT-secured sessions, and password reset
- 🆘 **Emergency Reporting** — Report incidents with live location, images, type, and severity; track status through a full timeline
- 📦 **Resource Management** — CRUD operations for food, water, medical aid, and shelter, with request and deployment tracking
- 🙋 **Volunteer Coordination** — Volunteer registration with skills/availability, verification, and assignment to emergencies
- 💬 **Real-time Chat** — Emergency-specific chat rooms with typing indicators, read receipts, and file/image sharing
- 🗺️ **Interactive Live Map** — Emergency and resource markers color-coded by severity/availability, with filters
- 🔔 **Real-time Notifications** — Instant alerts for assignments, status changes, and messages
- 📊 **Admin Dashboard** — Live analytics on active emergencies, resources, and volunteers
- 🛡️ **Role-Based Access Control** — Distinct permissions for citizens, volunteers, and administrators

## 🔗 Live Demo

[disaster-relief-one.vercel.app](https://disaster-relief-one.vercel.app)

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, TypeScript, Tailwind CSS, Shadcn/ui, Framer Motion |
| Backend | Node.js, Express.js |
| Database / ORM | PostgreSQL (Neon Tech), Prisma ORM |
| Real-time | Socket.io |
| Authentication | JWT, Bcrypt, OTP verification |
| File Storage | Cloudinary |
| Email | Nodemailer |
| Testing | Postman |
| Version Control | Git & GitHub |

## 🏗️ Architecture

The platform follows a three-tier architecture:

- **Presentation layer** — React frontend (component-based, feature-organized)
- **Application layer** — Express REST API + Socket.io real-time layer, following an MVC pattern
- **Data layer** — PostgreSQL accessed through Prisma ORM

Standard CRUD operations flow through the REST API, while live features (chat, notifications, map updates) run over persistent WebSocket connections via Socket.io rooms scoped to each emergency.

## 📂 Project Structure

```
disaster_relief/
├── .vscode/                # Editor/workspace settings
├── backend/                # Node.js + Express + TypeScript API server
│   ├── src/
│   │   ├── controllers/    # Business logic per module
│   │   ├── routes/         # REST API route definitions
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── sockets/        # Socket.io event handlers
│   │   └── prisma/         # Prisma schema & migrations
│   └── package.json
├── frontend/                # React + TypeScript client
│   ├── src/
│   │   ├── components/     # Reusable UI components (Shadcn/ui based)
│   │   ├── pages/          # Auth, Dashboard, Emergencies, Resources, Volunteers, Chat, Map, Profile
│   │   ├── services/       # API service layer
│   │   └── hooks/          # Custom React hooks (sockets, auth, etc.)
│   └── package.json
└── README.md
```

## 🗄️ Core Data Model

Key entities managed via Prisma/PostgreSQL:

- **Users** — identity, role, volunteer stats, OTP/reset fields
- **Emergencies** — type, severity, status, location, assignment, timeline
- **Resources** — type, quantity, availability, location
- **ChatRoom / ChatMessage / ChatMember** — emergency-scoped messaging
- **Notifications** — real-time alerts with priority levels
- **ResourceRequest / ResourceDeployment** — allocation workflow
- **EmergencyUpdate / EmergencyTimeline** — audit trail per incident
- **Sessions / AuditLog** — session and security tracking

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS)
- npm
- A PostgreSQL database (e.g. a free instance on [Neon](https://neon.tech))
- Cloudinary account (for image/file storage)
- SMTP credentials for Nodemailer (for OTP emails)

### 1. Clone the repository

```bash
git clone https://github.com/HarsikaKumari/disaster_relief.git
cd disaster_relief
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
JWT_SECRET="your_jwt_secret"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your_email@example.com"
SMTP_PASS="your_email_password"
CLIENT_URL="http://localhost:5173"
```

Run Prisma migrations and start the server:

```bash
npx prisma migrate dev
npm run dev
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL="http://localhost:5000/api"
VITE_SOCKET_URL="http://localhost:5000"
```

Start the frontend:

```bash
npm run dev
```

The app should now be running at `http://localhost:5173`, connected to the backend at `http://localhost:5000`.

## 🧪 Testing

API endpoints were tested using Postman across all modules (authentication, emergencies, resources, volunteers, chat, notifications). Import the Postman collection (if included in `/docs`) to try the endpoints directly.

## 📈 Performance (observed during development)

| Metric | Value |
|---|---|
| Average page load time | < 2 seconds |
| Average API response time | < 500 ms |
| Real-time message delivery | < 100 ms |
| Concurrent users tested | 1000+ |

## 🔮 Future Scope

- AI-powered severity prediction
- Native mobile app (React Native)
- SMS alerts via Twilio for low-connectivity users
- Multi-language support
- Voice/video calling within chat
- Offline mode with background sync
- Integration with government relief agencies

## ⚠️ Limitations

- Requires an active internet connection (no offline mode yet)
- Effectiveness depends on adoption by citizens, volunteers, and agencies
- Emergency reports are user-submitted and not independently verified

## 👥 Contributors

- Harsika Kumari
- Sachin Kumar
- Anchal Jaiswal

*Bachelor of Computer Application, Lovely Professional University, Punjab*

## 📄 License

This project was developed as part of an academic Summer Training Project (CA2).
