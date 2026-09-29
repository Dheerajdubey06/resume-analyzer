# ResumeAI — AI Resume Analyzer & Job Matching Platform

![ResumeAI Banner](https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&auto=format&fit=crop&q=80)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Secure_Storage-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai&logoColor=white)](https://openai.com/)

**ResumeAI** is a full-stack, enterprise-grade **AI Resume Analyzer and Job Matching Platform** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Designed for software engineers, tech professionals, and recruiters, it uses modern Natural Language Processing and ATS heuristics to parse resumes, benchmark qualifications against job descriptions, detect skill gaps, rewrite bullets for quantifiable impact, generate tailored interview questions, and export executive PDF reports.

---

## 🌟 Key Features

- **Automated Resume Text & Entity Parsing**: Supports **PDF**, **DOC**, and **DOCX** files with automated extraction of skills, education, work history, and contact information.
- **Enterprise Cloud Storage (Cloudinary)**: Resume documents and profile avatars are securely streamed to Cloudinary buckets with server-side signing. Includes resilient local fallback.
- **Dual AI & ATS Scoring Engine**:
  - **ATS Readiness Score (0-100)**: Evaluates formatting cleanliness, keyword saturation, section completeness, action verbs, and quantification.
  - **Job Requirement Match (0-100)**: Semantic overlap across core competencies, frameworks, and job requisitions.
- **Skill Gap & Keyword Intelligence**: Visual breakdown of matched vs missing vs high-ROI recommended skills.
- **AI Bullet Point Enhancer**: Rewrites passive duties into quantified, high-impact accomplishments (e.g. *"Decreased API latency by 42%"*).
- **Targeted Interview Preparation**: Curates Technical, Behavioral (HR), and Project-based interview questions with strategic talking points.
- **Vector PDF Report Generation**: Instant client-side generation of branded, multi-page executive career intelligence reports.
- **Modern SaaS Aesthetics**: Linear & Vercel-inspired UI with dark mode, circular SVG score gauges, Recharts analytical graphs, and responsive mobile drawers.
- **Administrative Governance Portal**: Global platform analytics, most in-demand skills metrics, and user moderation.
- **One-Click Demo Mode**: Built-in sample seed workflow so you can demonstrate the platform during interviews and presentations with zero initial setup.

---

## 🏗️ Architecture & Project Structure

```text
ai-resume-analyzer/
│
├── client/                     # Frontend (React 18, Vite, Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, Sidebar, ScoreGauge, Skeletons
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── layouts/            # MainLayout (Public), DashboardLayout (Auth)
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Resumes,
│   │   │                       # Jobs, Analyze Studio, Results, History, Profile, Admin
│   │   ├── services/           # Axios client, auth, resume, job, analysis, PDF generator
│   │   ├── App.jsx             # Main router
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Tailwind & SaaS styling
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js          # API proxy to backend
│
├── server/                     # Backend API (Node.js, Express, Mongoose)
│   ├── config/                 # MongoDB & Cloudinary configuration
│   ├── controllers/            # Auth, Resume, Job, Analysis, Dashboard, Admin
│   ├── middleware/             # JWT auth, error handler, Multer file upload
│   ├── models/                 # User, Resume, JobDescription, Analysis schemas
│   ├── routes/                 # RESTful route declarations
│   ├── services/               # OpenAI abstraction, ATS engine, PDF/DOCX parsers, storage adapter
│   ├── utils/                  # JWT helpers, sample seed datasets
│   ├── uploads/                # Local storage fallback
│   ├── app.js                  # Express middleware setup & security
│   ├── server.js               # Startup listener
│   └── package.json
│
├── vercel.json                 # Monorepo Vercel serverless configuration
├── .env.example                # Environment variable template
├── .gitignore
├── README.md
└── package.json                # Root concurrent scripts
```

---

## 🛠️ Tech Stack & Libraries

### Frontend
- **Framework**: React.js 18 + Vite 6
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **Icons**: Lucide React
- **Data Visualization**: Recharts (AreaChart, BarChart, ResponsiveContainer)
- **PDF Generation**: jsPDF + html2canvas
- **HTTP Client**: Axios with JWT interceptors

### Backend
- **Runtime**: Node.js 20+ LTS
- **Framework**: Express.js
- **Database**: MongoDB Atlas via Mongoose ODM (with automatic fallback storage)
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs
- **File Uploads**: Multer (Memory Storage) + Cloudinary SDK v2
- **Document Parsers**: `pdf-parse` (PDF) + `mammoth` (DOCX)
- **AI Provider**: OpenAI API (`gpt-4o-mini` / `gpt-4o`)
- **Security**: Helmet, CORS, Express Rate Limit

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed.

### 2. Clone and Install
```bash
git clone https://github.com/your-username/ai-resume-analyzer.git
cd ai-resume-analyzer

# Install root, backend, and frontend dependencies in one command
npm run install-all
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your configuration details (see [Configuration Guide](#-configuration-guide) below).

### 4. Start Development Servers
Run frontend and backend simultaneously:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## ⚙️ Configuration Guide

### MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User with read/write privileges under **Database Access**.
3. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) or your specific IP.
4. Click **Connect** -> **Drivers** -> Copy the connection string.
5. Set `MONGODB_URI` in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/resumeai?retryWrites=true&w=majority
   ```

### Cloudinary Setup (Secure File Storage)
1. Sign up for a free account at [Cloudinary](https://cloudinary.com/).
2. On your Cloudinary Dashboard, copy your **Cloud Name**, **API Key**, and **API Secret**.
3. Set them in `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### OpenAI API Setup
1. Create an API key at [OpenAI Platform](https://platform.openai.com/api-keys).
2. Set your key in `.env`:
   ```env
   OPENAI_API_KEY=sk-proj-yourOpenAiKeyHere
   OPENAI_MODEL=gpt-4o-mini
   ```
*(Note: If OpenAI credentials are pending or unset, ResumeAI automatically activates its built-in Intelligent Heuristic & Semantic ATS Engine so demonstrations never fail).*

---

## 📡 API Reference Documentation

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new candidate or admin account |
| `POST` | `/api/auth/login` | Public | Login and retrieve JWT session token |
| `POST` | `/api/auth/logout` | Public | Invalidate current session |
| `GET` | `/api/auth/me` | Bearer | Retrieve currently logged-in user profile |
| `POST` | `/api/auth/forgot-password`| Public | Generate password reset token |
| `PUT` | `/api/auth/reset-password/:token` | Public | Set new password with token |
| `POST` | `/api/resumes/upload` | Bearer | Upload and parse PDF/DOCX resume file |
| `GET` | `/api/resumes` | Bearer | Get all resumes for user |
| `GET` | `/api/resumes/:id` | Bearer | Get single parsed resume |
| `DELETE`| `/api/resumes/:id` | Bearer | Delete resume from Cloudinary and DB |
| `POST` | `/api/jobs` | Bearer | Create target job description |
| `GET` | `/api/jobs` | Bearer | List saved target jobs |
| `DELETE`| `/api/jobs/:id` | Bearer | Delete target job description |
| `POST` | `/api/analysis` | Bearer | Execute AI Analysis (Resume vs Job) |
| `GET` | `/api/analysis` | Bearer | Search, filter, and paginate analysis history |
| `GET` | `/api/analysis/:id` | Bearer | Get detailed analysis result |
| `DELETE`| `/api/analysis/:id` | Bearer | Delete analysis record |
| `GET` | `/api/dashboard/stats` | Bearer | Fetch KPI metrics and chart datasets |
| `GET` | `/api/profile` | Bearer | Get candidate profile |
| `PUT` | `/api/profile` | Bearer | Update profile & upload avatar |
| `PUT` | `/api/settings/password`| Bearer | Change account password |
| `DELETE`| `/api/account` | Bearer | Delete account and all associated data |
| `GET` | `/api/admin/stats` | Admin | Global platform usage & skills metrics |
| `GET` | `/api/admin/users` | Admin | View all registered accounts |
| `DELETE`| `/api/admin/users/:id` | Admin | Administrative account moderation |
| `POST` | `/api/demo/seed` | Bearer | Instant one-click demo data population |

---

## 🚢 Deployment to Vercel

This repository includes full Vercel serverless monorepo configuration in `vercel.json`.

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/), select **Add New Project** and import `ai-resume-analyzer`.
3. In **Environment Variables**, add:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `CLIENT_URL`
   - `SERVER_URL`
4. Click **Deploy**. Vercel will build the frontend client and route API requests through `@vercel/node` serverless functions.

---

## 🔒 Security Best Practices

- **Zero Client-Side Exposure**: API keys, Cloudinary secrets, and MongoDB connection strings are strictly kept server-side.
- **Password Protection**: Passwords hashed with `bcryptjs` using a salt work factor of 10.
- **Rate Limiting**: Auth endpoints protected with `express-rate-limit` against brute-force attacks.
- **HTTP Security**: Helmet headers and strict CORS origin validation enabled.
- **Input Sanitization**: File uploads restricted by extension, MIME type, and size.

---

## 📄 License
This project is licensed under the MIT License — feel free to customize and showcase it in your portfolio or university project presentations.
