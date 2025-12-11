# 🌍 Roamly - PlanMyOutings

**Roamly** (PlanMyOutings) is a modern, full-stack web application designed to simplify group outing planning. It combines real-time collaboration, event management, and AI-powered suggestions into a seamless, premium user experience.

![Roamly Banner](https://via.placeholder.com/1200x400?text=Roamly+Dashboard)

## 🚀 Key Features

### 📅 Event Management
- **Create & Manage Events**: Organize outings with detailed itineraries (Date, Time, Location).
- **RSVP System**: Interactive "Going / Maybe / No" status updates for members.
- **Premium Dashboard**: A "Glassmorphism" styled event hub with tabbed views.

### 💬 Real-Time Collaboration
- **Group Chat**: Persistent chat rooms for every event and group.
- **Direct Messaging**: WhatsApp-style private messaging between users.
- **Socket.IO Integration**: Instant message delivery, typing indicators, and reactions.
- **File Sharing**: Upload images and voice notes directly in chat.

### 📊 Interactive Tools
- **Live Polls**: Create multi-option polls with real-time voting progress bars.
- **AI Suggestions**: Get automated recommendations for **Restaurants, Cafes, and Movies** based on group preferences.
- **Smart Bot**: An integrated AI assistant (`PlanPal AI`) to answer travel-related queries.

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Sleek, translucent cards with vivid background blobs and gradients.
- **Dark Mode**: Fully supported system-wide dark theme.
- **Responsive Layout**: Optimized for Desktop, Tablet, and Mobile devices.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) (Vite)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: CSS Transitions & Keyframes
- **State Management**: React Hooks (`useState`, `useEffect`, `useContext`)
- **Routing**: React Router DOM
- **Notifications**: React Toastify

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Real-Time Engine**: [Socket.IO](https://socket.io/)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **File Uploads**: Multer
- **API**: RESTful Architecture

---

## 📂 Project Structure

```bash
OutMyPlannigs/
├── Backend/              # Server-side code
│   ├── config/           # DB connection
│   ├── models/           # Mongoose schemas (User, Event, Chat, Poll, etc.)
│   ├── routes/           # API endpoints
│   ├── server.js         # Entry point (Express + Socket.IO)
│   └── .env              # Environment variables
│
└── Frontend/             # Client-side code
    ├── src/
    │   ├── components/   # Reusable UI (Navbar, PollsSection, SuggestionsSection)
    │   ├── pages/        # Main views (Home, EventDetails, ChatBox, GroupDetails)
    │   └── App.jsx       # Root component + Routing
    └── vite.config.js    # Vite configuration
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** (v16+)
- **MongoDB** (Local or Atlas URI)

### 1️⃣ Backend Setup
Navigate to the `Backend` directory and install dependencies:

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:

```env
PORT=7777
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
# Server runs on http://localhost:7777
```

### 2️⃣ Frontend Setup
Navigate to the `Frontend` directory and install dependencies:

```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` folder:

```env
VITE_BACKEND_URL=http://localhost:7777
```

Start the client:

```bash
npm run dev
# App runs on http://localhost:5173
```

---

## 🔗 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **AUTH** | `/api/auth/register` | Register new user |
| | `/api/auth/login` | Login user |
| **GROUPS** | `/api/groups` | List/Create Groups |
| | `/api/groups/:id` | Get Group Details |
| **EVENTS** | `/api/groups/:id/events` | Create/List Events |
| | `/api/events/:id` | Get Event Dashboard |
| **POLLS** | `/api/events/:id/polls` | Create/List Polls |
| | `/api/polls/:id/vote` | Vote on a poll |
| **SOCIAL** | `/api/chat` | Access Chat Rooms |
| | `/api/bot/ask` | Query AI Assistant |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

### 📝 License
This project is licensed under the ISC License.
