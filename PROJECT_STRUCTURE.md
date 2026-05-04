# Cashlatics - Project Structure & Architecture

## 📋 Project Overview
**Cashlatics** is a modern financial analytics web application built with Next.js 16.2.4, featuring user authentication, OAuth integration, and a dashboard for financial tracking.

**Tech Stack:**
- **Frontend:** Next.js 16.2.4, React 19, TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui components
- **Authentication:** better-auth
- **Database:** PostgreSQL (Neon), Drizzle ORM
- **Forms:** react-hook-form, Zod validation
- **Notifications:** Sonner (toast notifications)

---

## 🗂️ Directory Structure

```
cashlatics/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (grouped layout)
│   │   ├── layout.tsx            # Auth pages container layout
│   │   ├── sign-in/              
│   │   │   └── page.tsx          # Sign in page
│   │   └── sign-up/
│   │       └── page.tsx          # Sign up page
│   ├── dashboard/                # Protected dashboard route
│   │   └── page.tsx              # User dashboard (requires auth)
│   ├── login/                    # Alternative login route
│   │   └── page.tsx              # Login page variant
│   ├── signup/                   # Alternative signup route
│   │   └── page.tsx              # Signup page variant
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts      # Better-auth API route handler
│   ├── layout.tsx                # Root layout (Navbar, Toaster)
│   ├── page.tsx                  # Home page (/)
│   ├── globals.css               # Global styles
│   └── favicon.ico
│
├── components/                   # React components
│   ├── form/
│   │   ├── login-form.tsx        # Login form with OAuth
│   │   └── singup-form.tsx       # Signup form with OAuth
│   ├── ui/                       # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── field.tsx
│   │   ├── separator.tsx
│   │   └── animated-theme-toggler.tsx
│   ├── layout/
│   │   └── container.tsx         # Max-width container wrapper
│   ├── landing/
│   │   └── button.tsx            # Landing page button
│   ├── navbar.tsx                # Navigation bar (session-aware)
│   └── logout.tsx                # Logout button component
│
├── lib/                          # Utilities & configuration
│   ├── auth.ts                   # Better-auth server config
│   ├── auth-client.ts            # Better-auth client config
│   └── utils.ts                  # Utility functions (cn helper)
│
├── server/                       # Server-side actions
│   └── user.ts                   # User auth server actions
│                                 # - signIn()
│                                 # - signUp()
│                                 # - getCurrentUser()
│
├── db/                           # Database configuration
│   ├── index.ts                  # Drizzle client initialization
│   └── schema.ts                 # Database schema (user, session, account, verification)
│
├── hooks/                        # React hooks
│   └── useSessionState.ts        # Session state management hook
│
├── drizzle/                      # Database migrations (auto-generated)
│
├── public/                       # Static assets
│
├── .next/                        # Next.js build output
│
├── node_modules/                 # Dependencies
│
├── Configuration Files
│   ├── next.config.ts            # Next.js config (turbopack root configured)
│   ├── tsconfig.json             # TypeScript config
│   ├── tailwind.config.ts        # Tailwind CSS config
│   ├── postcss.config.mjs        # PostCSS config
│   ├── eslint.config.mjs         # ESLint config
│   ├── drizzle.config.ts         # Drizzle Kit config
│   ├── components.json           # Component framework config
│   ├── package.json              # Dependencies & scripts
│   ├── package-lock.json         # Lock file
│   ├── .gitignore                # Git ignore rules
│   └── next-env.d.ts             # TypeScript Next.js types
```

---

## 🔐 Authentication Flow

### Database Schema
```
user
├── id (primary key)
├── name
├── email (unique)
├── emailVerified
├── image
├── createdAt
└── updatedAt

session
├── id (primary key)
├── userId (foreign key → user.id)
├── expiresAt
├── token (unique)
├── ipAddress
├── userAgent
├── createdAt
└── updatedAt

account (OAuth linking)
├── id (primary key)
├── userId (foreign key → user.id)
├── providerId (google, apple)
├── accountId
├── accessToken
├── refreshToken
├── idToken
├── accessTokenExpiresAt
├── refreshTokenExpiresAt
├── scope
├── password
├── createdAt
└── updatedAt

verification (Email verification tokens)
├── id (primary key)
├── identifier
├── value
├── expiresAt
├── createdAt
└── updatedAt
```

