# Smart Fleet Console

Do **not** merge directly into the main branch.
> Dashboard & Explorer Development Guide

This document explains the project architecture, coding conventions, and development workflow for all team members.

---

# Project Setup

## 1. Pull the latest code

```bash
git pull origin main
```

## 2. Install dependencies

```bash
npm install
```

## 3. Run the project

```bash
npm run dev
```

## 4. Configure environment

Create `.env.local`

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=
```

Ask the project owner for the database credentials.

---

# Project Architecture

Every dashboard follows the same architecture.

```
Railway Database
        │
        ▼
Repository (SQL)
        │
        ▼
Service
        │
        ▼
Dashboard Page
        │
        ▼
Charts / Tables
```

Never skip any layer.

---

# Repository Layer

Location

```
repositories/dashboard/
```

Responsibilities

- SQL queries only.
- One function = one SQL query.
- No React code.
- No UI logic.
- No formatting.

Example

```ts
export async function getDriverDashboardStats() {}

export async function getDriverTrips() {}
```

---

# Service Layer

Location

```
services/dashboard/
```

Responsibilities

- Combine repository functions.
- Use `Promise.all()`.
- Return one object to the dashboard page.

Example

```ts
export async function loadDriverDashboard() {
    const [
        stats,
        trips,
        alerts,
    ] = await Promise.all([
        getDriverDashboardStats(),
        getDriverTrips(),
        getDriverAlerts(),
    ]);

    return {
        stats,
        trips,
        alerts,
    };
}
```

---

# Dashboard Page

Location

```
app/(dashboard)/{role}/page.tsx
```

Responsibilities

- Call Service
- Receive data
- Pass props to components

Example

```ts
const {
    stats,
    trips,
    alerts,
} = await loadDriverDashboard();
```

Never

- Write SQL
- Query the database
- Write business logic

---

# Components

## Charts

Location

```
components/charts/
```

Examples

```
DriverTripsChart.tsx

WorkshopWorkloadChart.tsx

PredictiveAlertTreemap.tsx
```

Charts should

- Receive props
- Display UI only

Never fetch data.

---

## Tables

Location

```
components/tables/
```

Examples

```
DriverTripsTable.tsx

MechanicJobsTable.tsx

UrgentRepairTable.tsx
```

Tables should

- Receive props
- Display data only

---

# Explorer

Explorer follows the same architecture.

```
Repository

↓

Service

↓

Explorer Page

↓

Filters

↓

Table
```

Each role has its own explorer.

Examples

```
/manager/explorer

/mechanic/explorer

/safety/explorer

/driver/explorer
```

---

# Folder Ownership

Each teammate is responsible ONLY for their assigned role.

## Driver

Allowed files

```
repositories/dashboard/driver.ts

services/dashboard/driver.ts

app/(dashboard)/driver/**

components/charts/Driver*.tsx

components/tables/Driver*.tsx
```

---

## Mechanic

Allowed files

```
repositories/dashboard/mechanic.ts

services/dashboard/mechanic.ts

app/(dashboard)/mechanic/**

components/charts/Mechanic*.tsx

components/tables/Mechanic*.tsx
```

---

## Safety

Allowed files

```
repositories/dashboard/safety.ts

services/dashboard/safety.ts

app/(dashboard)/safety/**

components/charts/Safety*.tsx

components/tables/Safety*.tsx
```

---

# Shared Components

These files affect the whole project.

Do NOT modify them.

```
components/dashboard/

components/layout/

app/(dashboard)/layout.tsx

lib/db.ts
```

---

# Dashboard Development Workflow

Step 1

Write SQL

```
repositories/dashboard/{role}.ts
```

↓

Step 2

Integrate SQL

```
services/dashboard/{role}.ts
```

↓

Step 3

Create Charts / Tables

```
components/charts/

components/tables/
```

↓

Step 4

Import into

```
app/(dashboard)/{role}/page.tsx
```

↓

Step 5

Run

```bash
npm run dev
```

↓

Step 6

Test

---

# Explorer Development Workflow

```
Repository

↓

Service

↓

Explorer Page

↓

Filters

↓

Table
```

---

# Code Submission

⚠️ Do NOT merge directly into the repository.

Instead, send all modified files.

Example

```
Files Changed

repositories/dashboard/driver.ts

services/dashboard/driver.ts

app/(dashboard)/driver/page.tsx

app/(dashboard)/driver/explorer/page.tsx

components/charts/DriverTripsChart.tsx

components/charts/DriverScoreChart.tsx

components/tables/DriverTripsTable.tsx
```

Only include files that were modified.

---

# Coding Rules

✅ Use TypeScript.

✅ SQL belongs in Repository.

✅ Business logic belongs in Service.

✅ Components receive props.

✅ Keep components reusable.

❌ No SQL inside React components.

❌ No database queries inside charts.

❌ No database queries inside tables.

❌ No hardcoded production data.

---


- Pushing the final version to GitHub.

