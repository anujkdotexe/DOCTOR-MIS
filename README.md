# DOCTOR MIS

Doctor MIS (Management Information System) is a full-stack application for managing doctors, appointments, and related administrative tasks. It features a Node.js backend and a modern React frontend for both users and administrators.

## Features
- Combined login/register auth page
- Doctor management
- Appointment scheduling
- Admin dashboard
- Secure API endpoints
- Client-side admin route protection

## Project Structure
```
backend/    # Node.js backend (Express, database, API routes)
frontend-react/   # React + Vite frontend (user and admin interfaces)
```

## Getting Started
1. Clone the repository:
   ```sh
   git clone https://github.com/anujkdotexe/DOCTOR-MIS.git
   ```
2. Install backend dependencies:
   ```sh
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```sh
   cd ..\frontend-react
   npm install
   ```
4. Set up environment variables in `backend/.env`.
5. Start the backend server:
   ```sh
   npm start
   ```
6. Start the frontend:
   ```sh
   cd ..\frontend-react
   npm run dev
   ```

## Database Seeding
- Run `backend/database/schema.sql` first.
- Seed an admin user with either:
  - `npm run seed:admin` from the `backend/` folder after setting DB env vars, or
  - `backend/database/seed_admin.sql` for manual import.

## Frontend Notes
- Login and Register now live on a single `/auth` page with tabs.
- The `/admin` route is protected on the client and redirects non-admin users.
- Appointment booking supports doctor preselection from the Doctors page.

## License
See LICENSE for details. This project is proprietary to Anuj Kondawar.

---
© 2026 Anuj Kondawar. All rights reserved.
