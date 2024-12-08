import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Tooltip from "./tooltip";

interface ActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  count?: number;
}

export const ActionButton = ({
  icon: Icon,
  onClick,
  tooltip,
  disabled,
  isLoading,
  className = "",
  count,
}: ActionButtonProps) => (
  <Tooltip content={tooltip}>
    <div className={`flex items-center ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`p-2 rounded-full backdrop-blur-md bg-white/10 dark:bg-white/5 
                   border border-white/10 disabled:opacity-30 flex items-center`}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Icon className="w-4 h-4" />
          </motion.div>
        ) : (
          <Icon className="w-4 h-4" />
        )}

        {count !== undefined && count !== 0 ? (
          <span className="ml-2 text-sm leading-[6px] mr-[0.5] text-gray-700 dark:text-gray-300">
            {count}
          </span>
        ) : null}
      </motion.button>
    </div>
  </Tooltip>
);
