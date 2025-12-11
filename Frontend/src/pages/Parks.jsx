import React, { useState } from "react";
import Background3D from "../components/Background3D";
import { Trees, ArrowRight, MapPin } from "lucide-react";

export default function Parks({ darkMode }) {
  const [showParks, setShowParks] = useState(false);

  const parksData = [
    {
      name: "Rajiv Gandhi Park",
      location: "Hyderabad, Telangana",
      description: "A large urban park with walking trails, lakes, and lush greenery for family outings.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPm4SkVx9f0LP0QEArMCAq6k11IA4XevkaJw&s",
    },
    {
      name: "Infantry Park",
      location: "Pune, Maharashtra",
      description: "Popular for jogging, cycling, and picnics, surrounded by fountains and sculptures.",
      image: "https://img.freepik.com/free-photo/trees-park-sunset_1160-728.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      name: "Nehru Park",
      location: "New Delhi",
      description: "A peaceful park in the heart of Delhi, hosting cultural events and morning walkers.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStXCgdJGxYA1ZEYVA5w7AEPWUuS98cijPPSw&s",
    },
    {
      name: "Lodhi Garden",
      location: "New Delhi",
      description: "Historic gardens with tombs, walking paths, and greenery, perfect for leisure and photography.",
      image: "https://www.shutterstock.com/shutterstock/videos/1079918435/thumb/1.jpg?ip=x480",
    },
    {
      name: "Eco Park",
      location: "Kolkata, West Bengal",
      description: "A large urban park with themed gardens, cycling tracks, and boating facilities.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxeSEShloszLL_OmNStPbOQEYttcrgVB3JlA&s",
    },
  ];

  const textColor = darkMode ? "text-white" : "text-gray-900";
  const subTextColor = darkMode ? "text-gray-300" : "text-gray-600";

  const cardClass = `relative group overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer ${darkMode ? "bg-slate-900/40 border-white/10 hover:bg-slate-800/60" : "bg-white/70 border-gray-200 hover:bg-white/90"
    }`;

  return (
    <div className={`relative min-h-screen py-16 px-6 md:px-20 overflow-hidden ${darkMode ? "bg-slate-900" : "bg-blue-50"}`}>

      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Background3D />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 py-12">

        {/* Hero Section */}
        <div className="w-full md:w-1/2 space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 font-bold text-sm mb-4">
            <Trees size={16} /> Urban Escapes
          </div>

          <h1 className={`text-5xl md:text-7xl font-extrabold leading-tight ${textColor}`}>
            Dive Into The <br />
            <span className="bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
              Beauty of Parks
            </span>
          </h1>

          <p className={`text-lg md:text-xl ${subTextColor} max-w-lg leading-relaxed`}>
            Lush greenery. Serene walks. Connecting with nature in the heart of the city.
          </p>

          <button
            onClick={() => setShowParks(!showParks)}
            className="px-8 py-4 rounded-xl font-bold bg-white text-black flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            {showParks ? "Hide Parks" : "Explore Parks"} <ArrowRight size={20} />
          </button>
        </div>

        {/* Hero Image */}
        <div className="w-full md:w-1/2 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/20 group">
            <img
              src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop"
              alt="Park Hero"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <p className="text-white font-bold text-xl flex items-center gap-2"><MapPin size={20} /> Nature's Embrace</p>
            </div>
          </div>
        </div>

      </div>

      {/* Expandable Grid */}
      {showParks && (
        <div className="relative z-10 max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
          {parksData.map((park, i) => (
            <div key={i} className={cardClass} style={{ animationDelay: `${i * 100}ms` }}>
              <div className="h-56 overflow-hidden">
                <img
                  src={park.image}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={park.name}
                />
              </div>

              <div className="p-6">
                <h3 className={`text-xl font-bold mb-1 ${textColor}`}>{park.name}</h3>
                <p className="text-sm text-green-500 font-medium mb-3 flex items-center gap-1">
                  <MapPin size={14} /> {park.location}
                </p>
                <p className={`text-sm leading-relaxed opacity-80 ${subTextColor}`}>
                  {park.description}
                </p>

                <button className={`mt-4 w-full py-2 rounded-lg text-sm font-bold border transition-colors ${darkMode ? "border-white/20 hover:bg-white/10" : "border-gray-200 hover:bg-gray-50"}`}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
