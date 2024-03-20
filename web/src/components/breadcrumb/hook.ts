import { useMemo } from "react";

import { useAuth } from "@/hooks/use-auth";
import KEYS from "@/i18n/keys/main-page";

export const useAction = () => {
  const { t, locationPathname, navigate, parseQueryParams, language } =
    useAuth();

  const items = useMemo(() => {
    const splitArr = locationPathname
      .split("/")
      .filter((str) => str.trim().length > 0);

    const data = [
      {
        title: "首頁",
        path: "/home",
        className: "text-xl",
      },
    ];

    switch (splitArr[0]) {
      case "monitoring":
        data.push({
          title: "實時監控",
          path: "/monitoring/list",
          className: "text-xl",
        });

        if (splitArr[1] && splitArr[1] !== "list")
          data.push({
            title: (Object.keys(parseQueryParams()).length > 0 &&
            Object.keys(parseQueryParams()).includes("areaName")
              ? parseQueryParams<{ areaName: string }>().areaName
              : "區域地址名稱") as string,
            path: "",
            className: "text-xl",
          });

        break;
      case "replay":
        data.push({
          title: "視頻回放",
          path: "/replay/list",
          className: "text-xl",
        });

        break;
      case "warning":
        data.push({
          title: "預警列表",
          path: "/warning/list",
          className: "text-xl",
        });

        break;
      case "feedback":
        data.push({
          title: "反饋列表",
          path: "/feedback/list",
          className: "text-xl",
        });

        break;
    }

    return data;
  }, [locationPathname, language]);

  return { items, navigate };
};
