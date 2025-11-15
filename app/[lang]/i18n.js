const i18n = {
  locales: ["en", "mn"],
  defaultLocale: "en",
  pages: {
    "*": ["common"],
    "/app/about": ["about"],
    "/contact": ["contact"],
    "/products/[id]": ["product"]
  }
};

module.exports = i18n;
