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
      className="fixed bottom-6 left-1/2 -translate-x-1/2 
                backdrop-blur-md bg-white/20 dark:bg-black/10 
                border border-black/[0.06] dark:border-white/10
                px-6 py-3 rounded-full
                flex items-center gap-4"
    >
      <Tooltip content="GitHub" position="top">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-white/10
                   transition-colors duration-200"
        >
          <button type="button">
            <Github className="w-4 h-4" />
          </button>
        </a>
      </Tooltip>

      <div className="h-4 w-px bg-black/[0.06] dark:bg-white/10" />

      <p className="text-sm text-gray-600/90 dark:text-white/40 text-center">
        <span>Created by </span>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 dark:text-white hover:text-purple-600 
                   dark:hover:text-purple-400 transition-colors duration-200
                   inline-flex items-center gap-1"
        >
          Pushpal Ghoshal
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      </p>

      <div className="h-4 w-px bg-black/[0.06] dark:bg-white/10" />

      <Tooltip content="LinkedIn" position="top">
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-white/10
                   transition-colors duration-200"
        >
          <button type="button">
            <Linkedin className="w-4 h-4" />
          </button>
        </a>
      </Tooltip>
    </motion.footer>
  );
};

export default Footer;
