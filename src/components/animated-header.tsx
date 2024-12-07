import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import { useAnimation } from "../contexts/AnimationContext";

const AnimatedHeader = () => {
  const [isCentered, setIsCentered] = useState(true);
  const { setHeaderAnimationComplete } = useAnimation();

  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsCentered(false);
      // Add a small delay to ensure the header animation is complete
      setTimeout(() => {
        setHeaderAnimationComplete(true);
      }, 1000); // Adjust this timing based on your header animation duration
    }, 800);
    return () => clearTimeout(timer);
  }, [setHeaderAnimationComplete]);

  return (
    <motion.div
      layout
      className={`fixed left-0 right-0 z-50 p-6 ${
        isCentered ? "top-1/2 -translate-y-1/2" : "top-0"
      }`}
      transition={{
        type: "spring",
        bounce: 0.2,
        duration: 0.8,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <motion.h1
            layout
            className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 whitespace-nowrap ${
              isCentered ? "text-7xl" : "text-2xl"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              opacity: { duration: 0.2 },
            }}
          >
            Oddly Specific
          </motion.h1>

          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: isCentered ? 0 : 1, scale: isCentered ? 0 : 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full backdrop-blur-sm bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedHeader;
