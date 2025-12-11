import React from 'react';
import { motion } from 'framer-motion';

const Background3D = ({ darkMode }) => {
    return (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-br from-indigo-100/50 via-white/50 to-purple-100/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors duration-500">

            {/* Animated Blob 1 */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-30 ${darkMode ? 'bg-purple-900' : 'bg-purple-300'}`}
            />

            {/* Animated Blob 2 */}
            <motion.div
                animate={{
                    x: [0, -70, 0],
                    y: [0, 80, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className={`absolute bottom-[-100px] left-[-100px] w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 ${darkMode ? 'bg-blue-900' : 'bg-blue-300'}`}
            />

            {/* Animated Blob 3 */}
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5
                }}
                className={`absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full blur-[90px] opacity-20 ${darkMode ? 'bg-pink-900' : 'bg-pink-300'}`}
            />
        </div>
    );
};

export default Background3D;
