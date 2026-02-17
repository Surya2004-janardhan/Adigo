# Adigo

> Your campus ride companion — book autos, share rides, and save money.

Adigo is a ride-booking app built for college students. Whether you need a quick ride to the gate or want to split costs with friends through monthly auto-sharing, we've got you covered.

---

## What's Inside

```
Adigo/
├── Backend/       # Node.js + Express API
├── Frontend/      # React Native (Expo) mobile app
└── test/          # Testing utilities
```

---

## Features

- **Quick Ride Booking** — Book an auto in seconds
- **Ride History** — Track all your past trips
- **Monthly Auto Share** — Split costs with friends for regular routes
- **Payments** — Integrated with Razorpay for seamless transactions
- **Push Notifications** — Stay updated on ride status
- **User Profiles** — Manage your account and preferences

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React Native, Expo, NativeWind (TailwindCSS)   |
| Backend   | Node.js, Express.js                             |
| Database  | MongoDB (Mongoose)                              |
| Payments  | Razorpay                                        |
| Auth      | JWT                                             |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Expo CLI (`npm install -g expo-cli`)

### Backend Setup

```bash
cd Backend
npm install

# Create a .env file with your MongoDB URI and secrets
# Example:
# MONGO_URI=mongodb://localhost:27017/adigo
# JWT_SECRET=your_secret_key
# RAZORPAY_KEY_ID=your_key
# RAZORPAY_KEY_SECRET=your_secret

node server.js
```

The server runs on `http://localhost:3000`

### Frontend Setup

```bash
cd Frontend
npm install
npm start
```

Scan the QR code with Expo Go (Android/iOS) to run the app.

---

## API Routes

| Route               | Description                    |
|---------------------|--------------------------------|
| `/auth`             | Login & Signup                 |
| `/user`             | Profile, Rides, Booking        |
| `/notification`     | Push notifications             |
| `/payment`          | Razorpay integration           |
| `/monthly-auto`     | Monthly auto-share management  |

---

## Project Structure

### Backend

```
Backend/
├── server.js              # Entry point
├── db/
│   └── dbconnection.js    # MongoDB connection
├── middleware/
│   └── authMiddleware.js  # JWT authentication
├── models/                # Mongoose schemas
│   ├── User.js
│   ├── Ride.js
│   ├── Rider.js
│   ├── Payment.js
│   └── ...
└── routes/                # API endpoints
    ├── authRoute.js
    ├── bookRideRoute.js
    └── ...
```

### Frontend

```
Frontend/
├── App.js                 # Root component & navigation
├── AuthContext.js         # Authentication state
├── ApiContext.js          # API configuration
└── components/
    ├── HomeScreen.js
    ├── LoginSingup.js
    ├── ProfileScreen.js
    ├── RideDetailsScreen.js
    ├── ActiveRideScreen.js
    ├── RideHistoryScreen.js
    ├── PaymentScreen.js
    └── MonthlyAutoShareScreen.js
```

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

---
