# PlanMyOutings 🌍✈️

PlanMyOutings is a comprehensive, real-time social event planning platform designed to make organizing group outings seamless and fun. Whether it's a beach trip, a movie night, or a dinner at a restaurant, PlanMyOutings helps you create groups, plan events, invite friends, and coordinate everything in real-time with integrated chat and polling features.

## 🚀 Features

### Core Functionality
*   **User Authentication**: Secure Signup/Login with JWT-based authentication.
*   **Group Management**: Create and join interest-based groups.
*   **Event Planning**: Create detailed events within groups (Movies, Restaurants, Parks, Beaches, etc.).
*   **Real-time Chat**: Integrated WebSocket-based chat for every event and group.
*   **Direct Messaging**: Private one-on-one messaging between users.
*   **Polling System**: Create polls to decide on dates, venues, or activities collaboratively.
*   **RSVP Tracking**: Real-time tracking of who is attending.
*   **Outing Suggestions**: Explore recommendations for movies, restaurants, and tourist spots.

### UI/UX
*   **Modern Design**: Built with React 19 and Tailwind CSS v4 for a sleek, responsive interface.
*   **3D Backgrounds**: Immersive visual experience.
*   **Dark/Light Mode**: Fully supported theme switching.
*   **Animations**: Smooth transitions using Framer Motion and Lottie.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Routing**: [React Router v7](https://reactrouter.com/)
*   **State Management**: React Hooks & Context API
*   **Real-time Communication**: [Socket.io-client](https://socket.io/)
*   **Icons**: Lucide React, React Icons
*   **Animations**: Framer Motion, Lottie React

### Backend
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js v5](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose v9)
*   **Authentication**: JSON Web Tokens (JWT) & bcryptjs
*   **Real-time Server**: [Socket.io](https://socket.io/)
*   **File Uploads**: Multer
*   **Email Services**: Nodemailer

---

## 📂 Project Structure

The project is organized into two main directories: **Frontend** and **Backend**.

```
PlanMyOutings/
├── Backend/                 # Express.js Server & API
│   ├── config/              # Database connection
│   ├── models/              # Mongoose Schemas (User, Group, Event, Chat, etc.)
│   ├── routes/              # API Routes (Auth, Groups, Events, etc.)
│   ├── server.js            # Main entry point
│   └── package.json         # Backend dependencies
│
├── Frontend/                # React Application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application views (Home, Dashboard, CreateEvent, etc.)
│   │   ├── App.jsx          # Main App component & Routing
│   │   └── main.jsx         # Integration point
│   ├── vite.config.js       # Vite configuration
│   └── package.json         # Frontend dependencies
└── README.md                # Project Documentation
```

---

## ⚙️ Usage & Installation

### Prerequisites
*   Node.js (v18+ recommended)
*   MongoDB (Local or Atlas URL)
*   Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/PlanMyOutings.git
cd PlanMyOutings
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory with the following variables:
```env
PORT=7777
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
# Server runs on http://localhost:7777
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` directory (optional if using local default):
```env
VITE_BACKEND_URL=http://localhost:7777
```

Start the frontend development server:
```bash
npm run dev
# App runs on http://localhost:5173
```

---

## 🔌 API Overview

The backend exposes a RESTful API at `http://localhost:7777/api`.

### Key Endpoints

| Feature | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Register a new user |
| | `POST` | `/api/auth/login` | Login user |
| | `GET` | `/api/me` | Get current user profile (Auto-login) |
| **Groups** | `POST` | `/api/groups/create` | Create a new group |
| | `GET` | `/api/groups/:id` | Get group details |
| | `POST` | `/api/groups/:id/join` | Join a group |
| **Events** | `POST` | `/api/events` | Create a new event |
| | `GET` | `/api/events/:id` | Get event details |
| **Polls** | `POST` | `/api/polls` | Create a poll |
| | `POST` | `/api/polls/:id/vote` | Vote in a poll |

---

## ⚡ Socket.IO Events

The application uses WebSocket for real-time updates.

*   `auth:user`: Authenticates user socket connection.
*   `join:event`: Joins a specific event room for updates.
*   `message:create`: Sends a new chat message.
*   `poll:update`: Broadcasts real-time poll results.
*   `dm:message`: Sends a direct private message.

---

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

---

Made with ❤️ by Shiva
