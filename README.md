<div align="center">

# 🚀 Kunal Dhangar — Developer Portfolio

**Full-Stack Web & Android Developer**

A production-ready, feature-rich personal portfolio built with **React 19**, **Node.js / Express**, and **MongoDB Atlas** — showcasing projects, skills, a live blog, guestbook, bucket list, and more.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Portfolio-4f46e5?style=for-the-badge&logo=vercel)](https://kripa-connect-app.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-imkunal01-181717?style=for-the-badge&logo=github)](https://github.com/imkunal01)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Kunal%20Dhangar-0a66c2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/kunaldhangar/)

</div>

---

## 📖 Table of Contents

1. [About the Project](#-about-the-project)
2. [Features & Pages](#-features--pages)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Getting Started](#-getting-started)
   - [Prerequisites](#prerequisites)
   - [Frontend Setup](#frontend-setup)
   - [Backend Setup](#backend-setup)
6. [Environment Variables](#-environment-variables)
7. [API Reference](#-api-reference)
8. [Deployment](#-deployment)
9. [Skills Showcase](#-skills-showcase)
10. [Featured Projects](#-featured-projects)
11. [Developer Info](#-developer-info)

---

## 🎯 About the Project

This portfolio is more than a static resume — it is a **full-stack interactive platform** designed to:

- Present Kunal's professional background, skills, and projects in a polished UI.
- Provide interactive features (guestbook, bucket list, recommendations, blog).
- Demonstrate real-world full-stack engineering skills through the codebase itself.
- Support an **admin dashboard** for managing content without touching the code.

The frontend is deployed on **Vercel** and the backend API on **Render.com**, with **MongoDB Atlas** as the cloud database.

---

## ✨ Features & Pages

### Homepage Sections (Single Page Application)

| Section | Description |
|---|---|
| **Navbar** | Sticky navigation with dark/light theme toggle and `Cmd+K` command palette |
| **Hero** | Animated landing section with introduction and call-to-action |
| **About** | Bio, work experience, certifications, and downloadable résumé |
| **Coding Profiles** | Live stats from GitHub, LeetCode, CodeChef, and GeeksforGeeks |
| **Life Canvas** | Interactive 3D / canvas visual element |
| **Bento Grid** | Grid-based highlights and quick facts |
| **Projects** | Featured project cards with tech tags and live links |
| **Skills** | Visual tech-stack grid organised by category |
| **Testimonials** | Client/colleague testimonials with avatars |
| **Contact** | Contact form backed by Brevo transactional email API |
| **Footer** | Social links and copyright |

### Additional Routes

| Route | Page | Description |
|---|---|---|
| `/project/:slug` | Project Detail | In-depth view of a single project |
| `/blog` | Blog | Articles and technical write-ups |
| `/guestbook` | Guestbook | Visitor sign-in and messages |
| `/bucket-list` | Bucket List | Personal goals and milestones |
| `/recommendations` | Recommendations | Book, movie, and resource picks |
| `/admin` | Admin Panel | Authenticated dashboard to manage all content |

### Key Integrations

- 🎨 **Framer Motion** — page and element micro-animations
- 🌐 **Three.js / OGL** — 3D interactive graphics
- 📧 **Brevo API** — transactional email on contact form submission
- ☁️ **Cloudinary** — image upload and optimised delivery
- 🤖 **Gemini AI** — AI chat functionality
- 🔐 **JWT Auth** — secure admin panel
- 📊 **Visitor Analytics** — in-house visitor tracking

---

## 🛠️ Tech Stack

### Frontend

| Category | Technology |
|---|---|
| Library | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4, CSS3 |
| Animation | Framer Motion 12, Lenis (smooth scroll) |
| 3D / Canvas | Three.js, OGL |
| Routing | React Router DOM 7 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Notifications | React Toastify |
| Language | JavaScript (ES2022+) |

### Backend

| Category | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 5 |
| Database | MongoDB (Mongoose ODM) |
| Auth | JSON Web Tokens (JWT) |
| File Uploads | Multer |
| Email | Brevo API |
| Image Storage | Cloudinary SDK |
| Logging | Morgan, Winston |
| AI | Google Gemini API |
| Language | JavaScript (CommonJS) |

---

## 📁 Project Structure

```
My_Portfolio/
├── frontend/                   # React + Vite SPA
│   ├── public/                 # Static assets
│   └── src/
│       ├── assets/             # Images and media
│       ├── components/         # Reusable UI components
│       ├── data/
│       │   └── portfolio.js    # Portfolio content (skills, projects, testimonials)
│       ├── pages/              # Full page components (Blog, Admin, Guestbook …)
│       ├── sections/           # Homepage section components
│       ├── App.jsx             # Root component with React Router setup
│       ├── main.jsx            # Application entry point
│       └── index.css           # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json             # Vercel SPA routing config
│   └── package.json
│
├── backend/                    # Node.js + Express REST API
│   ├── middleware/             # Auth and request middleware
│   ├── models/                 # Mongoose schemas
│   │   ├── BlogPost.js
│   │   ├── BucketItem.js
│   │   ├── ContactSubmission.js
│   │   ├── GuestbookEntry.js
│   │   ├── Lead.js
│   │   ├── Project.js
│   │   ├── Recommendation.js
│   │   └── Visitor.js
│   ├── routes/                 # Express route handlers
│   ├── utils/                  # Helper utilities
│   ├── index.js                # Server entry point
│   └── package.json
│
├── KunalApproved5.pdf          # Résumé / CV
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- A **MongoDB Atlas** cluster (free tier is sufficient for development)
- A **Cloudinary** account (free tier)
- A **Brevo** account for email (free tier)
- *(Optional)* A **Google Gemini API** key for the AI chat feature

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env      # or create .env manually (see Environment Variables below)

# 4. Start the development server (http://localhost:5173)
npm run dev
```

**Other frontend scripts:**

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Create optimised production build in `dist/` |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Run ESLint on all source files |

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create your local environment file and fill in the values
cp .env.example .env      # or create .env manually (see Environment Variables below)

# 4. Start the development server with hot-reload (http://localhost:5000)
npm run dev
```

**Other backend scripts:**

| Script | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-restarts on file changes) |
| `npm start` | Start production server |

---

## 🔐 Environment Variables

### Frontend (`frontend/.env`)

```env
# URL of the deployed (or local) backend API
VITE_BACKEND_URL=http://localhost:5000
```

### Backend (`backend/.env`)

```env
# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# JWT secret for signing access tokens
JWT_SECRET=your_jwt_secret_here

# Admin panel access key
ADMIN_KEY=your_admin_key_here

# Cloudinary credentials (image hosting)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Brevo (formerly Sendinblue) API key for transactional email
BREVO_API_KEY=your_brevo_api_key

# Google Gemini API key for AI chat
GEMINI_API_KEY=your_gemini_api_key

# Server port (defaults to 5000)
PORT=5000
```

> ⚠️ **Never commit real secrets to version control.** Always use `.env` files that are listed in `.gitignore`.

---

## 📡 API Reference

The backend exposes the following route groups under `/api/`:

| Route | Purpose |
|---|---|
| `POST /api/auth/*` | User registration and JWT login |
| `GET/POST /api/projects` | CRUD for portfolio projects |
| `GET/POST /api/blog` | Blog post management |
| `GET/POST /api/guestbook` | Guestbook entry read/write |
| `GET/POST /api/bucket-list` | Bucket list item management |
| `GET/POST /api/recommendations` | Media recommendation management |
| `GET /api/visitors` | Visitor analytics |
| `GET /api/coding-profiles` | Aggregated coding platform stats |
| `POST /api/contact` | Contact form submission (triggers email) |
| `POST /chat` | AI chat (Gemini-powered) |

### Health Check Endpoints

| Endpoint | Description |
|---|---|
| `GET /check` | Basic liveness check |
| `GET /healthz` | Kubernetes-style liveness probe |
| `GET /readyz` | Readiness probe (includes MongoDB status) |
| `GET /ping` | Lightweight ping / keep-alive |

---

## ☁️ Deployment

### Frontend — Vercel

1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the **Root Directory** to `frontend`.
4. Add the environment variable `VITE_BACKEND_URL` pointing to your deployed backend URL.
5. Vercel handles builds and the SPA redirect rule automatically (`vercel.json` is already configured).

### Backend — Render.com

1. Create a new **Web Service** on [Render](https://render.com).
2. Set the **Root Directory** to `backend`.
3. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
4. Add all required environment variables from the section above.
5. *(Recommended)* Set up a cron job (or use UptimeRobot) to ping `/ping` every **10 minutes** so the free-tier instance stays warm. See `backend/RENDER_CRON_SETUP.md` for detailed instructions.

### Database — MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com).
2. Whitelist `0.0.0.0/0` (or the Render outbound IP) in the Network Access settings.
3. Copy the **connection string** into the `MONGO_URI` environment variable.

---

## 🧑‍💻 Skills Showcase

| Category | Technologies |
|---|---|
| **Languages** | C, C++, JavaScript, TypeScript, Java, Python, PHP, SQL |
| **Frontend** | React, Next.js, React Native, Redux, Tailwind CSS, HTML5, CSS3 |
| **Backend** | Node.js, Express.js, GraphQL, Socket.io, REST APIs |
| **Databases** | MongoDB, PostgreSQL, Redis |
| **DevOps** | AWS, Docker, Jenkins, GCP |
| **Tools** | Git, GitHub, Postman, Jest, Bash |

---

## 🏗️ Featured Projects

### 1. KripaConnect — E-Commerce Platform
> Full-stack B2B e-commerce platform with multi-role access control, Razorpay payment integration, admin dashboard, and PDF invoice generation. Available as a PWA and Android TWA app.

**Stack**: React · Node.js · Express · MongoDB · Razorpay  
**Live**: [kripa-connect-app.vercel.app](https://kripa-connect-app.vercel.app)

### 2. Project Two — Mobile Application
> Cross-platform mobile app with real-time chat functionality and global state management.

**Stack**: React Native · TypeScript · Redux · Socket.io

### 3. Project Three — Web Application
> Scalable web application with server-side rendering, relational database, caching layer, and containerised deployment.

**Stack**: Next.js · PostgreSQL · Redis · Docker · AWS

### 4. Project Four — Web3 Application
> Decentralised application leveraging GraphQL for flexible data querying and TypeScript for type safety.

**Stack**: React · Node.js · GraphQL · TypeScript

---

## 👤 Developer Info

| | |
|---|---|
| **Name** | Kunal Dhangar |
| **Role** | Full-Stack Web & Android Developer |
| **Email** | kunaldhangar184@gmail.com |
| **Location** | India |
| **Status** | Open to opportunities |

### Connect

[![GitHub](https://img.shields.io/badge/GitHub-imkunal01-181717?logo=github)](https://github.com/imkunal01)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Kunal%20Dhangar-0a66c2?logo=linkedin)](https://www.linkedin.com/in/kunaldhangar/)
[![Instagram](https://img.shields.io/badge/Instagram-kunal__dhangar__kd-e4405f?logo=instagram)](https://instagram.com/kunal_dhangar_kd)
[![Threads](https://img.shields.io/badge/Threads-kunaldhangar-000000?logo=threads)](https://threads.net/@kunaldhangar)
[![LeetCode](https://img.shields.io/badge/LeetCode-imkunal01-ffa116?logo=leetcode)](https://leetcode.com/imkunal01)

### Experience

| Role | Company | Period |
|---|---|---|
| Full-Stack Developer | Freelance | 2024 – Present |
| Web Developer Intern | Orbosis Global PVT. LTD. | Nov 2025 – Jan 2026 |

### Certifications

| Certificate | Issuer | Period |
|---|---|---|
| Cloud Computing | NPTEL | Aug – Oct 2025 |
| DSA in C++ (Decode Batch) | Decode | Jul 2024 – Feb 2025 |
| Legacy Web Development | freeCodeCamp | Aug 2023 – Jan 2024 |

---

<div align="center">

Made with ❤️ by [Kunal Dhangar](https://github.com/imkunal01)

</div>
