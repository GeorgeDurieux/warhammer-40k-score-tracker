# Warhammer 40K Score Tracker

A personal project built to replace the use of Excel sheets, notepads, and other non-specialized apps that Warhammer players often rely on.  
This app provides a streamlined way to **submit matches, automatically calculate WTC scores, view match history, and analyze detailed statistics** with filtering and charts — built for both casual and competitive players.  

---

## Features

- **Submit Matches**  
  - Record your games with armies, detachments, scores, and tournament info.  
  - WTC score is calculated automatically.  

- **Match History**  
  - View all past games in a sortable and filterable list.  
  - Edit or delete entries easily.  

- **Advanced Filters**  
  - Filter by army, detachment, opponent, tournament only, and by date range.  
  - Combine filters for detailed insights (e.g., T'au vs. a specific detachment, tournaments only, March–September).  

- **Statistics Dashboard**  
  - Dynamic tables and charts show win rates and performance trends.  
  - Stats update instantly when applying filters.
 
- **Admin Tools**  
  - Admin users can manage the **armies** and **detachments** database.  
  - Prevents manual entry mistakes by keeping consistent dropdown options in the frontend.  
  - CRUD operations (Create, Read, Update, Delete) are available only to admin accounts.  

---

## Tech Stack

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT Authentication**
- **Bcrypt** for password hashing
- **Jest** & **Supertest** for testing

### Frontend
- **React** with **TypeScript**
- **Recharts** for charts
- **React-Range** for custom sliders
- **React-Icons**

---

## Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/warhammer-score-tracker.git
cd warhammer-score-tracker
```

### 2. Install dependencies

- Backend
```
cd backend
npm install
```
- Frontend
```
cd frontend
npm install
```

### 3. Environment variables

Create a .env file in the backend with:

DATABASE_URL="postgresql://username:password@localhost:5432/warhammer_scoring"
JWT_SECRET="yoursecret"

### 4. Database

Run prisma migrations:
```
npx prisma migrate dev
```

### 5. Run the app

- Backend:
```
npm run dev
```
- Frontend: 
```
npm start
```

## Database Schema

![Database Schema](./warhammer-scoring-frontend/src/assets/Warhammer-scoring-tracker-schema.png)

## Usage

- Submit a match with scores, armies, and tournament details.
- Browse match history and manage records.
- Apply filters to drill into specific performance insights.
- View statistics in charts and tables that update dynamically.

## Licence

This project is licensed under MIT


