### Authentication Routes
| Route | Method | Purpose |
|-------|--------|---------|
| `/sign-in` | GET | Sign in page |
| `/sign-up` | GET | Sign up page |
| `/login` | GET | Alternative login page |
| `/signup` | GET | Alternative signup page |
| `/api/auth/[...all]` | GET/POST | Better-auth endpoint |
| `/dashboard` | GET | Protected dashboard (requires auth) |

### Authentication Methods
- **Email & Password** - Form-based authentication
- **Google OAuth** - Social sign-in/sign-up
- **Apple OAuth** - Social sign-in/sign-up

---

## 🔄 Authentication Flow Diagram

```
Sign Up Flow:
1. User enters: name, email, password
2. Form validates with Zod schema
3. signUp() server action called
4. better-auth.api.signUpEmail() creates user
5. User redirected to /sign-in

Sign In Flow:
1. User enters: email, password
2. Form validates with Zod schema
3. signIn() server action called
4. better-auth.api.signInEmail() authenticates
5. BroadcastChannel notification sent
6. User redirected to /dashboard

OAuth Flow:
1. User clicks Google/Apple button
2. authClient.signIn.social() called
3. OAuth provider redirects to /dashboard
4. Session established via better-auth
5. BroadcastChannel notification sent

Protected Route Access:
1. getDashboard() checks session via headers
2. getCurrentUser() retrieves user from session
3. If no session → redirect to /sign-in
4. If session exists → allow access
```

---

## 📱 Key Components

### LoginForm (`components/form/login-form.tsx`)
- Email & password form
- Zod validation
- Email (8+ chars), password (8+ chars) required
- OAuth buttons (Google, Apple)
- Loading states with spinners
- Toast notifications
- Redirects to `/dashboard` on success
- BroadcastChannel for cross-tab auth sync

### SignupForm (`components/form/singup-form.tsx`)
- Name, email, password form
- Zod validation (name: 3+ chars, email valid, password: 8+ chars)
- OAuth buttons (Google, Apple)
- Loading states
- Toast notifications
- Redirects to `/sign-in` on success
- Redirects to `/dashboard` for OAuth
- BroadcastChannel for cross-tab auth sync

### Navbar (`components/navbar.tsx`)
- Displays "cashlatics" branding
- Conditional rendering:
  - Unauthenticated: Shows "Login" button → redirects to `/sign-in`
  - Authenticated: Shows "Logout" button
- Listens for auth changes via BroadcastChannel
- Responsive design

### Dashboard (`app/dashboard/page.tsx`)
- Protected route (requires authentication)
- Displays user name and email
- Shows placeholder sections: Account, Analytics, Settings
- Redirects unauthenticated users to `/sign-in`
- Loading state while checking authentication

---

## 🎣 Custom Hooks

### `useSessionState()` (`hooks/useSessionState.ts`)
```typescript
- Fetches current session via authClient.getSession()
- Returns: { session, loading, refetchSession }
- Listens for storage events (multi-tab support)
- Listens for window focus events
- Subscribes to BroadcastChannel "auth" messages
- Auto-refetches on tab focus or auth changes
```

---

## 🔗 Server Actions (`server/user.ts`)

### `signUp(email, password, name)`
- Calls `auth.api.signUpEmail()`
- Returns: `{ success, message }`
- Creates new user in database

### `signIn(email, password)`
- Calls `auth.api.signInEmail()`
- Returns: `{ success, message }`
- Authenticates existing user

### `getCurrentUser()`
- Protected server action
- Retrieves session from headers
- Fetches user from database
- Redirects to `/sign-in` if not authenticated
- Returns: `{ session, currentUser }`

---

## 🌐 API Routes

### Better-Auth Endpoint
**Route:** `/api/auth/[...all]`

Handles:
- User registration
- Login/logout
- OAuth callbacks
- Session management
- Token refresh
- Email verification

---

## 🎨 UI Component Library

All components use **shadcn/ui** patterns with Tailwind CSS:
- Button (variants: default, outline, ghost)
- Card (CardHeader, CardContent, CardDescription, CardTitle)
- Form (FormField, FormControl, FormItem, FormLabel, FormMessage)
- Input (text, password, email)
- Field (FieldGroup, FieldDescription)
- Label
- Separator
- AnimatedThemeToggler (dark mode toggle)

