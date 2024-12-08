// components/footer.tsx
import { motion } from "framer-motion";
import { Github, Linkedin, ExternalLink } from "lucide-react";
import Tooltip from "./tooltip";
import { GITHUB_URL, LINKEDIN_URL } from "../lib/content/social";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 
                backdrop-blur-md bg-white/20 dark:bg-black/10 
                border border-black/[0.06] dark:border-white/10
                px-3 sm:px-6 py-2 sm:py-3 rounded-full
                flex items-center gap-2 sm:gap-4
                max-w-[90vw] sm:max-w-none overflow-hidden"
    >
      <div className="hidden sm:block">
        <Tooltip content="GitHub" position="top">
          <a href={GITHUB_URL}>
            <Github className="w-4 h-4" />
          </a>
        </Tooltip>
      </div>

      <div className="hidden sm:block h-4 w-px bg-black/[0.06] dark:bg-white/10" />

      <p className="text-xs sm:text-sm text-gray-600/90 dark:text-white/40 text-center whitespace-nowrap">
        Created by{" "}
        <a
          href={LINKEDIN_URL}
          className="text-white dark:text-white hover:text-purple-600 
                   dark:hover:text-purple-400 transition-colors duration-200
                   inline-flex items-center gap-1"
        >
          Pushpal Ghoshal
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      </p>

      <div className="hidden sm:block h-4 w-px bg-black/[0.06] dark:bg-white/10" />

      <div className="hidden sm:block">
        <Tooltip content="LinkedIn" position="top">
          <a href={LINKEDIN_URL}>
            <Linkedin className="w-4 h-4" />
          </a>
        </Tooltip>
      </div>
    </motion.footer>
  );
};

export default Footer;
