import { useState } from "react";
import { motion } from "framer-motion";

export default function Temples({ darkMode }) {
  const [showTemples, setShowTemples] = useState(false);

  const siteBg = darkMode ? "#0f172a" : "#e0f2fe";
  const textColor = darkMode ? "#f0f4f8" : "#1f2937";

  const templesData = [
    {
      name: "Meenakshi Amman Temple",
      location: "Madurai, Tamil Nadu",
      description:
        "A historic temple dedicated to goddess Meenakshi and Lord Sundareswarar, famous for its stunning architecture.",
      image:
        "https://www.sreestours.com/wp-content/uploads/2025/08/About-Madurai-Meenakshi-Temple-1.jpg",
    },
    {
      name: "Golden Temple",
      location: "Amritsar, Punjab",
      description:
        "The holiest Sikh shrine, known for its gold-plated exterior and serene Amrit Sarovar water tank.",
      image:
        "https://media.istockphoto.com/id/518370948/photo/golden-temple-of-amritsar-pubjab-india.jpg?s=612x612&w=0&k=20&c=i5ZvIrTw7BybA4Js0GwFlDCFgwuzw-UNAg2256-fN6A=",
    },
    {
      name: "Brihadeeswarar Temple",
      location: "Thanjavur, Tamil Nadu",
      description:
        "A UNESCO World Heritage site built during the Chola dynasty, famous for its massive vimana (tower).",
      image:
        "https://www.taleof2backpackers.com/wp-content/uploads/2017/10/Brihadeshwara-Temple-North-side.jpg",
    },
    {
      name: "Jagannath Temple",
      location: "Puri, Odisha",
      description:
        "A historic Hindu temple dedicated to Lord Jagannath, renowned for its annual Rath Yatra festival.",
      image:
        "https://www.poojn.in/wp-content/uploads/2025/03/Jagannath-Temple-Hyderabad-Your-Visit-Guide-Location-Address-Transportation.jpeg.jpg",
    },
    {
      name: "Somnath Temple",
      location: "Veraval, Gujarat",
      description:
        "One of the twelve Jyotirlinga shrines, known for its magnificent reconstruction and seaside view.",
      image:
        "https://i.pinimg.com/474x/d3/46/c6/d346c614fe60ced4facad6439d10f21c.jpg",
    },
    {
      name: "Kashi Vishwanath Temple",
      location: "Varanasi, Uttar Pradesh",
      description:
        "A sacred temple of Lord Shiva located on the banks of the Ganges, central to Hindu pilgrimage.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMpRB4Eq66_2JUG4kt0w9SVDhsRi5b41--ZA&s",
    },
  ];

  return (
    <div
      className="relative min-h-screen transition-colors duration-500 overflow-hidden"
      style={{ backgroundColor: siteBg, color: textColor }}
    >
      {/* Hero Section */}
      <div className="min-h-[70vh] px-6 md:px-20 py-16 flex flex-col md:flex-row items-center justify-between md:gap-x-16 gap-y-10">
  {/* 🖼️ IMAGE LEFT */}
  <motion.div
    className="w-full md:w-1/2 flex justify-center items-center mb-10 md:mb-0"
    initial={{ opacity: 0, x: -60 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1 }}
  >
    <img
      src="./src/assets/images/Temples.jpg"
      alt="Temple Hero"
      className="rounded-2xl shadow-2xl object-cover max-h-100 md:max-h-106 w-full"
    /> 
  </motion.div>

  {/* 📝 TEXT RIGHT */}
  <motion.div
    initial={{ opacity: 0, x: 60 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1 }}
    className="w-full md:w-1/2 space-y-6 text-center md:text-left"
  >
    <div
      className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium shadow-md ${
        darkMode
          ? "bg-gradient-to-r from-yellow-500 to-orange-400 text-black"
          : "bg-black text-white"
      }`}
    >
      🛕 Explore the World of Temples
    </div>

    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
      Dive Into The Magic Of{" "}
      <span
        className={`bg-clip-text text-transparent ${
          darkMode
            ? "bg-gradient-to-r from-yellow-400 to-orange-500"
            : "bg-gradient-to-r from-blue-500 to-purple-500"
        }`}
      >
        Temples
      </span>
    </h1>

    <p className="text-lg opacity-80 max-w-md mx-auto md:mx-0">
      Ancient marvels. Spiritual journeys. Iconic temples to explore.
    </p>

    <motion.button
      className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold shadow-lg bg-white text-black mx-auto md:mx-0"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowTemples(!showTemples)}
    >
      {showTemples ? "Hide Temples" : "Explore Temples"}
    </motion.button>
  </motion.div>
</div>


      {/* Smooth Dropdown Animation */}
      <motion.div
        initial={false}
        animate={{ height: showTemples ? "auto" : 0, opacity: showTemples ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {/* Horizontal Scrolling Temples */}
        <style>
          {`
            @keyframes scrollLeft {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes scrollRight {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
          `}
        </style>

        <div className="overflow-hidden py-12 max-w-[1600px] mx-auto space-y-12">
          {[0, 1].map((row) => (
            <div
              key={row}
              className="flex gap-6"
              style={{
                animation: `${
                  row % 2 === 0 ? "scrollLeft" : "scrollRight"
                } 40s linear infinite`,
                width: "200%",
              }}
            >
              {[...templesData, ...templesData].map((temple, i) => (
                <motion.div
                  key={i}
                  className={`flex-shrink-0 w-80 md:w-96 lg:w-[22rem] rounded-2xl shadow-2xl backdrop-blur-md border ${
                    darkMode
                      ? "bg-[#1b2430]/80 border-[#facc15]/10"
                      : "bg-white/80 border-gray-300/40"
                  } cursor-pointer transition-all hover:scale-105`}
                  whileHover={{ boxShadow: "0 0 30px rgba(255,215,0,0.5)" }}
                >
                  <img
                    src={temple.image}
                    alt={temple.name}
                    className="h-52 md:h-60 w-full object-cover rounded-t-2xl"
                  />
                  <div className="p-4 space-y-1">
                    <h2 className="font-bold text-base">{temple.name}</h2>
                    <p className="text-sm opacity-75">{temple.location}</p>
                    <p className="text-xs opacity-70 line-clamp-3">
                      {temple.description}
                    </p>
                    <button
                      className={`mt-2 w-full text-sm py-2 rounded-full font-semibold shadow-sm ${
                        darkMode
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                          : "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      }`}
                    >
                      Learn More
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
