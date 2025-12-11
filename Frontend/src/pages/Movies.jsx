import React, { useState } from "react";
import Background3D from "../components/Background3D";
import { PlayCircle, Star, Clapperboard, Calendar, ArrowRight } from "lucide-react";

export default function Movies({ darkMode }) {
  const [showMovies, setShowMovies] = useState(false);

  const moviesData = [
    {
      title: "Inception",
      genre: "Sci-Fi, Thriller",
      year: 2010,
      description: "A skilled thief navigates dreams to plant ideas in people’s minds.",
      image: "https://lumiere-a.akamaihd.net/v1/images/alladin_600x450_moviespg_mobile_7_d097b99b.jpeg?region=0,0,600,450",
      rating: 4.8,
    },
    {
      title: "The Dark Knight",
      genre: "Action, Crime",
      year: 2008,
      description: "Batman faces a criminal mastermind who wants to plunge Gotham into chaos.",
      image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg",
      rating: 5.0,
    },
    {
      title: "Forrest Gump",
      genre: "Drama, Romance",
      year: 1994,
      description: "Life is like a box of chocolates for the kind-hearted Forrest.",
      image: "https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg",
      rating: 4.7,
    },
    {
      title: "The Matrix",
      genre: "Sci-Fi, Action",
      year: 1999,
      description: "A hacker discovers a shocking truth about reality and a hidden war.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-9TDmDP-XINSNtUsDq-Ban8OvSmcqvHJoFw&s",
      rating: 4.9,
    },
    {
      title: "Interstellar",
      genre: "Sci-Fi, Drama",
      year: 2014,
      description: "A man travels through space and time to save humanity.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZgarY79EPQu_BBe86NdqmVxRhgH0N6AgLEA&s",
      rating: 4.9,
    },
    {
      title: "Avengers: Endgame",
      genre: "Action, Sci-Fi",
      year: 2019,
      description: "The Avengers assemble to restore balance after Thanos’ snap.",
      image: "https://images.thedirect.com/media/article_full/avengers-multiverse-saga-phase.jpg",
      rating: 4.6,
    },
  ];

  const textColor = darkMode ? "text-white" : "text-gray-900";
  const subTextColor = darkMode ? "text-gray-300" : "text-gray-600";

  // Card styles matching Dashboard
  const cardClass = `relative group overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${darkMode ? "bg-slate-900/40 border-white/10" : "bg-white/70 border-gray-200"
    }`;

  return (
    <div className={`relative min-h-screen py-24 px-6 md:px-20 overflow-hidden ${darkMode ? "bg-slate-900" : "bg-blue-50"}`}>

      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Background3D />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 ">

        {/* Hero Section */}
        <div className="w-full md:w-1/2 space-y-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 font-bold text-sm mb-2">
            <Clapperboard size={16} /> Blockbuster Hits
          </div>

          <h1 className={`text-5xl md:text-7xl font-extrabold leading-tight ${textColor}`}>
            Cinematic <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Magic Awaits
            </span>
          </h1>

          <p className={`text-lg max-w-md ${subTextColor}`}>
            Dive into a world of storytelling. From Sci-Fi thrillers to heartwarming dramas, find your next favorite movie here.
          </p>

          <button
            onClick={() => setShowMovies(!showMovies)}
            className="px-8 py-4 rounded-xl font-bold bg-white text-black flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            {showMovies ? "Hide Library" : "Browse Movies"} <PlayCircle size={20} />
          </button>
        </div>

        {/* Hero Image */}
        <div className="w-full md:w-1/2 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group">
            <img
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop"
              alt="Cinema"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
              <p className="text-white font-bold text-xl">Now Showing: The Future of Cinema</p>
            </div>
          </div>
        </div>

      </div>

      {/* Expandable Movie Grid */}
      {showMovies && (
        <div className="relative z-10 max-w-7xl mx-auto mt-24 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-2xl font-bold ${textColor}`}>Trending Now</h3>
            <div className="h-px bg-current opacity-10 flex-grow ml-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {moviesData.map((movie, idx) => (
              <div key={idx} className={cardClass} style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-yellow-400 font-bold flex items-center gap-1">
                    <Star size={14} fill="gold" /> {movie.rating}
                  </div>
                </div>

                <div className="p-6">
                  <h4 className={`text-xl font-bold mb-1 ${textColor}`}>{movie.title}</h4>
                  <p className="text-sm text-purple-500 font-medium mb-4">{movie.genre}</p>

                  <p className={`text-sm line-clamp-2 mb-6 opacity-80 ${subTextColor}`}>
                    {movie.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`text-sm flex items-center gap-1 opacity-60 ${textColor}`}>
                      <Calendar size={14} /> {movie.year}
                    </span>
                    <button className={`text-sm font-bold flex items-center gap-1 hover:underline ${darkMode ? "text-white" : "text-black"}`}>
                      Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
