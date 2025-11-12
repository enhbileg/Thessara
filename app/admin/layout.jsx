'use client'
import { Outfit } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { AppContextProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/appTheme";
import AdminNavbar from "@/components/seller/Navbar";
import AdminSidebar from "@/components/seller/Sidebar";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

export default function AdminLayout({ children }) {
  return (
    <ClerkProvider>
      <div className={`${outfit.className} antialiased min-h-screen flex flex-col`}>
        <Toaster position="top-right" />
        <AppContextProvider>
          <ThemeProvider>
            {/* ==== Top Navbar ==== */}
            <AdminNavbar />

            {/* ==== Sidebar + Main Content ==== */}
            <div className="flex flex-1">
              <AdminSidebar />

              <main className="flex-1 p-6 overflow-y-auto bg-blank text-navbar transition-colors duration-300">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </AppContextProvider>
      </div>
    </ClerkProvider>
  );
}
