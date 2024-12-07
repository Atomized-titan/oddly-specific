import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Copy, Heart, History } from "lucide-react";
import { useAnimation } from "../contexts/AnimationContext";
import { useComplimentSystem } from "../hooks/useComplimentSystem";
import { useState } from "react";
import HistoryPanel from "./history-panel";

const ComplimentGenerator = () => {
  const { isHeaderAnimationComplete } = useAnimation();
  const {
    compliments,
    currentIndex,
    showPanel,
    setShowPanel,
    generateNew,
    toggleFavorite,
    navigateNext,
    navigatePrevious,
    isFavorite,
    currentCompliment,
  } = useComplimentSystem();
  const [showCopied, setShowCopied] = useState(false);

  if (!isHeaderAnimationComplete) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-4xl mx-auto px-6"
      >
        <motion.div
          className="relative backdrop-blur-md bg-white/10 dark:bg-black/10 
                     rounded-[2rem] p-12 shadow-[0_8px_16px_rgba(0,0,0,0.05)] 
                     dark:shadow-[0_8px_16px_rgba(0,0,0,0.25)] 
                     border border-white/20 dark:border-white/10"
        >
          <div className="absolute top-8 left-8 flex gap-2">
            <motion.div className="text-sm font-medium text-black/40 dark:text-white/40">
              {currentCompliment?.category.toUpperCase()}
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentCompliment?.id || "empty"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-[200px] py-10 flex items-center justify-center text-center px-8"
            >
              <p className="text-5xl font-medium leading-tight">
                {currentCompliment?.text ||
                  "Click generate for an oddly specific compliment"}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-8 right-8 flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={navigatePrevious}
              disabled={currentIndex <= 0}
              className="p-2 rounded-full backdrop-blur-md bg-white/10 dark:bg-white/5 
                       disabled:opacity-30 border border-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateNew}
              className="px-6 py-2 rounded-full backdrop-blur-md bg-white/10 
                       dark:bg-white/5 font-medium border border-white/10"
            >
              Generate
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={navigateNext}
              disabled={currentIndex >= compliments.length - 1}
              className="p-2 rounded-full backdrop-blur-md bg-white/10 dark:bg-white/5 
                       disabled:opacity-30 border border-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {currentCompliment && (
            <div className="absolute top-8 right-8 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPanel(true)}
                className="p-2 rounded-full backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/10"
              >
                <History className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleFavorite(currentCompliment)}
                className="p-2 rounded-full backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/10"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite(currentCompliment.id) ? "fill-current" : ""
                  }`}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigator.clipboard.writeText(currentCompliment.text);
                  setShowCopied(true);
                  setTimeout(() => setShowCopied(false), 2000);
                }}
                className="p-2 rounded-full backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/10"
              >
                <Copy className="w-4 h-4" />
              </motion.button>
            </div>
          )}

          <AnimatePresence>
            {showCopied && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-8 right-24 px-3 py-1 rounded-full text-sm 
                         bg-black/80 text-white dark:bg-white/80 dark:text-black"
              >
                Copied!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <HistoryPanel
        show={showPanel}
        onClose={() => setShowPanel(false)}
        compliments={compliments}
        currentCompliment={currentCompliment}
        onToggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
      />
    </>
  );
};

export default ComplimentGenerator;