---

## 📦 Dependencies Overview

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.2.4 | React framework |
| react | 19.2.4 | UI library |
| react-dom | 19.2.4 | React DOM rendering |
| typescript | 5.x | Type safety |
| tailwindcss | 4.x | Utility CSS |
| better-auth | 1.6.9 | Authentication |
| drizzle-orm | 0.45.2 | Database ORM |
| drizzle-kit | 0.31.10 | Database migrations |
| react-hook-form | 7.75.0 | Form state |
| zod | 4.4.3 | Schema validation |
| lucide-react | 1.14.0 | Icons |
| sonner | 2.0.7 | Toast notifications |
| @neondatabase/serverless | 1.1.0 | PostgreSQL client |

---

## 🔐 Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://user:password@host/dbname

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OAuth - Apple
APPLE_CLIENT_ID=your_apple_client_id
APPLE_CLIENT_SECRET=your_apple_client_secret

# Better Auth
BETTER_AUTH_URL=http://localhost:3000 (or your deployed URL)
BETTER_AUTH_SECRET=your_secret_key
```

---

## ✅ Redirect Logic (Updated - No Cart)

| From | Action | To |
|------|--------|-----|
| `/sign-up` | Form submit (Email) | `/sign-in` |
| `/sign-up` | OAuth success | `/dashboard` |
| `/sign-in` | Form submit (Email) | `/dashboard` |
| `/sign-in` | OAuth success | `/dashboard` |
| `/dashboard` | No auth session | `/sign-in` |
| Navbar | "Login" clicked | `/sign-in` |
| Navbar | "Logout" clicked | `/` |

---

## 🚀 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Database migrations
npx drizzle-kit push:pg  # Push migrations
npx drizzle-kit studio  # Open Drizzle Studio
```

---

## 🛠️ Configuration Notes

### Turbopack Configuration
Located in `next.config.ts`:
```typescript
turbopack: {
  root: process.cwd(), // Resolves workspace root
}
```
This prevents the "multiple lockfiles" warning.

### Drizzle Configuration
Located in `drizzle.config.ts`:
- Dialect: PostgreSQL
- Provider: Neon (serverless)
- Migrations output: `./drizzle/`

### TypeScript
- Strict mode enabled
- React 19 types
- Next.js types via `next-env.d.ts`

---

## 📝 Notes & Observations

✅ **Working Features:**
- Email/password authentication
- OAuth (Google, Apple) integration
- User session management
- Multi-tab authentication sync
- Protected routes
- Form validation with Zod
- Toast notifications
- Responsive UI with Tailwind

⚠️ **Minor Issues Fixed:**
- Removed all cart references (no more `/cart` redirects)
- All redirects now go to `/dashboard`
- Dashboard page created with auth protection
- Turbopack root configured

🎯 **Next Steps for Development:**
1. Implement actual analytics/financial tracking features
2. Create account settings page
3. Add profile management
4. Implement email verification flow
5. Add two-factor authentication (optional)
6. Create admin dashboard (optional)
7. Add data export functionality
8. Implement search and filters

---

## 🔍 File Checklist

**Core Files:**
- ✅ `next.config.ts` - Next.js configuration
- ✅ `tsconfig.json` - TypeScript config
- ✅ `package.json` - Dependencies
- ✅ `app/layout.tsx` - Root layout with Navbar & Toaster
- ✅ `app/page.tsx` - Home page

**Authentication:**
- ✅ `lib/auth.ts` - Server-side auth config
- ✅ `lib/auth-client.ts` - Client-side auth
- ✅ `server/user.ts` - Auth server actions
- ✅ `app/api/auth/[...all]/route.ts` - Better-auth endpoint

**Pages:**
- ✅ `app/(auth)/sign-in/page.tsx`
- ✅ `app/(auth)/sign-up/page.tsx`
- ✅ `app/dashboard/page.tsx`

**Components:**
- ✅ `components/form/login-form.tsx`
- ✅ `components/form/singup-form.tsx`
- ✅ `components/navbar.tsx`
- ✅ `components/logout.tsx`

**Database:**
- ✅ `db/index.ts` - Drizzle client
- ✅ `db/schema.ts` - Database schema

---

Generated: 2024
Project: Cashlatics