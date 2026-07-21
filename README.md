# 📡 SubDub — Subscription Tracker API

A production-ready RESTful API for tracking and managing subscriptions, built with Express.js and MongoDB. Features JWT authentication, rate limiting, bot protection, and automated email reminders for upcoming renewals.



## 📚 Background

This project was built by following the [Complete Backend Course | Build and Deploy Your First Production-Ready API](https://www.youtube.com/watch?v=rOpEN1JDaD0&t=3632s) tutorial by **JavaScript Mastery**. The tutorial covers building a full backend API from scratch using Express.js, MongoDB, and various production-level integrations.

> **Note:** The original tutorial deploys to a VPS, but this project was adapted to deploy on **Vercel** as a serverless function instead — a free alternative that required some structural changes to `app.js` and the database connection to work in a serverless environment.

## ✨ Features

- **User Authentication** — Sign up, sign in, and sign out with JWT-based auth
- **Subscription CRUD** — Create, read, update, delete, and cancel subscriptions
- **Automated Email Reminders** — Sends reminder emails 7, 5, and 1 days before subscription renewal using Upstash Workflows + Nodemailer
- **Rate Limiting & Bot Protection** — Powered by Arcjet (shield, bot detection, token bucket rate limiting)
- **Error Handling** — Centralized error middleware with Mongoose-specific error parsing

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JSON Web Tokens** | Authentication |
| **bcrypt.js** | Password hashing |
| **Arcjet** | Rate limiting, bot detection, shield protection |
| **Upstash QStash** | Workflow scheduling for email reminders |
| **Nodemailer** | Email delivery (Gmail SMTP) |
| **Day.js** | Date manipulation |
| **Vercel** | Serverless deployment |

## 🚀 API Routes

Base URL: `http://localhost:5500`

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Welcome message — confirms the API is running |

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/sign-up` | ❌ | Create a new user account |
| `POST` | `/api/v1/auth/sign-in` | ❌ | Sign in and receive a JWT |
| `POST` | `/api/v1/auth/sign-out` | ❌ | Sign out |

**Sign Up request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Sign In request body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Users (`/api/v1/users`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/users` | ❌ | Get all users |
| `GET` | `/api/v1/users/:id` | ✅ Bearer | Get a specific user by ID |
| `POST` | `/api/v1/users` | ❌ | Create a user (placeholder) |
| `PUT` | `/api/v1/users/:id` | ❌ | Update a user (placeholder) |
| `DELETE` | `/api/v1/users/:id` | ❌ | Delete a user (placeholder) |

### Subscriptions (`/api/v1/subscriptions`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/subscriptions` | ❌ | Get all subscriptions |
| `GET` | `/api/v1/subscriptions/:id` | ❌ | Get a subscription by ID (placeholder) |
| `POST` | `/api/v1/subscriptions` | ✅ Bearer | Create a new subscription |
| `PUT` | `/api/v1/subscriptions/:id` | ✅ Bearer | Update a subscription |
| `DELETE` | `/api/v1/subscriptions/:id` | ✅ Bearer | Delete a subscription |
| `GET` | `/api/v1/subscriptions/users/:id` | ✅ Bearer | Get all subscriptions for a user |
| `PUT` | `/api/v1/subscriptions/:id/cancel` | ✅ Bearer | Cancel a subscription |
| `GET` | `/api/v1/subscriptions/upcoming-renewals` | ❌ | Get upcoming renewals (placeholder) |

**Create Subscription request body:**
```json
{
  "name": "Netflix",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "credit_card",
  "startDate": "2025-07-01"
}
```

> **Currencies:** `USD`, `EUR`, `GBP`
> **Frequencies:** `daily`, `weekly`, `monthly`, `yearly`
> **Categories:** `entertainment`, `productivity`, `education`, `health`, `other`
> **Payment Methods:** `credit_card`, `paypal`, `bank_transfer`, `other`

### Workflows (`/api/v1/workflows`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/workflows/subscription/reminder` | — | Upstash workflow endpoint (triggered automatically) |

> This endpoint is called automatically by Upstash QStash when a subscription is created. It schedules and sends email reminders at 7, 5, and 1 day(s) before the renewal date.

## 🧪 Testing the API

After running locally, you can test the API using **cURL**, **Postman**, or any HTTP client.

### 1. Create an account

```bash
curl -X POST http://localhost:5500/api/v1/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'
```

### 2. Sign in to get a token

```bash
curl -X POST http://localhost:5500/api/v1/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

Copy the `token` from the response.

### 3. Create a subscription (authenticated)

```bash
curl -X POST http://localhost:5500/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name": "Spotify", "price": 9.99, "currency": "USD", "frequency": "monthly", "category": "entertainment", "paymentMethod": "credit_card", "startDate": "2025-07-01"}'
```

### 4. View all subscriptions

```bash
curl http://localhost:5500/api/v1/subscriptions
```

## ⚙️ Running Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/subscription-tracker.git
   cd subscription-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**

   Create a `.env.development.local` file in the root with:
   ```env
   PORT=5500
   SERVER_URL="http://localhost:5500"
   NODE_ENV='development'
   DB_URI="your_mongodb_connection_string"
   JWT_SECRET="your_jwt_secret"
   JWT_EXPIRES_IN="1d"
   ARCJET_KEY=your_arcjet_key
   ARCJET_ENV=development
   QSTASH_URL=http://127.0.0.1:8080
   QSTASH_TOKEN=your_qstash_token
   EMAIL_PASSWORD=your_gmail_app_password
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```

   The API will be running at `http://localhost:5500`.

## 📁 Project Structure

```
subscription-tracker/
├── app.js                    # Express app entry point
├── config/
│   ├── env.js                # Environment variable loader
│   ├── arcjet.js             # Arcjet rate limiting & bot protection config
│   ├── nodemailer.js         # Email transporter config
│   └── upstash.js            # Upstash workflow client config
├── controllers/
│   ├── auth.controller.js    # Sign up, sign in, sign out logic
│   ├── user.controller.js    # User CRUD logic
│   ├── subscription.controller.js  # Subscription CRUD logic
│   └── workflow.controller.js      # Email reminder workflow
├── database/
│   └── mongodb.js            # MongoDB connection handler
├── middlewares/
│   ├── arcjet.middleware.js  # Rate limiting & bot detection middleware
│   ├── auth.middleware.js    # JWT authorization middleware
│   └── error.middleware.js   # Centralized error handler
├── models/
│   ├── user.model.js         # User Mongoose schema
│   └── subscription.model.js # Subscription Mongoose schema
├── routes/
│   ├── auth.routes.js        # Auth endpoints
│   ├── user.routes.js        # User endpoints
│   ├── subscription.routes.js # Subscription endpoints
│   └── workflow.routes.js    # Workflow endpoints
├── utils/
│   ├── send-email.js         # Email sending utility
│   └── email-template.js     # HTML email templates
├── vercel.json               # Vercel deployment config
└── package.json
```
