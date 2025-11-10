'use client';
import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  // Онцгой color state
  const [specialClass, setSpecialClass] = useState({
  bg: "bg-backBanner",
  text: "text-specialText"
});

  // Theme-г localStorage-с авах
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) setTheme(stored);
  }, []);

  // Theme class-ийг document-д нэмэх/устгах
  useEffect(() => {
    if(theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Theme toggle
  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  // Онцгой өнгө тохируулах function
  const setSpecialColor = ({ bgLight, bgDark, textLight, textDark }) => {
    setSpecialClass({
      bg: `${bgLight} dark:${bgDark}`,
      text: `${textLight} dark:${textDark}`
    });
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      specialClass,
      setSpecialColor
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook
export const useTheme = () => useContext(ThemeContext);
