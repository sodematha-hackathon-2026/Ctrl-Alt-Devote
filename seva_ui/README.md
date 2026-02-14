# Seva UI - Admin Panel

React-based admin UI for the Seva application backend.

## Architecture

This application connects to the Spring Boot backend APIs and MySQL database:
- **Mobile App (React Native)** → Backend APIs (Spring Boot) → Database (MySQL 8.x)
- **Web UI (React)** → Backend APIs (Spring Boot) → Database (MySQL 8.x)

## Project Structure

```
seva_ui/
├── src/
│   ├── components/     # Shared UI components
│   ├── pages/          # Route-based pages
│   ├── layouts/        # App layouts
│   ├── services/       # API clients
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Helper utilities
│   └── assets/         # Static assets
├── public/
├── .env
├── package.json
└── tsconfig.json
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Update `.env` file with your backend API URL:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for routing (to be installed)
- **Axios** for API calls (to be installed)

## Next Steps

- Install additional dependencies (React Router, Axios, UI library)
- Set up API service layer
- Create authentication flow
- Build admin pages
