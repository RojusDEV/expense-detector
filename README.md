# Expense Detector

Full-stack finance application that lets you track expenses efficiently, identify anomalies, and gain insights.

## Features

- Bank statement import and parsing CSV information into the database.
- Spending anomaly detection based on goods category and month.
- Subscription detection: finds recurring payments that share the same amount and date.
- Merchant detection: Java backend finds all merchants from transactions.
- Main dashboard that shows the latest imported transactions and monthly stats, spending and income graphs.
  
  ### Upcoming Features
  - Bank synchronization so the user wouldn't need to upload new CSV files.
  - Notification feature: users who select a preference for notifications would get weekly/daily/monthly summaries on finance stats.
  - Insights
  - AI creates a plan to save money
    
## Tech Stack
- Backend: Java 21, Spring Boot, PostgreSQL
- Frontend: React, TypeScript, Vite, TanStack Query, Tailwind CSS

## Requirements

**Backend**
- Java 21+ (JDK)
- Maven Wrapper included
- Spring Boot 4.0.6
- PostgreSQL 18+ 
- Docker & Docker Compose (optional, if you containerize the DB)

**Frontend**
- Node.js 20+
- npm 10+
- React 19.2.7
- TypeScript ~6.0.2
- Vite ^8.1.1

## Installation
1. Clone the repo
   ```sh
   git clone https://github.com/RojusDEV/expense-detector.git
   ```
2. Set up the database
```sh
   # If using Docker Compose:
   docker compose up -d
   
   # Or create a PostgreSQL database manually:
   # createdb expense_detector
```
3. Configure environment variables

   Create `backend/backend/src/main/resources/application-local.properties`
   (or `.env`, depending on your setup) with:
```
   spring.datasource.url=jdbc:postgresql://localhost:5432/expense_detector
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   jwt.secret=your_jwt_secret
```
4. Run the backend
```sh
   cd backend/backend
   ./mvnw spring-boot:run
```
   *(Windows: use `mvnw.cmd spring-boot:run` instead)*
5. Run the frontend
```sh
   cd frontend
   npm install
   npm run dev
```
6. Open the app

   Visit `http://localhost:5173` (frontend) — backend runs on `http://localhost:8080`
