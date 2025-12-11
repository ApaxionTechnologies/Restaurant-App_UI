import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "hi"],

    ns: ["translation"],
    defaultNS: "translation",

    backend: {
      loadPath: "/locales/{{lng}}.json",
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    interpolation: { escapeValue: false },
  });

window.i18next = i18n;

export default i18n;
