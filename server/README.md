# tafts-eats-api

This project was generated using the `create-lscs-api` scaffolder, based on the official La Salle Computer Society (LSCS) Backend Standards.

It is set up with the **Domain-Driven (Vertical Slicing)** architecture.

## Getting Started

All dependencies are installed during the project setup. To start the development server, run:

```bash
npm run dev
```

The server will start with hot-reloading, meaning it will automatically restart when you save a file.

## Database Setup

You can set up the MySQL database using **Docker (Recommended)** or **Manually**.

### Option A: Using Docker (Recommended)

This requires Docker Desktop or Docker Engine installed. It will automatically create the database, user, and tables for you.

1.  **Start the Database:**
    Run this command in the project root:

    ```bash
    docker compose up -d
    ```

2.  **Access the Database:**
    - **Host:** `localhost`
    - **Port:** `3307` (Mapped from container 3306)
    - **User:** `taft_app`
    - **Password:** `taft123`
    - **Database:** `taft_eats`

3.  **View Data (Adminer):**
    Open [http://localhost:8081](http://localhost:8081) in your browser.
    - **System:** MySQL
    - **Server:** `db`
    - **Username:** `taft_app`
    - **Password:** `taft123`
    - **Database:** `taft_eats`

### Option B: Manual Setup (No Docker)

If you already have MySQL installed locally on your machine:

1.  **Run the Initialization Script:**
    Import the schema from the `db` folder into your local MySQL server.

    ```bash
    mysql -u root -p < db/init.sql
    ```

2.  **Check Connection:**
    Ensure your `.env` file matches your local MySQL credentials (usually Port 3306).

## Environment Variables (.env)

Create a `.env` file in the root directory and ensure it matches your database method.

**If using Docker (Option A):**

```env
DB_HOST=localhost
DB_PORT=3307
DB_USER=taft_app
DB_PASSWORD=taft123
DB_NAME=taft_eats
```

**If using Manual Setup (Option B)**

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=taft_eats
```

## Available Scripts

- `npm start`: Starts the production server (builds the project first).
- `npm run dev`: Starts the development server with hot-reloading.
- `npm run build`: Compiles the TypeScript code to JavaScript in the `dist` directory.
- `npm run lint`: Lints the codebase for potential errors.
- `npm run format`: Formats the code using Prettier.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Logger**: Winston
- **Linter**: ESLint
- **Formatter**: Prettier
- **Testing**: Vitest
- **Development Runner**: `tsx`

```

```
