import { useDebounceFn } from "ahooks";
import { App } from "antd";
import type { Locale } from "antd/es/locale";
import enUS from "antd/es/locale/en_US";
import zhCN from "antd/es/locale/zh_CN";
import { MessageInstance } from "antd/es/message/interface";
import { TFunction } from "i18next/typescript/t";
import queryString from "query-string";
import { createContext, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router-dom";

interface IAuthContextType {
  navigate: NavigateFunction;
  location: Location<any>;
  parseQueryParams: <T extends object>() => T;
  parseQuery: () => string[];
  t: TFunction<"translation", undefined>;
  changeLanguage: () => void;
  language: string | null;
  signOut: (callback?: VoidFunction) => void;
  signIn: (token: string, name: string) => void;
  locale: Locale;
  locationPathname: string;
  token: string;
  userName: string;
  message: MessageInstance;
}

export const AuthContext = createContext<IAuthContextType>(null!);

export const AuthProvider = (props: { children: ReactElement }) => {
  const navigate = useNavigate();

  const location = useLocation();

  const { message } = App.useApp();

  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState<string | null>(null);

  const [locale, setLocal] = useState<Locale>(zhCN);

  const [isInit, setIsInit] = useState<boolean>(false);

  const [token, setToken] = useState("");

  const [userName, setUserName] = useState("");

  const signIn = (token: string, name: string) => {
    setToken(token);
    setUserName(name);
    navigate("/home");
  };

  const signOut = (callback?: VoidFunction) => {
    setToken("");
    setUserName("");

    localStorage.setItem((window as any).appsettings?.tokenKey, "");
    localStorage.setItem((window as any).appsettings?.userNameKey, "");

    callback && callback();
  };

  const parseQueryParams = <T extends object>(): T => {
    const queryParams = queryString.parse(location.search);

    return queryParams as T;
  };

  const parseQuery = (): string[] => {
    console.log(
      "parseQuery",
      location.pathname.split("/").filter((item) => item.trim() !== "")
    );

    return location.pathname.split("/").filter((item) => item.trim() !== "");
  };

  const changeLanguage = () => {
    // const data = parseQueryParams<{ language: string }>();
    // if (data?.language) {
    //   const newData = {
    //     ...data,
    //     language: data.language === "en" ? "ch" : "en",
    //   };
    //   const newQueryString = queryString.stringify(newData);
    //   navigate(`${location.pathname}?${newQueryString}`);
    // }
    setLanguage((prev) => (prev === "ch" ? "en" : "ch"));
  };

  // useEffect(() => {
  //   const data = parseQueryParams();

  //   if (location.pathname !== "/")
  //     if (!Object.keys(data).includes("language")) {
  //       navigate(
  //         `${location.pathname}${
  //           location.search.includes("?")
  //             ? location.search + `&language=`
  //             : `?language=`
  //         }${
  //           language ?? localStorage.getItem("language")
  //             ? localStorage.getItem("language")
  //             : "ch"
  //         }`
  //       );
  //     } else {
  //       const list = Object.entries(data);

  //       if (list) {
  //         const language = list.find((x) => x[0] === "language");

  //         language && setLanguage(language[1]);
  //       }
  //     }
  // }, [location.pathname, location.search]);

  useEffect(() => {
    const token = localStorage.getItem((window as any).appsettings?.tokenKey);

    const userName = localStorage.getItem(
      (window as any).appsettings?.userNameKey
    );

    if (token) setToken(token);
    if (userName) setUserName(userName);
  }, []);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
      setLocal(language === "en" ? enUS : zhCN);
      localStorage.setItem("language", language);
    } else {
      if (!isInit) {
        setLanguage("ch");
        setIsInit(true);
      }
    }
  }, [language]);

  const value = {
    navigate,
    location,
    parseQueryParams,
    t,
    changeLanguage,
    language,
    signOut,
    signIn,
    locale,
    locationPathname: location.pathname,
    parseQuery,
    token,
    userName,
    message,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};
