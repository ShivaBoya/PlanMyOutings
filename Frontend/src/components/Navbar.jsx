// src/components/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import planpalLogo from "../assets/planpal-logo.svg";

// ICONS
import {
  HamburgerIcon,
  XIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  HomeIcon,
  RestaurantIcon,
  MovieIcon,
  TempleIcon,
  BeachIcon,
  WaterfallIcon,
  ParkIcon,
  TripIcon,
  ProfileIcon,
  SettingsIcon,
  CreateIcon,
  EventIcon,
} from "./Icons";

export default function Navbar({
  user,
  setUser,
  setAuthModalOpen,
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
}) {
  const sidebarRef = useRef(null);
  const profileRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const backendURL = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

  // PUBLIC SECTIONS
  const sections = [
    { label: "Home", path: "/", icon: HomeIcon },
    { label: "Restaurants", path: "/restaurants", icon: RestaurantIcon },
    { label: "Movies", path: "/movies", icon: MovieIcon },
    { label: "Beaches", path: "/beaches", icon: BeachIcon },
    { label: "Parks", path: "/parks", icon: ParkIcon },
  ];

  // USER ROUTES
  const userRoutes = [
    { label: "Create Group", path: "/create", icon: CreateIcon },
    { label: "My Trips", path: "/mytrip", icon: TripIcon },
    { label: "My Events", path: "/myevents", icon: EventIcon },
  ];

  const profileMenu = [
    { label: "Profile", path: "/profile", icon: ProfileIcon },
    { label: "Settings", path: "/settings", icon: SettingsIcon },
  ];

  const navigateTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
    setProfileOpen(false);
  };

  const gotoProtected = (path) => {
    if (!user) return setAuthModalOpen(true);
    navigateTo(path);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${backendURL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) { }

    setUser(null);
    setProfileOpen(false);
    setSidebarOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // Scroll Effect
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Glassmorphic Navbar Classes
  // Floating pill design on scroll, full width on top
  const navClasses = `fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out flex items-center justify-between backdrop-blur-xl ${scrolled
    ? `top-4 w-[90%] md:w-[85%] max-w-7xl rounded-full px-6 py-3 border shadow-2xl ${darkMode ? "bg-slate-900/80 border-slate-700/50 shadow-black/50" : "bg-white/80 border-white/50 shadow-blue-500/10"
    }`
    : `top-0 w-full px-4 md:px-8 py-4 border-b border-transparent ${darkMode ? "bg-transparent text-white" : "bg-transparent text-gray-800"
    }`
    }`;

  const buttonClass = (path) => `px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all duration-300 relative overflow-hidden group/btn ${isActive(path)
    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105"
    : darkMode
      ? "text-gray-300 hover:bg-white/10 hover:text-white"
      : "text-gray-600 hover:bg-white/50 hover:text-black hover:shadow-sm"
    }`;

  return (
    <>
      <header className={navClasses}>
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl transition-colors ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
          >
            <HamburgerIcon className="h-6 w-6" />
          </button>

          <button
            onClick={() => navigateTo("/")}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5 shadow-lg group-hover:shadow-blue-500/50 transition-all">
              <img src={planpalLogo} className="w-full h-full rounded-full object-cover bg-white" alt="Logo" />
            </div>
            <span className="font-bold text-xl tracking-wide">Roamly</span>
          </button>
        </div>

        {/* CENTER LINKS (Desktop) */}
        <div className="hidden lg:flex items-center gap-1">
          {sections.slice(0, 5).map(s => (
            <button
              key={s.path}
              onClick={() => navigateTo(s.path)}
              className={buttonClass(s.path)}
            >
              {s.label}
            </button>
          ))}
        </div>


        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* DARK MODE BUTTON */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-full transition-all ${darkMode ? "bg-white/5 hover:bg-white/10" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            {darkMode ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-slate-700" />}
          </button>

          {/* AUTH BUTTONS */}
          {!user ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all flex items-center gap-2"
            >
              <UserIcon className="h-4 w-4" /> Sign In
            </button>
          ) : (
            <>
              <div className="hidden md:flex gap-2">
                {userRoutes.map(r => (
                  <button
                    key={r.path}
                    onClick={() => gotoProtected(r.path)}
                    className={`p-2.5 rounded-xl border transition-all ${darkMode
                      ? "border-white/10 hover:bg-white/10"
                      : "border-gray-200 hover:bg-gray-50"
                      }`}
                    title={r.label}
                  >
                    <r.icon className="h-5 w-5" />
                  </button>
                ))}
              </div>

              {/* PROFILE DROPDOWN */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-0.5 shadow-lg overflow-hidden ml-2"
                >
                  <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-white ${darkMode ? "bg-slate-800" : "bg-white text-blue-600"}`}>
                    {user.username ? user.username[0].toUpperCase() : <UserIcon className="h-5 w-5" />}
                  </div>
                </button>

                {profileOpen && (
                  <div
                    className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl overflow-hidden border backdrop-blur-xl z-50 animate-fade-in ${darkMode ? "bg-slate-900/90 border-white/10 text-white" : "bg-white/90 border-gray-200 text-gray-800"
                      }`}
                  >
                    <div className="px-4 py-3 border-b border-gray-500/10">
                      <p className="text-sm font-bold truncate">{user.username || "User"}</p>
                      <p className="text-xs opacity-60 truncate">{user.email}</p>
                    </div>
                    {profileMenu.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => gotoProtected(item.path)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-500/10 flex items-center gap-3 transition-colors text-sm font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    ))}

                    <div className="h-px bg-gray-500/10 my-1" />

                    {/* LOGOUT */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-red-500/10 text-red-500 flex items-center gap-3 transition-colors text-sm font-bold"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Spacer to prevent content hiding behind fixed navbar */}
      <div className="h-20" />

      {/* SIDEBAR */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${sidebarOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
      >
        <div
          onClick={() => setSidebarOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <aside
          ref={sidebarRef}
          className={`absolute left-0 top-0 h-full w-72 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 shadow-2xl ${darkMode ? "bg-slate-900 border-r border-white/10" : "bg-white"}`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-500/10">
            <h3 className={`font-bold text-xl ${darkMode ? "text-white" : "text-gray-900"}`}>Menu</h3>
            <button onClick={() => setSidebarOpen(false)} className={`p-2 rounded-lg ${darkMode ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-800"}`}>
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
            {sections.map((s) => (
              <button
                key={s.path}
                onClick={() => navigateTo(s.path)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${isActive(s.path)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : darkMode ? "text-gray-300 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <s.icon className="h-5 w-5" /> {s.label}
              </button>
            ))}

            <div className="my-4 h-px bg-gray-500/10"></div>
            <p className="px-4 text-xs font-bold opacity-50 uppercase tracking-widest mb-2">User</p>

            {user &&
              userRoutes.map((r) => (
                <button
                  key={r.path}
                  onClick={() => gotoProtected(r.path)}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${isActive(r.path)
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : darkMode ? "text-gray-300 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <r.icon className="h-5 w-5" /> {r.label}
                </button>
              ))}
          </nav>
        </aside>
      </div>
    </>
  );
}
