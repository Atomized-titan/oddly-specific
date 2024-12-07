import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, History, Clock } from "lucide-react";
import { ComplimentType } from "../lib/content/compliments";
import { useState } from "react";

interface HistoryPanelProps {
  show: boolean;
  onClose: () => void;
  compliments: ComplimentType[];
  onToggleFavorite: (compliment: ComplimentType) => void;
  isFavorite: (id: string) => boolean;
  currentCompliment: ComplimentType | null;
}

const HistoryPanel = ({
  show,
  onClose,
  compliments,
  currentCompliment,
  onToggleFavorite,
  isFavorite,
}: HistoryPanelProps) => {
  const [showFavorites, setShowFavorites] = useState(false);

  const displayedCompliments = showFavorites
    ? compliments.filter((c) => isFavorite(c.id))
    : compliments;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="fixed right-0 top-0 bottom-0 w-96 bg-white/10 dark:bg-black/10 
                   backdrop-blur-lg border-l border-white/20 dark:border-white/10 
                   shadow-lg z-50"
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Collection</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-black/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setShowFavorites(false)}
                className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2
                          ${
                            !showFavorites
                              ? "bg-white/20 dark:bg-white/10 border-white/20"
                              : "bg-white/5 dark:bg-white/5 border-white/10"
                          } 
                          border transition-colors`}
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </button>
              <button
                onClick={() => setShowFavorites(true)}
                className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2
                          ${
                            showFavorites
                              ? "bg-white/20 dark:bg-white/10 border-white/20"
                              : "bg-white/5 dark:bg-white/5 border-white/10"
                          } 
                          border transition-colors`}
              >
                <Heart className="w-4 h-4" />
                <span>Favorites</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {displayedCompliments.map((compliment) => (
                <motion.div
                  key={compliment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl bg-white/5 dark:bg-black/20 
                           border border-white/10 relative group
                           ${
                             currentCompliment?.id === compliment.id
                               ? "ring-2 ring-purple-500/50"
                               : ""
                           }`}
                >
                  <p className="text-sm">{compliment.text}</p>
                  <div
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                                transition-opacity flex gap-2"
                  >
                    <button
                      onClick={() => onToggleFavorite(compliment)}
                      className="p-1.5 rounded-full bg-white/10 dark:bg-black/20"
                    >
                      <Heart
                        className={`w-3 h-3 ${
                          isFavorite(compliment.id) ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-black/40 dark:text-white/40">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(compliment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}

              {displayedCompliments.length === 0 && (
                <div className="text-center text-black/40 dark:text-white/40 py-8">
                  {showFavorites
                    ? "No favorite compliments yet"
                    : "No compliments in history"}
                </div>
              )}
            </div>

            <div className="mt-4 text-sm text-center text-black/40 dark:text-white/40">
              Press H to toggle this panel
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HistoryPanel;
