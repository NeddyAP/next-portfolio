"use client";
import { useTheme } from "next-themes";

const SpaceBackground = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 z-[-2]">
      {/* Stars - only visible in dark mode */}
      {isDark && (
        <>
          <div className="stars-small w-full h-full absolute" />
          <div className="stars-medium w-full h-full absolute" />
          <div className="stars-large w-full h-full absolute" />
        </>
      )}
      
      {/* Theme-aware background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.05] via-transparent to-pink-500/[0.05] dark:from-purple-500/10 dark:to-pink-500/10 animate-nebula" />
      
      {/* Theme-aware planet */}
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-700/20 dark:from-indigo-500/30 dark:to-purple-700/30 blur-3xl" />
      
      {/* Theme-aware aurora */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-teal-500/[0.05] via-transparent to-transparent dark:from-teal-500/10 animate-aurora" />
      
      {/* Light theme specific background */}
      <div className="absolute inset-0 bg-white/40 dark:bg-transparent" />
    </div>
  );
};

export default SpaceBackground;
