import { useAuth } from "@/hooks/use-auth";
import KEYS from "@/i18n/keys/main-page";

export const useAction = () => {
  const { t, location, navigate, parseQueryParams } = useAuth();

  const items = () => {
    const splitArr = location.pathname
      .split("/")
      .filter((str) => str.trim().length > 0);

    const data = [
      {
        title: t(KEYS.HOME, { ns: "main" }),
        path: "/home",
        className: "text-xl",
      },
    ];

    switch (splitArr[0]) {
      case "monitor":
        data.push({
          title: t(KEYS.REALTIME_MONITORING, { ns: "main" }),
          path: "/monitor/list",
          className: "text-xl",
        });

        if (splitArr[1] && splitArr[1] !== "list")
          data.push({
            title: (Object.keys(parseQueryParams()).length > 0 &&
            Object.keys(parseQueryParams()).includes("regionName")
              ? parseQueryParams<{ regionName: string }>().regionName
              : "區域地址名稱") as string,
            path: "",
            className: "text-xl",
          });

        break;
      case "replay":
        data.push({
          title: t(KEYS.VIDEO_REPLAY, { ns: "main" }),
          path: "/replay/list",
          className: "text-xl",
        });

        break;
      case "warning":
        data.push({
          title: t(KEYS.WARNING_LIST, { ns: "main" }),
          path: "/warning/list",
          className: "text-xl",
        });

        break;
      case "feedback":
        data.push({
          title: t(KEYS.FEEDBACK_LIST, { ns: "main" }),
          path: "/feedback/list",
          className: "text-xl",
        });

        break;
    }

    return data;
  };

  return { items, navigate };
};
