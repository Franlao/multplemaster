"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
      title={
        theme === "light"
          ? "Mode sombre"
          : theme === "dark"
          ? "Mode système"
          : "Mode clair"
      }
    >
      {theme === "dark" ? (
        <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
      ) : (
        <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
      )}
      <span className="sr-only">Changer de thème</span>
    </Button>
  );
}
