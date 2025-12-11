import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Waterfalls = ({ darkMode }) => {
  const siteBg = darkMode ? "#0f172a" : "#e0f2fe";
  const textColor = darkMode ? "#f0f4f8" : "#1f2937";

  const waterfallsData = [
    {
      name: "Jog Falls",
      location: "Karnataka",
      description:
        "One of the highest waterfalls in India, Jog Falls is a majestic plunge into a deep gorge surrounded by lush greenery.",
      image:
        "https://i.pinimg.com/videos/thumbnails/originals/d0/0e/7a/d00e7a1d4bc84f4a58d6db7584ba4991.0000000.jpg",
    },
    {
      name: "Athirappilly Falls",
      location: "Kerala",
      description:
        "Known as the 'Niagara of India', this waterfall is famous for its scenic beauty and dense surrounding forests.",
      image:
        "https://images.unsplash.com/photo-1523224949444-170258978eef?ixlib=rb-4.1.0&fm=jpg&q=60&w=3000",
    },
    {
      name: "Dudhsagar Falls",
      location: "Goa",
      description:
        "A four-tiered waterfall located on the Mandovi River, famous for its milky appearance and trekking routes.",
      image:
        "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2017/04/featuredwaterfalls.jpg",
    },
    {
      name: "Nohkalikai Falls",
      location: "Meghalaya",
      description:
        "The tallest plunge waterfall in India, surrounded by lush forests and a deep plunge pool.",
      image:
        "https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2023/03/waterfalls-1679730507.jpg",
    },
  ];

  const [showWaterfalls, setShowWaterfalls] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors duration-500 overflow-hidden"
      style={{ backgroundColor: siteBg, color: textColor }}
    >
      {/* Hero Section */}
      <div className="min-h-[70vh] px-6 md:px-20 py-16 flex flex-col md:flex-row items-center justify-between md:gap-x-16 gap-y-10">
        {/* IMAGE LEFT */}
        <motion.div
          className="w-full md:w-1/2 flex justify-center items-center"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src="./src/assets/images/waterfals.jpg"
            alt="Waterfall Hero"
            className="rounded-2xl shadow-2xl object-cover max-h-100 md:max-h-106 w-full"
          />
        </motion.div>

        {/* TEXT RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 space-y-6 text-center md:text-left"
        >
          <div
            className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium shadow-md ${
              darkMode
                ? "bg-gradient-to-r from-blue-400 to-purple-500 text-black"
                : "bg-black text-white"
            }`}
          >
            🌊 Explore the World of Waterfalls
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Dive Into The Beauty Of{" "}
            <span
              className={`bg-clip-text text-transparent ${
                darkMode
                  ? "bg-gradient-to-r from-blue-400 to-purple-500"
                  : "bg-gradient-to-r from-purple-500 to-blue-500"
              }`}
            >
              Waterfalls
            </span>
          </h1>

          <p className="text-lg opacity-80 max-w-md mx-auto md:mx-0">
            Majestic cascades. Pristine nature. Unforgettable scenic experiences.
          </p>

          <motion.button
            className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold shadow-lg bg-white text-black mx-auto md:mx-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowWaterfalls(!showWaterfalls)}
          >
            {showWaterfalls ? "Hide Waterfalls" : "Explore Waterfalls"}
          </motion.button>
        </motion.div>
      </div>

      {/* Dropdown List */}
      <AnimatePresence>
        {showWaterfalls && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6 }}
            className="px-6 md:px-20 pb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {waterfallsData.map((fall, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`rounded-2xl shadow-2xl overflow-hidden border ${
                  darkMode
                    ? "bg-[#1b2430]/80 border-[#facc15]/10"
                    : "bg-white/80 border-gray-300/40"
                }`}
              >
                <img
                  src={fall.image}
                  alt={fall.name}
                  className="h-52 w-full object-cover"
                />
                <div className="p-4 space-y-2">
                  <h2 className="font-bold text-lg">{fall.name}</h2>
                  <p className="text-sm opacity-75">{fall.location}</p>
                  <p className="text-xs opacity-70">{fall.description}</p>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Waterfalls;
