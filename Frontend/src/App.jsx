import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Background3D from "./components/Background3D";

// Public Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Restaurants from "./pages/Restaurants";
import AllRestaurants from "./components/AllRestarents";
import Movies from "./pages/Movies";
import Temples from "./pages/Temples";
import Beaches from "./pages/Beaches";
import Waterfalls from "./pages/Waterfalls";
import Parks from "./pages/Parks";

// User Pages
import Profile from "./pages/Profile";

// Trip & Groups
import MyTrip from "./pages/MyTrip";
import MyEvents from "./pages/MyEvents";
import CreateGroup from "./pages/CreateGroup";
import GroupDetails from "./pages/GroupDetails";
import JoinGroup from "./pages/JoinGroup";

// Events System
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import ChatBox from "./pages/ChatBox"; // New real-time chat page

// Auth
import AuthModal from "./pages/Register";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const backendURL = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

  // const siteBg = darkMode ? "#0f172a" : "#e0f2fe"; // Removed for 3D Background

  // ================================
  // 🔐 AUTO-LOGIN ON REFRESH
  // ================================
  const fetchUser = async () => {
    try {
      const res = await fetch(`${backendURL}/api/me`, {
        credentials: "include",
      });

      if (res.status === 401 || res.status === 404) {
        setUser(null);
        return;
      }

      const data = await res.json();

      if (res.ok) setUser(data.user);
      else setUser(null);
    } catch (err) {
      console.log("Auto-login failed", err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ================================
  // 🔒 PROTECTED ROUTE
  // ================================
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/" replace />;
  };

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow =
      sidebarOpen || authModalOpen ? "hidden" : "auto";
  }, [sidebarOpen, authModalOpen]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className="min-h-screen transition-colors relative"
        style={{ color: darkMode ? "#f3f4f6" : "#1f2937" }}
      >
        <Background3D darkMode={darkMode} />
        {/* NAVBAR */}
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
          setUser={setUser}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setAuthModalOpen={setAuthModalOpen}
        />

        {/* ======================
           ALL ROUTES
        ====================== */}
        <Routes>
          {/* HOME PAGE */}
          <Route
            path="/"
            element={
              <Home
                darkMode={darkMode}
                user={user}
                setAuthModalOpen={setAuthModalOpen}
              />
            }
          />

          {/* PUBLIC EXPLORE PAGES */}
          <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
          <Route path="/restaurants" element={<Restaurants darkMode={darkMode} />} />
          <Route path="/all-restaurants" element={<AllRestaurants darkMode={darkMode} />} />
          <Route path="/movies" element={<Movies darkMode={darkMode} />} />
          <Route path="/temples" element={<Temples darkMode={darkMode} />} />
          <Route path="/beaches" element={<Beaches darkMode={darkMode} />} />
          <Route path="/waterfalls" element={<Waterfalls darkMode={darkMode} />} />
          <Route path="/parks" element={<Parks darkMode={darkMode} />} />

          {/* ======================
              PROTECTED ROUTES
          ====================== */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile darkMode={darkMode} user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mytrip"
            element={
              <ProtectedRoute>
                <MyTrip darkMode={darkMode} user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/myevents"
            element={
              <ProtectedRoute>
                <MyEvents darkMode={darkMode} user={user} />
              </ProtectedRoute>
            }
          />

          {/* CREATE GROUP */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateGroup darkMode={darkMode} user={user} />
              </ProtectedRoute>
            }
          />

          {/* GROUP DETAILS */}
          <Route
            path="/group/:id"
            element={
              <ProtectedRoute>
                <GroupDetails darkMode={darkMode} user={user} />
              </ProtectedRoute>
            }
          />

          {/* JOIN GROUP */}
          <Route
            path="/group/:id/join"
            element={
              <ProtectedRoute>
                <JoinGroup darkMode={darkMode} user={user} />
              </ProtectedRoute>
            }
          />

          {/* ======================
             EVENTS SYSTEM ROUTES
          ====================== */}

          <Route
            path="/group/:groupId/create-event"
            element={
              <ProtectedRoute>
                <CreateEvent darkMode={darkMode} user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/event/:eventId"
            element={
              <ProtectedRoute>
                <EventDetails darkMode={darkMode} user={user} />
              </ProtectedRoute>
            }
          />

          {/* REALTIME CHAT */}
          <Route
            path="/event/:eventId/chat"
            element={
              <ProtectedRoute>
                <ChatBox darkMode={darkMode} user={user} />
              </ProtectedRoute>
            }
          />

          {/* CATCH ALL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* AUTH MODAL */}
        {authModalOpen && (
          <AuthModal
            onClose={() => setAuthModalOpen(false)}
            setUser={(loggedUser) => {
              setUser(loggedUser);
              setAuthModalOpen(false);
            }}
          />
        )}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
}
