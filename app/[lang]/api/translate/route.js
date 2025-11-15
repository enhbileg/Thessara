const translate = async (text, targetLang = "en") => {
  try {
    const res = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "auto",       // эх хэл автоматаар танина
        target: targetLang,   // "mn" эсвэл "en"
        format: "text",
      }),
    });

    if (!res.ok) {
      throw new Error(`Translation API error: ${res.status}`);
    }

    const data = await res.json();
    return data.translatedText;
  } catch (error) {
    toast.error("Translation failed");
    return text; // fallback
  }
};
