import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { AppContextProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/appTheme";
import { Outfit } from "next/font/google";
import "./[lang]/globals.css";
import { getDictionary } from "./[lang]/dictionaries";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export default async function RootLayout({ children, params }) {
    const { lang } = params;
    
    const dict = await getDictionary(lang);
  return (
    <ClerkProvider>
      <html lang={lang || "en"}>
        <body className={`${outfit.className} antialiased`}>
          <Toaster />
          <AppContextProvider dict={dict}>
            <ThemeProvider>{children}</ThemeProvider>
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
