import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import home from "./pages/home";
import main from "./pages/main";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      home: {
        ...home.en,
      },
      main: {
        ...main.en,
      },
    },
    ch: {
      home: {
        ...home.ch,
      },
      main: {
        ...main.ch,
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});
