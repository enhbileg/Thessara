'use client';
import { Outfit } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { AppContextProvider, useAppContext } from "@/context/AppContext";
import { ThemeProvider } from "@/context/appTheme";
import AdminNavbar from "@/components/seller/Navbar";
import AdminSidebar from "@/components/seller/Sidebar";
import { getDictionary } from "@/app/[lang]/dictionaries.js";
import { useEffect, useState } from "react";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

function LayoutContent({ children }) {
  const { language } = useAppContext();
  const [dict, setDict] = useState({});

  useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);

  return (
    <div className={`${outfit.className} antialiased min-h-screen flex flex-col`}>
      <Toaster position="top-right" />
      <ThemeProvider>
        {/* ==== Top Navbar ==== */}
        <AdminNavbar dict={dict} />

        {/* ==== Sidebar + Main Content ==== */}
        <div className="flex flex-1">
          <AdminSidebar dict={dict} />
          <main className="flex-1 p-6 overflow-y-auto bg-blank text-navbar transition-colors duration-300">
            {children}
          </main>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <ClerkProvider>
      <AppContextProvider>
        <LayoutContent>{children}</LayoutContent>
      </AppContextProvider>
    </ClerkProvider>
  );
}
