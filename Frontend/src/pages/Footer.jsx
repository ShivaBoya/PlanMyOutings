import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer({ darkMode }) {
  const bgColor = darkMode ? "#0f172a" : "#e0f2fe";
  const textColor = darkMode ? "#f3f4f6" : "#1f2937";
  const accentColor = darkMode ? "text-cyan-400" : "text-blue-600";
  const hoverBg = darkMode ? "hover:bg-white/10" : "hover:bg-blue-100";

  return (
    <footer
      className={`relative w-full py-12 px-6 md:px-20 transition-colors duration-500`}
      style={{ background: bgColor, color: textColor }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & About */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/planpal-logo.svg"
              alt="PlanPal Logo"
              className="h-10 w-10 rounded-full"
            />
            <span className="font-bold text-xl">PlanPal</span>
          </Link>
          <p className="text-sm">
            Plan your outings, discover places nearby, and enjoy stress-free hangouts
            with friends. Explore beaches, restaurants, movies & more!
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <Link to="/home" className={`transition-colors ${accentColor} ${hoverBg} px-2 py-1 rounded`}>Home</Link>
          <Link to="/discover" className={`transition-colors ${accentColor} ${hoverBg} px-2 py-1 rounded`}>Discover Places</Link>
          <Link to="/create" className={`transition-colors ${accentColor} ${hoverBg} px-2 py-1 rounded`}>Create Plan</Link>
          <Link to="/mytrip" className={`transition-colors ${accentColor} ${hoverBg} px-2 py-1 rounded`}>My Trips</Link>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold mb-2">Categories</h3>
          <Link to="/restaurants" className={`transition-colors ${accentColor} ${hoverBg} px-2 py-1 rounded`}>Restaurants</Link>
          <Link to="/movies" className={`transition-colors ${accentColor} ${hoverBg} px-2 py-1 rounded`}>Movies</Link>
          <Link to="/beaches" className={`transition-colors ${accentColor} ${hoverBg} px-2 py-1 rounded`}>Beaches</Link>
          <Link to="/waterfalls" className={`transition-colors ${accentColor} ${hoverBg} px-2 py-1 rounded`}>Waterfalls</Link>
          <Link to="/parks" className={`transition-colors ${accentColor} ${hoverBg} px-2 py-1 rounded`}>Parks</Link>
        </div>

        {/* Social & Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold mb-2">Connect with Us</h3>
          <div className="flex gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:text-white hover:bg-blue-600 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:text-white hover:bg-cyan-400 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:text-white hover:bg-pink-500 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:text-white hover:bg-green-500 transition"
            >
              <FaWhatsapp />
            </a>
          </div>
          <p className="text-sm">
            Email:{" "}
            <a href="mailto:support@planpal.com" className={`hover:${accentColor} transition`}>
              support@planpal.com
            </a>
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className={`border-t mt-8 pt-4 border-gray-300 dark:border-gray-700`}></div>

      {/* Bottom */}
      <div className="text-center text-sm mt-4">
        © {new Date().getFullYear()} PlanPal. All rights reserved.
      </div>
    </footer>
  );
}
