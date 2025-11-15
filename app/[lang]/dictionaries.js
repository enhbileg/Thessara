// app/[lang]/dictionaries.js
const dictionaries = {
  en: async () => (await import("./dictionaries/en.json")).default,
  mn: async () => (await import("./dictionaries/mn.json")).default,
};

export async function getDictionary(locale) {
  if (!dictionaries[locale]) return {};
  return await dictionaries[locale](); // ✅ энд function байна
}
