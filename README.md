# NodeWave Assessment - Frontend Web Client

> **Dependency-Aware Operational Backbone Web Client**  
> Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS 4**, **TanStack Query 5**, **Zustand 5**, and **Vitest**.

**Live Production Web App**: [https://nodewave-assessment-frontend-7nejl2ht4-faid-alfarisis-projects.vercel.app/](https://nodewave-assessment-frontend-7nejl2ht4-faid-alfarisis-projects.vercel.app/)  
**Connected Backend API**: [https://nodewave-assessment-backend-production-02ed.up.railway.app](https://nodewave-assessment-backend-production-02ed.up.railway.app)

---

## 1. Design System & Brand Identity

Crafted in alignment with the [nodewave.id](https://nodewave.id) digital brand language:
* **Deep Obsidian Theme**: `#070607` background with subtle dark elevation cards (`#0F1318`, `#12161C`).
* **NodeWave Accent Cyan**: `#50B1D2` for interactive buttons, progress indicators, and active states.
* **Deep Brand Gradient**: `#094C86` gradient blends for branding banners and elevation backdrops.
* **Micro-interactions & UX States**:
  * Cyan-glowing skeleton loaders for async queries.
  * Empty states with custom contextual guidance.
  * Dependency blocker warnings with prerequisite task titles.
  * Sleek custom dark scrollbars across Kanban columns.

---

## 2. Key UX & Architectural Features

### A. Dependency-Aware Interactive Kanban Board
* Four reactive workflow columns: `To Do`, `In Progress`, `Done`, and `Blocked`.
* Tasks with incomplete prerequisite dependencies are automatically marked with a **Lock / Blocked badge** displaying the exact prerequisite tasks required before work can commence.
* Quick-move buttons prevent moving blocked tasks into `In Progress`, providing contextual feedback explaining the dependency lock.

### B. Optimistic Concurrency Conflict Dialog (`409 Conflict`)
* When an update detects a version collision (e.g., another team member updated the task simultaneously), the client displays a **Concurrency Conflict Dialog** (`ConcurrencyConflictModal`).
* The modal presents the conflict reason and provides an instant **"Refresh & Load Latest Data"** action so engineers never overwrite changes blindly.

### C. Client Guest Multi-Tenant Stakeholder View
* Logging in as a **Client Guest** adapts the interface:
  * Displays an aggregate project completion progress bar (e.g. `50% Completed`).
  * Masks proprietary internal details: Engineer avatars, names, departments, and internal audit logs are completely omitted.
  * Shows only client-facing deliverables (`clientVisible = true`).
  * Disables mutation controls (read-only stakeholder dashboard).

### D. Daily Standup Auto-Summary Dashboard (`/standup`)
* Interactive view aggregating:
  1. **What was completed yesterday** across all departments.
  2. **What is blocked today** with direct links to blocking prerequisite tasks.
* Broken down by department (`MANAGEMENT`, `UIUX`, `FRONTEND`, `BACKEND`).

### E. Task Detail Drawer & Immutable Audit Trail
* Opening any task displays comprehensive details:
  * Description editing (restricted to Product Managers; locked for internal engineers).
  * Prerequisite dependency tree.
  * Work attachments list and file uploader.
  * **Immutable Audit Trail Timeline**: Visual changelog of every modification, showing author, changed attribute, and before/after values.

### F. Self-Contained Local Avatars & Live Image Upload
* User registration allows selecting and uploading image files (`image/*`).
* Real-time circular image preview before registration.
* Uploaded files are served locally via the backend without external Unsplash/third-party image dependencies.

### G. 1-Click Test Credentials Switcher
* The `/login` page provides quick-fill buttons for all 5 seeded accounts (PM, UI/UX, Frontend, Backend, Client Guest), enabling rapid role switching during evaluation.

---

## 3. Seeded Test Accounts

Password for all pre-seeded accounts is `password123`:

| Role | Department | Full Name | Email | Persona & Testing Focus |
| :--- | :--- | :--- | :--- | :--- |
| **Product Manager** | `MANAGEMENT` | Alex Morgan | `pm@nodewave.id` | Can create tasks & set dependencies. Cannot complete tasks in progress. |
| **Internal Team** | `UIUX` | Sarah Chen | `uiux@nodewave.id` | Completes design deliverables. Completing this unlocks dependent tasks. |
| **Internal Team** | `FRONTEND` | Devin Cole | `frontend@nodewave.id` | Has a task blocked by UI/UX & Backend prerequisites. |
| **Internal Team** | `BACKEND` | Marcus Vance | `backend@nodewave.id` | Internal API development task (hidden from Client Guest). |
| **Client Guest** | `CLIENT` | Victoria Sterling | `client@clientcorp.com` | High-level project progress view with data masking. |

---

## 4. Getting Started & Local Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v20 or v22 recommended)
* [npm](https://www.npmjs.com/) (v10 or later)

### Installation & Run
1. **Clone repository**:
   ```bash
   git clone https://github.com/faid-alfarisi/nodewave-assessment-frontend.git
   cd nodewave-assessment-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_BE_URL="http://localhost:5000"
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Automated Unit Testing & Production Build

Run the Vitest test suite:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

Run TypeScript strict typecheck:
```bash
npm run typecheck
```

Create production build:
```bash
npm run build
```

### Test Coverage Highlights (`src/__tests__/permissions.test.ts`):
* `isTaskBlockedByDependencies`: Asserts blocked detection when prerequisite tasks are not `DONE`.
* `canUserMoveToDone`: Asserts PM cannot move `IN_PROGRESS` $\to$ `DONE`, while executors can.
* `canUserEditDescription`: Asserts core descriptions are PM-only editable.
* `canUserToggleClientVisibility`: Asserts client visibility toggle is PM-only.

---

## 6. Continuous Integration (GitHub Actions)

Configured in [`.github/workflows/ci.yml`](.github/workflows/ci.yml):
* Sets up Node.js 22 with npm cache.
* Runs `npm ci`, `npm test`, `npm run typecheck`, and `npm run build` on every push and pull request to `main`.

---

## 7. Production Deployment (Vercel)

The frontend client is continuously deployed on [Vercel](https://vercel.com/) with native Next.js 16 optimizations.

### Deployment Configuration
* **Connected Repository**: `faid-alfarisi/nodewave-assessment-frontend`
* **Framework Preset**: Next.js (App Router, Turbopack)
* **Build Command**: `next build`
* **Output Directory**: `.next`

### Environment Variables on Vercel
| Variable | Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_BE_URL` | `https://nodewave-assessment-backend-production-02ed.up.railway.app` | Points to the live Railway backend API |

### Continuous Deployment Workflow
* Every push to `main` automatically triggers an optimized Vercel production deployment.
* Previews and branch deployments are generated automatically for pull requests.

