import { getDictionary } from "./dictionaries";
import { AppContextProvider } from "@/context/AppContext";


export default async function LangLayout({ children, params }) {
  const { lang } = params;
  const dict = await getDictionary(lang);

  return (
    <div>
      <AppContextProvider dict={dict}>
        {children}
      </AppContextProvider>
    </div>
  );
}
