// hooks/useComplimentSystem.ts
import { useState, useEffect } from "react";
import { ComplimentType } from "../lib/content/compliments";

const MAX_HISTORY = 50;

export const useComplimentSystem = () => {
  const [compliments, setCompliments] = useState<ComplimentType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load saved favorites and fetch compliments on mount
  useEffect(() => {
    // Load last viewed compliments from localStorage
    const savedCompliments = localStorage.getItem("complimentHistory");
    if (savedCompliments) {
      const parsed = JSON.parse(savedCompliments);
      setCompliments(parsed);
      setCurrentIndex(parsed.length - 1);
    }

    setLoading(false);
  }, []);

  // Save viewed compliments history
  useEffect(() => {
    localStorage.setItem("complimentHistory", JSON.stringify(compliments));
  }, [compliments]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        if (!isGenerating) {
          // Add this check
          generateNew();
        }
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
  }, [currentIndex, compliments.length, isGenerating]);

  const generateNew = async () => {
    if (isGenerating) return;
    try {
      setIsGenerating(true);
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
    } finally {
      setIsGenerating(false);
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

  return {
    compliments,
    currentIndex,
    showPanel,
    setShowPanel,
    generateNew,
    navigateNext,
    navigatePrevious,
    currentCompliment: compliments[currentIndex],
    loading,
    isGenerating,
  };
};
