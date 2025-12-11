import React, { useState } from "react";
import Background3D from "../components/Background3D";
import { Palmtree, ArrowRight, MapPin } from "lucide-react";

export default function Beaches({ darkMode }) {
  const [showBeaches, setShowBeaches] = useState(false);

  const beachesData = [
    {
      name: "Bora Bora",
      location: "French Polynesia",
      description: "A tropical paradise known for crystal-clear waters and overwater bungalows.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZkD3jT3_PW53sYv67hW5s5MwE9E9NXCQeQg&s",
    },
    {
      name: "Copacabana Beach",
      location: "Rio de Janeiro, Brazil",
      description: "Famous for its vibrant atmosphere, beach sports, and iconic promenade.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnHg_fePRIHD44J2aO_g0NDUPEoMGpieML6g&s",
    },
    {
      name: "Bondi Beach",
      location: "Sydney, Australia",
      description: "Known for surfing, golden sands, and a lively coastal culture.",
      image: "https://assets.gqindia.com/photos/68c3cfa37a36df0543936440/16:9/w_2560%2Cc_limit/World's-most-beautiful-beaches.jpg",
    },
    {
      name: "Whitehaven Beach",
      location: "Whitsunday Island, Australia",
      description: "Renowned for its pristine white silica sands and turquoise waters.",
      image: "https://media.cntravellerme.com/photos/681878ff03a6976360d7a981/16:9/w_2560%2Cc_limit/1210194915",
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 font-bold text-sm mb-4">
            <Palmtree size={16} /> Tropical Escapes
          </div>

          <h1 className={`text-5xl md:text-7xl font-extrabold leading-tight ${textColor}`}>
            Discover The <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Magic of Beaches
            </span>
          </h1>

          <p className={`text-lg md:text-xl ${subTextColor} max-w-lg leading-relaxed`}>
            White sands. Turquoise waters. Infinite horizons. Find your perfect spot to unwind and soak up the sun.
          </p>

          <button
            onClick={() => setShowBeaches(!showBeaches)}
            className="px-8 py-4 rounded-xl font-bold bg-white text-black flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            {showBeaches ? "Hide Beaches" : "Explore Beaches"} <ArrowRight size={20} />
          </button>
        </div>

        {/* Hero Image */}
        <div className="w-full md:w-1/2 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/20 group">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
              alt="Beach Hero"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <p className="text-white font-bold text-xl flex items-center gap-2"><MapPin size={20} /> Paradise Found</p>
            </div>
          </div>
        </div>

      </div>

      {/* Expandable Grid */}
      {showBeaches && (
        <div className="relative z-10 max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
          {beachesData.map((beach, i) => (
            <div key={i} className={cardClass} style={{ animationDelay: `${i * 100}ms` }}>
              <div className="h-56 overflow-hidden">
                <img
                  src={beach.image}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={beach.name}
                />
              </div>

              <div className="p-6">
                <h3 className={`text-xl font-bold mb-1 ${textColor}`}>{beach.name}</h3>
                <p className="text-sm text-cyan-500 font-medium mb-3 flex items-center gap-1">
                  <MapPin size={14} /> {beach.location}
                </p>
                <p className={`text-sm leading-relaxed opacity-80 ${subTextColor}`}>
                  {beach.description}
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
