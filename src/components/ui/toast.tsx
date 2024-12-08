// components/ui/toast.tsx
import { motion } from "framer-motion";

export function Toast({
  message,
  type = "error",
}: {
  message: string;
  type?: "error" | "success";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full 
        ${type === "error" ? "bg-red-500" : "bg-green-500"} text-white`}
    >
      {message}
    </motion.div>
  );
}
