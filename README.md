# Social App Project

## Project Structure

This project contains the source code for the Social Networking & Video Chat application.

- **`src/`**: React Native Application (Mobile App)
  - `api/`: API client functions
  - `components/`: Reusable UI components
  - `screens/`: Application screens
  - `services/`: Core logic services (Agora, Encryption, etc.)
  - `store/`: State management (Zustand)
  - `navigation/`: Navigation configuration

- **`backend/`**: Node.js Backend Server
  - `src/controllers/`: API controllers
  - `src/services/`: Backend services
  - `src/routes/`: API routes

- **`admin-panel/`**: Next.js Admin Panel (Web)

- **`web-app/`**: Public Website / Web App
  - `index.html`: Main landing/app page

## Getting Started

1.  **Database Setup**:
    - Create a Supabase project.
    - Run the SQL queries in `../supabase_schema.sql` in the Supabase SQL Editor.

2.  **Mobile App**:
    - `cd src` (This folder structure assumes a root package.json, you may need to init a React Native project here or wrap it).
    - Configure `.env` with Supabase and Agora keys.

3.  **Backend**:
    - `cd backend`
    - `npm install`
    - Configure `.env`.
    - `npm run dev`

4.  **Web**:
    - Open `web-app/index.html` in a browser to view the Discovery Feed design.

## Documentation
See `../master-technical-architecture.md` and `../12-week-roadmap.md` for detailed architecture and planning.
