import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Heart,
  History,
} from "lucide-react";
import { useState } from "react";
import { useAnimation } from "../contexts/AnimationContext";
import { useComplimentSystem } from "../hooks/useComplimentSystem";
import { generateComplimentImage } from "../utils/generateImage";

import HistoryPanel from "./history-panel";
import { ActionButton } from "./action-button";

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
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageGeneration = async () => {
    if (!currentCompliment || isGenerating) return;
    try {
      setIsGenerating(true);
      const imageUrl = await generateComplimentImage(
        currentCompliment.text,
        currentCompliment.category
      );
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `oddly-specific-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!currentCompliment) return;
    navigator.clipboard.writeText(currentCompliment.text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  if (!isHeaderAnimationComplete) return null;

  const mainControls = [
    {
      icon: ChevronLeft,
      onClick: navigatePrevious,
      tooltip: "Previous compliment (arrow left)",
      disabled: currentIndex <= 0,
    },
    {
      icon: ChevronRight,
      onClick: navigateNext,
      tooltip: "Next compliment (arrow right)",
      disabled: currentIndex >= compliments.length - 1,
    },
  ];

  const actionControls = currentCompliment && [
    {
      icon: Download,
      onClick: handleImageGeneration,
      tooltip: "Save as image",
      isLoading: isGenerating,
    },
    {
      icon: History,
      onClick: () => setShowPanel(true),
      tooltip: "View history (H)",
    },
    {
      icon: Heart,
      onClick: () => toggleFavorite(currentCompliment),
      tooltip: "Toggle favorite (F)",
      className: isFavorite(currentCompliment.id) ? "fill-current" : "",
    },
    {
      icon: Copy,
      onClick: handleCopy,
      tooltip: "Copy compliment",
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-4xl mx-auto px-4 sm:px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-6 text-gray-300/90 dark:text-white/60 font-medium text-base sm:text-lg"
        >
          Because generic compliments are boring
        </motion.p>

        <motion.div
          className="relative backdrop-blur-md bg-white/10 dark:bg-black/10 
                              rounded-2xl sm:rounded-[2rem] p-6 sm:p-12 
                              shadow-[0_8px_16px_rgba(0,0,0,0.05)] 
                              dark:shadow-[0_8px_16px_rgba(0,0,0,0.25)] 
                              border border-white/20 dark:border-white/10"
        >
          {/* Category Label */}
          <div className="absolute top-4 sm:top-8 left-4 sm:left-8">
            <span className="text-sm font-medium text-white dark:text-white/40">
              {currentCompliment?.category.toUpperCase()}
            </span>
          </div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCompliment?.id || "empty"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-[150px] sm:min-h-[200px] py-16 sm:py-12 flex items-center justify-center text-center px-4 sm:px-8"
            >
              <p className="text-xl sm:text-2xl md:text-5xl font-medium leading-tight">
                {currentCompliment?.text || (
                  <span>
                    Press <span className="text-violet-400">space</span> to
                    generate a new compliment or{" "}
                    <span className="text-violet-400">arrow keys</span> to
                    navigate
                  </span>
                )}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 flex items-center gap-2 sm:gap-4">
            {mainControls.map((control, index) => (
              <ActionButton key={index} {...control} />
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateNew}
              className="px-4 sm:px-6 py-2 rounded-full backdrop-blur-md 
                       bg-white/10 dark:bg-white/5 font-medium border border-white/10"
            >
              Generate
            </motion.button>
          </div>

          {/* Action Controls */}
          {actionControls && (
            <div className="absolute top-4 sm:top-8 right-4 sm:right-8 flex gap-2">
              {actionControls.map((control, index) => (
                <ActionButton key={index} {...control} />
              ))}
            </div>
          )}

          {/* Copied Notification */}
          <AnimatePresence>
            {showCopied && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-4 sm:top-8 right-4 sm:right-8 translate-x-full pl-4
                         px-3 py-1 rounded-full text-sm 
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
