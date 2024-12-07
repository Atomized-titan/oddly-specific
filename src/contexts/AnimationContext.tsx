import React, { createContext, useContext, useState } from "react";

type AnimationContextType = {
  isHeaderAnimationComplete: boolean;
  setHeaderAnimationComplete: (complete: boolean) => void;
};

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined
);

export const AnimationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isHeaderAnimationComplete, setHeaderAnimationComplete] =
    useState(false);

  return (
    <AnimationContext.Provider
      value={{ isHeaderAnimationComplete, setHeaderAnimationComplete }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
};
