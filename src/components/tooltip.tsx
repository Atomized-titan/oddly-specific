/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/tooltip.tsx
import { motion, AnimatePresence } from "framer-motion";
import { JSX, ReactNode, useState } from "react";

type Position = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: ReactNode;
  position?: Position;
  children: JSX.Element;
  delay?: number;
}

const positionStyles: Record<Position, string> = {
  top: "bottom-full -translate-x-1/2 mb-2",
  bottom: "top-full -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const animations: Record<Position, { initial: any; animate: any; exit: any }> =
  {
    top: {
      initial: { opacity: 0, y: 5 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 5 },
    },
    bottom: {
      initial: { opacity: 0, y: -5 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -5 },
    },
    left: {
      initial: { opacity: 0, x: 5 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 5 },
    },
    right: {
      initial: { opacity: 0, x: -5 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -5 },
    },
  };

export const Tooltip = ({
  content,
  position = "top",
  children,
  delay = 200,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  let timeout: NodeJS.Timeout;

  const showTip = () => {
    timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTip = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      onFocus={showTip}
      onBlur={hideTip}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute ${positionStyles[position]} z-50 px-2 py-1 text-xs
                       whitespace-nowrap rounded-md pointer-events-none
                       dark:bg-black/80 dark:text-white bg-white/80 text-black
                       backdrop-blur-sm`}
            initial={animations[position].initial}
            animate={animations[position].animate}
            exit={animations[position].exit}
            transition={{ duration: 0.15 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
