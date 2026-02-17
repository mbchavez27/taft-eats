# tafts-eats-client

This project builds upon the official La Salle Computer Society (LSCS) Frontend Standards.

It is set up with the **Feature-Based (Vertical Slicing)** architecture using **React Router v7**.

## Getting Started

All dependencies are managed via npm. To start the development server, run:

```bash
npm install
npm run dev
```

The server will start with hot-reloading, meaning it will automatically refresh when you save a file.

Backend Setup

Before running the client, ensure the backend API is running.

1. Start the API:
   Navigate to the tafts-eats-api directory and run:

   ```Bash
   npm run dev
   ```

2. Verify Connection:
   Ensure your frontend .env file points to the correct backend port (default is usually 3000 or 8080).

## Environment Variables (.env)

Create a .env file in the root directory

**Standard Local Setup**

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Available Scripts

- **npm run dev**: Starts the development server with hot-reloading.
- **npm run build**: Compiles the TypeScript code and assets for production.
- **npm run start**: Starts the production server (requires a build first).
- **npm run lint**: Lints the codebase for potential errors.
- **npm run typecheck**: Runs TypeScript type checking without emitting files.

## Project Structure

This project follows a **Feature-Based Architecture**. Code is organized into `features/` rather than generic `components/` or `containers/` folders.

- **app/features**: Contains domain-specific logic (e.g., `auth`, `establishments`, `reviews`).
- **app/components/ui**: Reusable UI components (Buttons, Cards, Modals).
- **app/routes**: React Router v7 route definitions.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: React Router v7
- **Bundler**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: Shadcn UI (Radix Primitives)
- **Maps**: Leaflet / Google Maps
- **State Management**: React Hooks / Context
- **Testing**: Vitest
