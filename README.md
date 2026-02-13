# 🏢 Blue Real Estate

Blue Real Estate is a full-stack property management system built for managing buildings, apartments, tenants, and automatic yearly rent increases.

## ✨ What it does

- Secure admin login with JWT
- Add and manage buildings and apartment units
- Update apartment occupancy and tenant contract data
- Clear apartment data when units become vacant
- Run rent updates manually or automatically on a schedule

## 🧰 Tech stack

### Backend (`back/`)
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- node-cron

### Frontend (`front/`)
- React (Create React App)
- React Router
- Axios

## 📁 Repository structure

```text
Blue-real-Estate/
├── back/
│   ├── config/
│   ├── controller/
│   ├── jobs/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
├── front/
│   ├── public/
│   ├── src/
│   └── package.json
├── package.json
└── README.md
```

## ⚙️ Getting started

### 1) Clone

```bash
git clone https://github.com/MARWAN-elmasrry/Blue-real-Estate.git
cd Blue-real-Estate
```

### 2) Install dependencies

```bash
npm install
npm install --prefix back
npm install --prefix front
```

### 3) Configure environment

Create a file at `back/.env`:

```env
PORT=5000
CONNECTION_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4) Run both apps

```bash
npm run dev
```

Or run each app separately:

```bash
npm run server
npm run client
```

## 🔌 API quick reference

Base URL: `http://localhost:5000/api`

### Authentication

- `POST /auth/login`

Request body:

```json
{
  "admin": "admin_username",
  "password": "admin_password"
}
```

### Buildings and apartments

> These routes require `Authorization: Bearer <token>`.

- `POST /` — create a building
- `GET /` — list all buildings
- `GET /:id` — get one building by ID
- `PUT /:id/apartments/:apartmentNumber` — update an apartment
- `DELETE /:id/apartments/:apartmentNumber` — clear apartment and set vacant
- `POST /trigger-rent-update` — trigger annual rent update manually

## 🔁 Rent update rules

A rent increase is applied only when all conditions are true:

- Apartment status is `Occupied`
- `contractStartDate` exists
- `rentIncreasePerYear` is greater than 0
- Current date matches contract anniversary (month/day)

Automatic schedule: daily at **1:00 AM** (server local time).

## 🤝 Contributing

1. Fork the repository
2. Create a branch (`feat/your-feature`)
3. Commit your changes
4. Open a pull request

---

If this project is useful, consider leaving a ⭐ on GitHub.
