import { useUpdateEffect } from "ahooks";
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

import {
  FrontRolePermissionEnum,
  IMineRoleResponse,
  IRolePermissionItem,
} from "@/dtos/mine";
import { GetMineRoleList } from "@/services/default";
import { ITeamListProps } from "@/dtos/main";

interface IAuthContextType {
  navigate: NavigateFunction;
  location: Location<any>;
  parseQueryParams: <T extends object>() => T;
  parseQuery: () => string[];
  t: TFunction<"translation", undefined>;
  language: string | null;
  signOut: (callback?: VoidFunction) => void;
  signIn: (token: string, name: string) => void;
  locale: Locale;
  // locationPathname: string;
  // token: string;
  mineRoles: IMineRoleResponse;
  userName: string;
  message: MessageInstance;
  pagePermission: IPermissions;
  changeLanguage: (language: "en" | "ch") => void;
  isGetPermission: boolean;
  defaultNavigatePage: string | null;
  currentTeam: ITeamListProps;
  setCurrentTeam: React.Dispatch<React.SetStateAction<ITeamListProps>>;
  setPagePermission: React.Dispatch<React.SetStateAction<IPermissions>>;
}

interface IPermissions {
  [key: string]: boolean;
}

export const AuthContext = createContext<IAuthContextType>(null!);

