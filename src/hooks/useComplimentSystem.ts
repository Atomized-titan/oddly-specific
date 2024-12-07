// hooks/useComplimentSystem.ts
import { useState, useEffect } from "react";
import { ComplimentType, generateCompliment } from "../lib/content/compliments";

const MAX_HISTORY = 50; // Maximum number of compliments to store

export const useComplimentSystem = () => {
  const [compliments, setCompliments] = useState<ComplimentType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [favorites, setFavorites] = useState<ComplimentType[]>([]);

  // Load saved data on mount
  useEffect(() => {
    const savedCompliments = localStorage.getItem("complimentHistory");
    const savedFavorites = localStorage.getItem("complimentFavorites");

    if (savedCompliments) {
      const parsed = JSON.parse(savedCompliments);
      setCompliments(parsed);
      setCurrentIndex(parsed.length - 1);
    }

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    localStorage.setItem("complimentHistory", JSON.stringify(compliments));
  }, [compliments]);

  useEffect(() => {
    localStorage.setItem("complimentFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        generateNew();
      } else if (e.code === "ArrowLeft") {
        navigatePrevious();
      } else if (e.code === "ArrowRight") {
        navigateNext();
      } else if (e.code === "KeyH") {
        setShowPanel((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, compliments.length]);

  const generateNew = () => {
    const newCompliment = generateCompliment();

    // Ensure no repeat within last 10 compliments
    const recentCompliments = compliments.slice(-10);
    while (recentCompliments.some((c) => c.text === newCompliment.text)) {
      newCompliment.text = generateCompliment().text;
    }

    setCompliments((prev) => {
      const updated = [...prev, newCompliment];
      // Keep history within limit
      return updated.slice(-MAX_HISTORY);
    });
    setCurrentIndex(compliments.length);
  };

  const toggleFavorite = (compliment: ComplimentType) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === compliment.id);
      if (exists) {
        return prev.filter((f) => f.id !== compliment.id);
      }
      return [...prev, compliment];
    });
  };

  const navigateNext = () => {
    if (currentIndex < compliments.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const navigatePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const isFavorite = (id: string) => favorites.some((f) => f.id === id);

  return {
    compliments,
    currentIndex,
    showPanel,
    favorites,
    setShowPanel,
    generateNew,
    toggleFavorite,
    navigateNext,
    navigatePrevious,
    isFavorite,
    currentCompliment: compliments[currentIndex],
  };
};
