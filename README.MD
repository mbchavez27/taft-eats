# Taft Eats

**Group #2**

- **Alegre**, Andronicus E.
- **Chavez**, Max Benedict B.
- **Gonzales**, Alexandra Gayle C.

## Introduction

Students at DLSU have access to a wide variety of restaurants near campus, yet deciding where to eat remains a challenge. Limited break times, diverse budgets, and varying food preferences often lead students to rely on word of mouth or social media reviews, which may not accurately reflect the student experience.

**Taft Eats** addresses this problem by providing a web-based platform that helps students discover nearby dining options, read genuine reviews from fellow students, and make informed decisions on where to eat during breaks.

It is designed for the DLSU community, perfect for students with short breaks or those living near campus. It helps you find nearby restaurants, read honest reviews, and choose where to eat based on ratings, tags, and location.

## Architecture & Tech Stack

This project follows a modern, separation-of-concerns architecture.

### **Frontend (Client)**

- **Framework**: React Router v7
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **Architecture**: Feature-Based (Vertical Slicing)

### **Backend (API)**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL 8.0
- **Architecture**: Domain-Driven Design (Vertical Slicing)

### **Infrastructure**

- **Containerization**: Docker & Docker Compose

---

## Features

### 1. User Account & Profile

- **Registration & Auth**: Secure login/signup with session persistence (extends by 3 weeks upon visit).
- **Profile Management**: Public profiles displaying bio, join date, and review history. Users can edit their bio and personal details.
- **Bookmarks**: Save interesting restaurants to a personal list for quick access later.

### 2. Establishment Discovery

- **Smart Browsing**: View featured restaurants with key info like price range (Budget to Expensive), ratings, and tags (e.g., "Korean", "Coffee").
- **Location-Based Search**: Discover dining options near specific campus landmarks (e.g., Henry Sy, Agno Gate, nearby condos).
- **Search & Filter**: Find places by name/description and filter by rating or price.

### 3. Review System

- **Read & Write**: Post reviews with a 5-star rating, title, and rich-text body. Attach images to showcase food.
- **Interaction**: Mark reviews as "Helpful" or "Unhelpful" to surface quality content.
- **Management**: Edit or delete your own reviews at any time.

### 4. Establishment Owners

- **Owner Accounts**: Special accounts tied to specific restaurants.
- **Public Responses**: Owners can reply officially to reviews on their establishment to address feedback.

### 5. Admin Dashboard

- **User Management**: Monitor, create, and deactivate user accounts.
- **Establishment Control**: Add new restaurants, update details, or remove inactive listings.
- **Content Moderation**: Monitor and delete inappropriate reviews to maintain platform quality.

---

## Design Resources

- **System Architecture**: [View High-Level Architecture]("https://www.figma.com/board/rw1mAEY6jcGxnEbcFgBzMq/Taft-Eats-High-Level-Architecture?node-id=0-1&t=J6hIF6ZBW60einCs-1")
- **UI/UX Concept**: [View Figma Design]("https://www.figma.com/design/hzsAc9kw3l4jjuULtujrTC/CCAPDEV-TAFTEATS?node-id=0-1&t=PiNB6iF8vnjbx1jL-1")

---

## Getting Started

This project is fully containerized. You can run the Database, Backend, and Frontend with a single command.

### Prerequisites

- Docker Desktop / Docker Engine
- Node.js (for local development)

### Quick Start (Docker)

1. **Clone the repository**:

```bash
git clone <repository-url>
cd taft-eats

```

2. **Run the application**:

```bash
docker compose up --build

```

3. **Access the App**:

- **Frontend**: [http://localhost:8080]()
- **Backend API**: [http://localhost:3000]()
- **Database (MySQL)**: `localhost:3307`

### Manual Development Setup

If you wish to run the services individually for development:

**1. Database**

```bash
docker compose up db -d

```

**2. Backend (API)**

```bash
cd tafts-eats-api
npm install
npm run dev

```

**3. Frontend (Client)**

```bash
cd tafts-eats-client
npm install
npm run dev

```
