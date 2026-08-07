# 🚛 Smart Fleet Console

A modern fleet management platform built with **Next.js**, **TypeScript**, **MySQL**, and **Tailwind CSS**, providing role-based dashboards for fleet operations, maintenance management, and driver safety monitoring.

---

## 📖 Overview

Smart Fleet Console is a web-based fleet management system designed to support multiple operational roles within a transportation company. The system provides dedicated dashboards for:

- 👨‍💼 **Fleet Manager**
- 🛠 **Mechanic**
- 🛡 **Safety Staff**
- 🚗 **Driver**

Each role only has access to the features and data relevant to their responsibilities through middleware-based authorization.

---

## 🛠 Tech Stack

### Frontend
- Next.js 16
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js Server Actions
- API Routes

### Database
- MySQL
- mysql2

### Authentication & Extras
- bcrypt (Password hashing)
- Middleware
- Recharts (Data visualization)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd smart-fleet-console
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root.

> **Note:** The `.env.local` configuration has been shared in the **submission comment**.

Example:
```env
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 🔑 Test Credentials

The following accounts can be used to test each system role.

| Role | Email |
|------|-------|
| Fleet Manager | `manager@smartfleet.com` |
| Safety Staff | `safety@smartfleet.com` |
| Mechanic | `MEC1004464@smartfleet.com` |
| Driver | `DR0001@smartfleet.com` |

> **Note:** The login password is provided together with the submission.

---

## ✨ System Features & Security

### 🔐 Authentication & Authorization
- Email & password login.
- Password hashing using **bcrypt**.
- Middleware-based route protection and role-based access control.
- Session validation: Unauthorized users are redirected to the Login page.
- Incognito sessions require authentication (cookies are not shared). Direct access to protected routes (e.g., `/manager`) is strictly forbidden without valid credentials.

### 📊 Data Visualization
- Charts implemented using **Recharts** (Line Charts, Bar Charts, Pie Charts, Safety Heatmap, Fleet Analytics).

### 📄 Pagination
- Large tables support pagination (20 records per page).
- Shared Pagination component reusable across all dashboards with Previous/Next navigation.

---

## 💻 Role-Based Dashboards

### 👨‍💼 Fleet Manager Dashboard
Monitor overall fleet health and workshop performance.
- **KPI Cards:** Total Fleet Vehicles, Open Maintenance Jobs, Predictive Alerts, Active Mechanics.
- **Analytics:** Workshop Workload Distribution, Predictive Alert Distribution, Vehicles Generating Most Alerts, Maintenance Cost & Downtime.
- **Operational Tables:** Urgent Repairs, Inventory Alerts, Supplier Performance, Available Mechanics, Repeated Fault Vehicles.
- **Inventory Management:** Manual stock update and low stock monitoring.

### 🛠 Mechanic Dashboard
Support maintenance operations through:
- Assigned maintenance jobs.
- Diagnostic history & Vehicle inspection details.
- Repair workflow & Maintenance completion.

### 🛡 Safety Dashboard
Monitor fleet safety performance.
- **KPI Cards:** Total Safety Incidents, Pending Reviews, High Risk Drivers, Retraining Sessions.
- **Analytics:** Safety Event Heatmap, Incident Severity Distribution.
- **Tables:** Recent Incident Reviews, High Risk Drivers, Retraining Queue.

### 🔎 Safety Explorer
Advanced querying for safety records.
- **Incident Review:** Search by Driver ID, Vehicle ID, Depot, Event, Severity, Review Status, or Date Range. Supports viewing reviewed incidents, continuing pending reviews, and completing reviews.
- **Safety Score Explorer:** Search by Month, Driver ID/Name, Depot, Score Range, and Risk Classification.
  - *Risk Levels:* Excellent (90–100), Good (75–89), Warning (50–74), High Risk (< 50).

### 🚗 Driver Portal
Drivers can:
- View assigned vehicles & check maintenance schedules.
- Review personal safety scores & monitor completed maintenance.

---

## 🗄 Database Architecture

Built using **MySQL**. Main entities include:
- Driver, Vehicle, Depot
- Workshop, Mechanic, Maintenance Job, Maintenance Activity
- Predictive Alert, Safety Event, Event Review, Safety Score
- Inventory, Supplier

---

## 📂 Project Structure

```text
app/
components/
├── charts/
├── common/
├── dashboard/
│   ├── manager/
│   ├── mechanic/
│   ├── safety/
├── explorer/
├── tables/
repositories/
services/
types/
lib/
middleware.ts
```

---

## 📈 Future Improvements

- Server-side pagination.
- Export reports (PDF / Excel).
- Real-time notifications & Email notifications.
- AWS deployment.
- Predictive analytics enhancements.
- Audit logging.
- Dark mode.

---

## 👨‍💻 Authors

Developed as part of the **Smart Fleet Management System** project.
