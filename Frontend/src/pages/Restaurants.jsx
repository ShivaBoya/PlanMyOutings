// RestaurantsPreview.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Background3D from "../components/Background3D";
import { Star, MapPin, Clock, ArrowRight, Utensils } from "lucide-react";

const restaurantsList = [
  {
    name: "The Spice Villa",
    cuisine: "Indian",
    rating: 4.5,
    location: "MG Road",
    timing: "11 AM - 11 PM",
    description: "Authentic Indian flavors with a modern twist.",
    color: "bg-orange-500",
  },
  {
    name: "Ocean's Delight",
    cuisine: "Seafood",
    rating: 4.7,
    location: "Marine Drive",
    timing: "12 PM - 10 PM",
    description: "Fresh seafood dishes with cozy ambiance.",
    color: "bg-blue-500",
  },
  {
    name: "Pasta Paradise",
    cuisine: "Italian",
    rating: 4.6,
    location: "City Center Mall",
    timing: "11 AM - 10 PM",
    description: "Delicious pasta and Italian specialties.",
    color: "bg-green-500",
  },
  {
    name: "Sushi World",
    cuisine: "Japanese",
    rating: 4.8,
    location: "Phoenix Market",
    timing: "1 PM - 11 PM",
    description: "Top-quality sushi and Japanese cuisine.",
    color: "bg-red-500",
  },
  {
    name: "Burger Haven",
    cuisine: "Fast Food",
    rating: 4.4,
    location: "Main Street",
    timing: "10 AM - 1 AM",
    description: "Juicy burgers with fresh ingredients.",
    color: "bg-yellow-500",
  },
];

export default function RestaurantsPreview({ darkMode }) {
  const navigate = useNavigate();

  const textColor = darkMode ? "text-white" : "text-gray-900";
  const subTextColor = darkMode ? "text-gray-300" : "text-gray-600";

  // Card styles matching Dashboard
  const cardClass = `relative group overflow-hidden rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${darkMode ? "bg-slate-900/40 border-white/10 hover:bg-slate-800/60" : "bg-white/70 border-gray-200 hover:bg-white/90"
    }`;

  return (
    <div className={`relative min-h-screen py-24 px-6 md:px-20 overflow-hidden ${darkMode ? "bg-slate-900" : "bg-blue-50"}`}>

      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Background3D />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">

        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 font-bold text-sm mb-4">
            <Utensils size={16} /> Culinary Adventures
          </div>
          <h1 className={`text-4xl md:text-6xl font-extrabold mb-6 ${textColor}`}>
            Top Places to <br />
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Feast Nearby
            </span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${subTextColor}`}>
            Discover the best rated restaurants around you, curated for every taste and mood.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {restaurantsList.map((rest, idx) => (
            <div key={idx} className={cardClass}>
              {/* Color Accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 transition-opacity group-hover:opacity-40 ${rest.color}`}></div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-xl font-bold ${textColor}`}>{rest.name}</h3>
                  <p className="text-sm font-medium text-blue-500 flex items-center gap-1 mt-1">
                    {rest.cuisine}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-lg">
                  <Star size={14} className="fill-yellow-500 text-yellow-500" />
                  <span className={`text-sm font-bold ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                    {rest.rating}
                  </span>
                </div>
              </div>

              <p className={`text-sm italic mb-6 leading-relaxed ${subTextColor}`}>"{rest.description}"</p>

              <div className="space-y-3 text-sm opacity-80 mb-6">
                <div className={`flex items-center gap-3 ${subTextColor}`}>
                  <MapPin size={16} /> {rest.location}
                </div>
                <div className={`flex items-center gap-3 ${subTextColor}`}>
                  <Clock size={16} /> {rest.timing}
                </div>
              </div>

              <button className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Reserve Table
              </button>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="mt-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <button
            onClick={() => navigate("/all-restaurants")}
            className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 border-2 transition-all hover:px-10 ${darkMode
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
          >
            Explore All Restaurants <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
