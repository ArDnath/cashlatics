<p align="center">
  <img src="public/wallet.png" alt="Cashlatics Logo" width="120" />
</p>

<h1 align="center">Cashlatics 💰</h1>

<p align="center">
  A sophisticated financial analytics application for intelligent expense tracking, budgeting, and AI-powered financial insights.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-0.45-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Better_Auth-1.6-purple?style=flat-square" />
  <img src="https://img.shields.io/badge/Arcjet-1.4-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
</p>

***

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Available Scripts](#available-scripts)
- [Architecture Decisions](#architecture-decisions)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

***

## Overview

**Cashlatics** is a full-stack financial analytics platform designed to give users deep visibility into their personal or business finances. Built on the latest Next.js App Router with server-first architecture, it combines real-time budgeting, transaction tracking, and AI-generated insights — all wrapped in a secure, performant, and type-safe codebase.

Whether you're managing monthly budgets, analyzing spending trends, or generating financial reports, Cashlatics provides the tools to make informed financial decisions faster.

***

## ✨ Features

- **📊 Financial Dashboard** — Interactive overview of your income, expenses, and net balance at a glance
- **💸 Transaction Management** — Add, edit, categorize, and filter transactions with full CRUD support
- **📈 Analytics & Insights** — Visual charts powered by Recharts for spending trends and category breakdowns
- **🤖 AI-Powered Analysis** — Integrated Google Gemini AI for generating natural-language financial insights and recommendations
- **🔐 Secure Authentication** — Multi-provider auth (credentials + Google OAuth) via Better Auth with cross-tab session sync
- **🛡️ Bot Protection & Rate Limiting** — Arcjet integration safeguards all API routes from abuse
- **📧 Email Notifications** — Transactional emails via Resend for alerts, confirmations, and reports
- **📅 Date-Range Filtering** — Flexible date picker (react-day-picker) for custom reporting periods
- **📱 Responsive Design** — Mobile-first UI built with Tailwind CSS v4 and Radix UI primitives
- **🌑 Animations** — Smooth micro-interactions via Motion (Framer Motion)

***

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.2.4 |
| **Runtime** | React | 19.2.4 |
| **Language** | TypeScript | ^5 |
| **Database** | PostgreSQL (Neon Serverless) | — |
| **ORM** | Drizzle ORM | ^0.45.2 |
| **Authentication** | Better Auth | ^1.6.9 |
| **Security** | Arcjet | ^1.4.0 |
| **AI** | Google Generative AI (Gemini) | ^0.24.1 |
| **Email** | Resend | ^6.12.3 |
| **UI Components** | Radix UI + Shadcn/UI | — |
| **Styling** | Tailwind CSS | ^4 |
| **Animations** | Motion | ^12.38.0 |
| **Charts** | Recharts | ^3.8.1 |
| **Forms** | React Hook Form + Zod | — |
| **Icons** | Phosphor Icons + Lucide React | — |
| **Migrations** | Drizzle Kit | ^0.31.10 |

***

## 📂 Project Structure

```
cashlatics/
├── app/                            # Next.js App Router
│   ├── (auth)/                     # Authentication Routes
│   │   ├── login/                  # Login page
│   │   └── signup/                 # Registration page
│   ├── (landing)/                  # Public Marketing Pages
│   │   └── page.tsx                # Landing/Home page
│   ├── (main)/                     # Legacy/Shared Server Actions
│   ├── (web)/                      # Core Protected Application
│   │   ├── dashboard/              # Main dashboard & financial views
│   │   ├── _actions/               # Feature-scoped Server Actions
│   │   └── _components/            # Feature-scoped Client Components
│   ├── api/                        # API Route Handlers
│   │   ├── auth/                   # Better Auth API endpoints
│   │   └── [...]/                  # Webhook & misc endpoints
│   ├── layout.tsx                  # Root Layout (Providers, Fonts)
│   └── globals.css                 # Global Styles & Tailwind Config
│
├── components/                     # Shared Reusable Components
│   ├── form/                       # Form input components
│   ├── landing/                    # Landing page section components
│   ├── layout/                     # Structural layout components
│   ├── ui/                         # Shadcn/UI component library
│   ├── navbar.tsx                  # Global navigation bar
│   └── logout.tsx                  # Logout action component
│
├── lib/                            # Core Logic & Utilities
│   ├── arcjet.ts                   # Arcjet security configuration
│   ├── auth.ts                     # Better Auth server setup
│   ├── auth-client.ts              # Better Auth client helpers
│   └── utils.ts                    # Tailwind merge & general utilities
│
├── db/                             # Database Layer
│   ├── schema/                     # Drizzle schema definitions
│   ├── index.ts                    # Neon DB client initialization
│   └── seed.ts                     # Development data seeding script
│
├── actions/                        # Global Server Actions
├── hooks/                          # Custom React Hooks
├── types/                          # Global TypeScript type definitions
├── drizzle/                        # Auto-generated SQL migrations
├── public/                         # Static assets (images, icons, fonts)
│
├── next.config.ts                  # Next.js configuration
├── drizzle.config.ts               # Drizzle ORM + migration config
├── tailwind.config.ts              # Tailwind CSS configuration
└── package.json                    # Dependencies & scripts
```

***

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20 or higher
- **pnpm** / **npm** / **yarn**
- A **PostgreSQL** database (recommended: [Neon](https://neon.tech) — free serverless Postgres)
- [Arcjet](https://arcjet.com) account for security keys
- [Better Auth](https://www.better-auth.com) setup
- [Google AI Studio](https://aistudio.google.com) API key (Gemini)
- [Resend](https://resend.com) API key for email

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ArDnath/cashlatics.git
   cd cashlatics
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Copy the example env file and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   See [Environment Variables](#environment-variables) for details.

4. **Run database migrations**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **(Optional) Seed the database**

   ```bash
   npm run db:seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

***

## 🔑 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# ── Database ─────────────────────────────────────────
DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require

# ── Better Auth ──────────────────────────────────────
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000

# ── Google OAuth (Optional) ──────────────────────────
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ── Arcjet Security ───────────────────────────────────
ARCJET_KEY=your_arcjet_key_here

# ── Google Gemini AI ──────────────────────────────────
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# ── Resend Email ──────────────────────────────────────
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# ── App ───────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ Never commit your `.env.local` file to version control.

***

## 🗄️ Database Setup

Cashlatics uses **Drizzle ORM** with **Neon Serverless PostgreSQL**.

### Schema Management

Schema definitions live in `db/schema/`. After modifying any schema file, regenerate and apply migrations:

```bash
# Generate migration SQL files
npm run db:generate

# Apply migrations to the database
npm run db:migrate
```

### Seeding (Development)

Populate the database with sample financial data for local development:

```bash
npm run db:seed
```

The seed script is located at `db/seed.ts` and can be customized to fit your development needs.

***

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Start development server with hot reload |
| `build` | `next build` | Build optimized production bundle |
| `start` | `next start` | Start production server |
| `lint` | `eslint` | Run ESLint checks |
| `db:generate` | `drizzle-kit generate` | Generate SQL migration files from schema |
| `db:migrate` | `drizzle-kit migrate` | Apply pending migrations to database |
| `db:seed` | `tsx db/seed.ts` | Seed database with development data |

***

## 🏛️ Architecture Decisions

<img width="1607" height="979" alt="CashlaticsArchi" src="https://github.com/user-attachments/assets/6acb6c56-ccf7-4ca9-9259-1d7a7633af38" />


***

## 🛡️ Security

Cashlatics is built with security as a first-class concern:

- **Arcjet** — Bot protection, rate limiting, and shield rules applied at the edge before requests hit application logic
- **Better Auth** — Industry-standard session management with CSRF protection, secure cookies, and cross-tab session sync
- **Environment Isolation** — All secrets are server-side only; no sensitive values are exposed to the client bundle
- **Zod Validation** — All user inputs are validated server-side before any database operation
- **SQL Injection Prevention** — Drizzle ORM uses parameterized queries by default; no raw SQL interpolation

***

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a new feature branch: `git checkout -b feat/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feat/your-feature-name`
5. Open a Pull Request against `main`

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new analytics chart
fix: resolve transaction date parsing bug
chore: update dependencies
docs: improve README setup section
```

***

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

***