export const AuthProvider = (props: { children: ReactElement }) => {
  const navigate = useNavigate();

  const location = useLocation();

  const { message } = App.useApp();

  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState<string | null>(
    localStorage.getItem("language") ?? null
  );

  const [locale, setLocal] = useState<Locale>(zhCN);

  const [isGetPermission, setIsGetPermission] = useState<boolean>(false);

  const [token, setToken] = useState(
    localStorage.getItem((window as any).appsettings?.tokenKey) ?? ""
  );

  const [userName, setUserName] = useState(
    localStorage.getItem((window as any).appsettings?.userNameKey) ?? ""
  );

  const [mineRoles, setMineRoles] = useState<IMineRoleResponse>({
    count: 0,
    rolePermissionData: [],
  });

  const [isLogin, setIsLogin] = useState<boolean>(false);

  const [isInit, setIsInit] = useState<boolean>(false);

  const [defaultNavigatePage, setDefaultNavigatePage] = useState<string | null>(
    null
  );

  const [pagePermission, setPagePermission] = useState<IPermissions>({
    canViewHome: false,
    canViewMonitor: false,
    canViewReplay: false,
    canViewWarning: false,
    canViewFeedback: false,
  });

  const localCurrentTeam = JSON.parse(
    localStorage.getItem("currentTeam") ?? "{}"
  );

  const [currentTeam, setCurrentTeam] = useState<ITeamListProps>({
    id: localCurrentTeam.id ?? "",
    name: localCurrentTeam.name ?? "",
    leaderId: localCurrentTeam.leaderId ?? "",
    tenantId: localCurrentTeam.tenantId ?? "",
    avatarUrl: localCurrentTeam.avatarUrl ?? "",
  });

  const signIn = async (token: string, name: string) => {
    setIsLogin(true);

    setToken(token);
    setUserName(name);

    const { count, rolePermissionData } = await GetMineRoleList();

    setIsGetPermission(true);

    setMineRoles({
      count: count ?? 0,
      rolePermissionData: rolePermissionData ?? [],
    });

    const permissions = checkRole(rolePermissionData);

    setPagePermission(permissions);

    const defaultPage = permissions["canViewHome"]
      ? "/home"
      : permissions["canViewMonitor"]
      ? "/monitor"
      : permissions["canViewReplay"]
      ? "/replay"
      : permissions["canViewWarning"]
      ? "/warning"
      : permissions["canViewFeedback"]
      ? "/feedback"
      : "/none";

    navigate(defaultPage);
  };

  const getMinePermission = async () => {
    const { count, rolePermissionData } = await GetMineRoleList();

    setMineRoles({
      count: count ?? 0,
      rolePermissionData: rolePermissionData ?? [],
    });

    return checkRole(rolePermissionData);
  };

  const changeLanguage = (language: "en" | "ch") => {
    setLanguage(language);
  };

  const signOut = (callback?: VoidFunction) => {
    setToken("");
    setUserName("");

    localStorage.setItem((window as any).appsettings?.tokenKey, "");
    localStorage.setItem((window as any).appsettings?.userNameKey, "");

    setMineRoles({
      count: 0,
      rolePermissionData: [],
    });

    callback && callback();
  };

  const checkPermission = (
    permissionName: string,
    rolePermissionData: IRolePermissionItem[]
  ): boolean => {
    return rolePermissionData.some((item) => {
      return item.permissions.some(
        (permission) => permission.name === permissionName
      );
    });
  };

  const checkRole = (rolePermissionData: IRolePermissionItem[]) => {
    const permissionsToCheck = [
      {
        permission: FrontRolePermissionEnum.CanViewCameraAiHomePage,
        variableName: "canViewHome",
      },
      {
        permission: FrontRolePermissionEnum.CanViewCameraAiLiveMonitorPage,
        variableName: "canViewMonitor",
      },
      {
        permission: FrontRolePermissionEnum.CanViewCameraAiVideoPlaybackPage,
        variableName: "canViewReplay",
      },
      {
        permission: FrontRolePermissionEnum.CanViewCameraAiWarningListPage,
        variableName: "canViewWarning",
      },
      {
        permission: FrontRolePermissionEnum.CanViewCameraAiFeedbackListPage,
        variableName: "canViewFeedback",
      },
      // 功能
      {
        permission: FrontRolePermissionEnum.CanSwitchCameraAiBackEnd,
        variableName: "canSwitchCameraAiBackend",
      },
      {
        permission: FrontRolePermissionEnum.CanExportCameraAiRealtimeVideo,
        variableName: "canExportRealtimeVideo",
      },
      {
        permission: FrontRolePermissionEnum.CanExportCameraAiPlaybackVideo,
        variableName: "canExportPlaybackVideo",
      },
      {
        permission: FrontRolePermissionEnum.CanExportExcelCameraAiWarning,
        variableName: "canExportExcelWarning",
      },
      {
        permission: FrontRolePermissionEnum.CanViewDetailCameraAiWarning,
        variableName: "canViewDetailWarning",
      },
      {
        permission: FrontRolePermissionEnum.CanMarkCameraAiWarning,
        variableName: "canMarkWarning",
      },
      {
        permission: FrontRolePermissionEnum.CanExportExcelCameraAiFeedback,
        variableName: "canExportExcelFeedback",
      },
      {
        permission: FrontRolePermissionEnum.CanViewDetailCameraAiFeedback,
        variableName: "canViewDetailFeedback",
      },
    ];

    const permissions: { [key: string]: boolean } = permissionsToCheck.reduce(
      (acc: IPermissions, { permission, variableName }) => {
        acc[variableName] = checkPermission(permission, rolePermissionData);

        return acc;
      },
      {}
    );

    return permissions;
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

  useEffect(() => {
    // if (!currentTeam.id) {
    //   setIsGetPermission(true);

    //   message.error("TeamId not found！");
    //   return;
    // }

    if (userName && token && !isLogin) {
      getMinePermission()
        .then((res) => {
          setIsGetPermission(true);
          setPagePermission(res);
        })
        .catch(() => {
          setPagePermission({
            canViewHome: false,
            canViewMonitor: false,
            canViewReplay: false,
            canViewWarning: false,
            canViewFeedback: false,
          });
        });
    }
  }, [userName, token, isLogin, currentTeam]);

  // useUpdateEffect(() => {
  //   console.log("重新获取一遍权限");

  //   getMinePermission()
  //     .then((res) => {
  //       setIsGetPermission(true);
  //       setPagePermission(res);
  //     })
  //     .catch(() => {
  //       setPagePermission({
  //         canViewHome: false,
  //         canViewMonitor: false,
  //         canViewReplay: false,
  //         canViewWarning: false,
  //         canViewFeedback: false,
  //       });
  //     });
  // }, [currentTeam]);

  useUpdateEffect(() => {
    const defaultPage = pagePermission["canViewHome"]
      ? "/home"
      : pagePermission["canViewMonitor"]
      ? "/monitor"
      : pagePermission["canViewReplay"]
      ? "/replay"
      : pagePermission["canViewWarning"]
      ? "/warning"
      : pagePermission["canViewFeedback"]
      ? "/feedback"
      : "/none";

    setDefaultNavigatePage(defaultPage);
  }, [pagePermission]);

  const value = {
    t,
    language,
    navigate,
    location,
    locale,
    signIn,
    message,
    signOut,
    userName,
    mineRoles,
    pagePermission,
    parseQuery,
    changeLanguage,
    parseQueryParams,
    isGetPermission,
    defaultNavigatePage,
    currentTeam,
    setCurrentTeam,
    setPagePermission,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};
