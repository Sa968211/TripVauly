# 🌍 TripVault — Personal Travel & Destination Tracker

TripVault is a modern full-stack MERN web application designed to log, organize, and track travel destinations and memories. It features real-time geographic location verification, strict input validation, and interactive travel analytics.

---

## ✨ Features

* **Real-time Location Verification:** Integrated with OpenStreetMap's Nominatim API to ensure entered destinations are verified geographical locations on Earth.
* **Smart Input Validation:** Client-side safeguards that prevent keyboard mashing, repeated characters (e.g., `aaa`, `asasasa`), and generic entries across Titles, Destinations, and Descriptions.
* **Interactive Dashboard:** Includes dynamic travel stats tracking Total Places, Unique Cities, and Average Memory Ratings.
* **Full CRUD Functionality:** Seamlessly create, edit, view, and delete trip logs.
* **User Authentication:** Token-based session handling for secure user access.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Lucide React (SVG Icons), CSS3 (Flexbox & Grid)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **APIs & Tools:** OpenStreetMap Nominatim API, JSON Web Tokens (JWT)

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher)
* [npm](https://www.npmjs.com/) (Node Package Manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Sa968211/TripVauly.git](https://github.com/Sa968211/TripVauly.git)
   cd TripVauly

cd C:\Users\samat\.gemini\antigravity\scratch\tripvault\server
#Install Server Dependencies:
 cd C:\Users\samat\.gemini\antigravity\scratch\tripvault\server
 cd C:\Users\samat\.gemini\antigravity\scratch\tripvault\server
npm install express cors dotenv mongoose jsonwebtoken bcryptjs mongodb-memory-server
 node index.js

   Install Client Dependencies:
   cd C:\Users\samat\.gemini\antigravity\scratch\tripvault\client
    npm install
     npm run dev

    To run both the backend server and frontend application, open two terminal windows side-by-side:

Terminal 1: Start Backend Server
cd server
node index.js

Server runs on http://localhost:5000

Terminal 2: Start Frontend Client

cd client
npm run dev
Client runs on http://localhost:3001 (or http://localhost:5173)

Navigate to  http://localhost:3001/dashboard
📂 Folder Structure

TripVauly/
├── client/              # React frontend application
│   ├── src/
│   │   ├── pages/       # Dashboard, Login, and Register components
│   │   ├── App.jsx      # Main router component
│   │   └── main.jsx     # App entry point
│   └── package.json
├── server/              # Express backend server
│   ├── models/          # Mongoose database models (Trip, User)
│   ├── routes/          # REST API endpoints (auth, trips)
│   ├── index.js         # Backend entry point
│   └── package.json
└── README.md            # Project documentation

## 👤 Author

* **Samat** — [GitHub Profile](https://github.com/Sa968211)
2. Push the fix to GitHub
git add README.md
git commit -m "Update author information in README"
git push origin main in your browser to start using TripVault!
