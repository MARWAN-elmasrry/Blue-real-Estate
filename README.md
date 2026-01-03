# Real Estate Fullstack Management System

A full‑stack real estate management application for managing buildings, apartments, tenants, and automated annual rent updates.

## Features

* Admin authentication using JWT
* Manage buildings and apartments
* Track tenant information and rental contracts
* Automatic annual rent increase (manual trigger + cron job)
* RESTful API built with Node.js, Express, and MongoDB
* Full‑stack setup with separate client and server

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Node‑cron

### Frontend

* Vite + React

## Project Structure

```
real-estate-fullstack/
│
├── client/              # Frontend (React + Vite)
├── server/              # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js        # MongoDB connection
│   ├── controllers/
│   │   └── build.cont.js
│   ├── jobs/
│   │   └── rentUpdateJob.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── .env
│
├── package.json         # Root scripts
└── README.md
```

## Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd real-estate-fullstack
```

### 2. Install dependencies

```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 3. Environment Variables

Create a `.env` file inside the `server` folder:

```
PORT=5000
CONNECTION_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the project (Frontend + Backend)

```bash
npm run dev
```

This uses **concurrently** to start both servers.

## API Documentation

### Auth

#### Admin Login

```
POST /api/auth/login
```

**Body:**

```json
{
  "admin": "admin_username",
  "password": "password"
}
```

---

### Buildings

#### Add Building

```
POST /api/buildings
```

**Body:**

```json
{
  "buildingName": "Tower A",
  "buildingNumber": 1,
  "location": "Cairo",
  "numberOfApartments": 20,
  "apartmentsPerFloor": 4
}
```

#### Get All Buildings

```
GET /api/buildings
```

#### Get Building By ID

```
GET /api/buildings/:id
```

---

### Apartments

#### Update Apartment

```
PUT /api/buildings/:id/apartments/:apartmentNumber
```

#### Clear Apartment (Make Vacant)

```
PUT /api/buildings/:id/apartments/:apartmentNumber/clear
```

---

### Rent Updates

#### Manual Rent Update Trigger

```
POST /api/rent/update
```

#### Automatic Rent Update (Cron)

* Runs **daily at 1:00 AM**
* Increases rent based on contract anniversary

## Rent Update Logic

* Apartment must be `Occupied`
* `contractStartDate` must exist
* `rentIncreasePerYear` > 0
* Increase applies only on yearly anniversary

## Scripts

```json
"scripts": {
  "server": "npm run dev --prefix server",
  "client": "npm run dev --prefix client",
  "dev": "concurrently \"npm run server\" \"npm run client\""
}
```

## Future Improvements

* Role‑based access control
* Dashboard analytics
* Payment tracking
* Export reports (PDF / Excel)

## Author

**Marwan Elmasrry**

---

If you find this project useful, feel free to ⭐ the repository.
