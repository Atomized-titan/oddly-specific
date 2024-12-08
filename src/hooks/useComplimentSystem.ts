// hooks/useComplimentSystem.ts
import { useState, useEffect } from "react";
import { ComplimentType } from "../lib/content/compliments";

const MAX_HISTORY = 50;

export const useComplimentSystem = () => {
  const [compliments, setCompliments] = useState<ComplimentType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [favorites, setFavorites] = useState<ComplimentType[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved favorites and fetch compliments on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("complimentFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Load last viewed compliments from localStorage
    const savedCompliments = localStorage.getItem("complimentHistory");
    if (savedCompliments) {
      const parsed = JSON.parse(savedCompliments);
      setCompliments(parsed);
      setCurrentIndex(parsed.length - 1);
    }

    setLoading(false);
  }, []);

  // Save favorites when they change
  useEffect(() => {
    localStorage.setItem("complimentFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save viewed compliments history
  useEffect(() => {
    localStorage.setItem("complimentHistory", JSON.stringify(compliments));
  }, [compliments]);

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
      } else if (e.code === "KeyF") {
        toggleFavorite(compliments[currentIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, compliments.length]);

  const generateNew = async () => {
    try {
      // Fetch a random compliment from the database
      const response = await fetch("/api/compliments/random");
      if (!response.ok) throw new Error("Failed to fetch compliment");

      const newCompliment = await response.json();

      // Ensure no repeat within last 10 compliments
      const recentCompliments = compliments.slice(-10);
      while (recentCompliments.some((c) => c.text === newCompliment.text)) {
        const retryResponse = await fetch("/api/compliments/random");
        const retryCompliment = await retryResponse.json();
        newCompliment.text = retryCompliment.text;
      }

      setCompliments((prev) => {
        const updated = [...prev, newCompliment];
        return updated.slice(-MAX_HISTORY);
      });
      setCurrentIndex(compliments.length);
    } catch (error) {
      console.error("Failed to generate new compliment:", error);
    }
  };

  const toggleFavorite = async (compliment: ComplimentType) => {
    try {
      const isFav = isFavorite(compliment.id);

      // Optimistically update the UI
      setFavorites((prev) => {
        if (isFav) {
          return prev.filter((f) => f.id !== compliment.id);
        }
        return [...prev, compliment];
      });

      // Make the API call
      const response = await fetch(`/api/compliments/${compliment.id}/vote`, {
        method: "POST",
      });

      if (!response.ok) {
        // Revert on error
        setFavorites((prev) => {
          if (isFav) {
            return [...prev, compliment];
          }
          return prev.filter((f) => f.id !== compliment.id);
        });
        throw new Error("Failed to toggle favorite");
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
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
    loading,
  };
};
