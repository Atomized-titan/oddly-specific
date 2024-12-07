// hooks/useFavorites.ts
import { useState, useEffect } from "react";

export type ComplimentType = {
  id: string;
  text: string;
  category: string;
  timestamp: Date;
  isFavorite?: boolean;
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<ComplimentType[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const toggleFavorite = (compliment: ComplimentType) => {
    const exists = favorites.some((f) => f.id === compliment.id);
    let newFavorites;

    if (exists) {
      newFavorites = favorites.filter((f) => f.id === compliment.id);
    } else {
      newFavorites = [...favorites, compliment];
    }

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    return !exists;
  };

  const isFavorite = (id: string) => favorites.some((f) => f.id === id);

  return { favorites, toggleFavorite, isFavorite };
};
