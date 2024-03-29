import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import home from "./pages/home";
import main from "./pages/main";
import alertList from "./pages/alert-list";
import feedbackList from "./pages/feedback-list";
import videoPlayback from "./pages/video-playback";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      home: {
        ...home.en,
      },
      main: {
        ...main.en,
      },
      alertList: {
        ...alertList.en,
      },
      feedbackList: {
        ...feedbackList.en,
      },
      videoPlayback: {
        ...videoPlayback.en,
      },
    },
    ch: {
      home: {
        ...home.ch,
      },
      main: {
        ...main.ch,
      },
      alertList: {
        ...alertList.ch,
      },
      feedbackList: {
        ...feedbackList.ch,
      },
      videoPlayback: {
        ...videoPlayback.ch,
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});
