// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import AnimatedHeader from "../components/animated-header";

export default function Home() {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50/30 via-purple-50/30 to-fuchsia-50/30 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-fuchsia-950/30 transition-colors duration-500">
      <AnimatedHeader />
      {/* Main content will go here */}
    </main>
  );
}
