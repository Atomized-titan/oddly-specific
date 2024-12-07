"use client";

import { useEffect, useState } from "react";
import AnimatedHeader from "../components/animated-header";
import ComplimentGenerator from "../components/compliment-generator";
import { AnimationProvider } from "../contexts/AnimationContext";
import Footer from "../components/footer";

export default function Home() {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimationProvider>
      <main className="min-h-screen bg-gradient-to-br from-violet-50/30 via-purple-50/30 to-fuchsia-50/30 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-fuchsia-950/30 transition-colors duration-500">
        <AnimatedHeader />
        <div className="pt-52 pb-24">
          <ComplimentGenerator />
        </div>
        <Footer />
      </main>
    </AnimationProvider>
  );
}
