/// <amd-module name="utils/lang/Lang" />

import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import en from "./en";
import ru from "./ru";
import { Translation, TranslationString } from "./translations";

const supported = { en, ru } as const;

class Lang {
  dict: Translation;
  font: string;
  default_font: string;
  languageDetector: I18nextBrowserLanguageDetector;
  constructor() {
    this.getLanguage = this.getLanguage.bind(this);
    this.locale = this.locale.bind(this);

    window.i18next = i18next;
    this.languageDetector = new I18nextBrowserLanguageDetector(null, {
      order: [
        "querystring",
        "cookie",
        "localStorage",
        "sessionStorage",
        "navigator",
        "htmlTag",
      ],
      lookupQuerystring: "lng",
      lookupCookie: "i18next",
      lookupLocalStorage: "i18nextLng",
      lookupSessionStorage: "i18nextLng",
      caches: ["localStorage"],
      excludeCacheFor: ["cimode"],
    });
    i18next.use(this.languageDetector).init();
    const language = this.getLanguage();
    this.font = "font_" + language;
    this.default_font = "font_en";
    this.dict = supported[language];
  }
  locale(key: TranslationString) {
    return this.dict[key] || key + "|locale";
  }
  getLanguage(): keyof typeof supported {
    let language = this.languageDetector.detect(["navigator"])?.[0] ?? "en";
    if (language.indexOf("-") > -1) {
      language = language.split("-")[0]!;
    }
    if (language in supported) {
      return language as keyof typeof supported;
    } else {
      return "en";
    }
  }
}

export = Lang;
