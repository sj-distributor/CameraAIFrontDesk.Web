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
import { ITeamListProps, IUserDataItem } from "@/dtos/main";
import { GetTeamsMineApi } from "@/services/main";
import { isEmpty } from "ramda";

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
  mineRoles: IMineRoleResponse;
  userName: string;
  message: MessageInstance;
  pagePermission: IPermissions;
  changeLanguage: (language: "en" | "ch") => void;
  isGetPermission: boolean;
  setIsGetPermission: React.Dispatch<React.SetStateAction<boolean>>;
  defaultNavigatePage: string | null;
  currentTeam: ITeamListProps;
  setCurrentTeam: React.Dispatch<React.SetStateAction<ITeamListProps>>;
  setPagePermission: React.Dispatch<React.SetStateAction<IPermissions>>;
  currentAccount: IUserDataItem;
  setCurrentAccount: React.Dispatch<React.SetStateAction<IUserDataItem>>;
  teamList: ITeamListProps[];
  getMineTeam: (name: string) => void;
}

interface IPermissions {
  [key: string]: boolean;
}

const initCurrentTeam: ITeamListProps = {
  id: "",
  name: "",
  leaderId: "",
  tenantId: "",
  avatarUrl: "",
};

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

  const [teamList, setTeamList] = useState<ITeamListProps[]>([]);

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
    CanViewCameraAiDoorDetection: false,
    CanViewCameraAiInAndOutRegistration: false,
  });

  const localCurrentTeam = JSON.parse(
    localStorage.getItem("currentTeam") ?? "{}"
  );

  const localCurrentAccount = JSON.parse(
    localStorage.getItem("currentAccount") ?? "{}"
  );

  const [currentTeam, setCurrentTeam] = useState<ITeamListProps>({
    id: localCurrentTeam.id ?? "",
    name: localCurrentTeam.name ?? "",
    leaderId: localCurrentTeam.leaderId ?? "",
    tenantId: localCurrentTeam.tenantId ?? "",
    avatarUrl: localCurrentTeam.avatarUrl ?? "",
  });

  const [currentAccount, setCurrentAccount] =
    useState<IUserDataItem>(localCurrentAccount);

  const signIn = async (token: string, name: string) => {
    setIsLogin(true);

    setToken(token);
    setUserName(name);

    getMineTeam();
  };

  const getMineTeam = () => {
    GetTeamsMineApi({})
      .then(async (res) => {
        if (!isEmpty(res)) {
          setTeamList(res);
          getMinePermission(res[0].id);

          if (!window.__POWERED_BY_WUJIE__ && !localCurrentTeam.id) {
            localStorage.setItem(
              "currentTeam",
              JSON.stringify(res[0] ?? initCurrentTeam)
            );

            setCurrentTeam(res[0] ?? initCurrentTeam);
          }
        } else {
          setTeamList([]);

          setPagePermission(checkRole([]));

          setIsGetPermission(true);

          navigate("/home");
        }
      })
      .catch((err) => {
        message.error(`獲取團隊失敗：${err}`);
      });
  };

  const getMinePermission = async (TeamId: string) => {
    const { count = 0, rolePermissionData = [] } =
      (await GetMineRoleList({
        TeamId: TeamId,
      })) || {};

    setIsGetPermission(true);

    setMineRoles({
      count: count ?? 0,
      rolePermissionData: rolePermissionData ?? [],
    });

    const permissions = checkRole(rolePermissionData);

    setPagePermission(permissions);

    if (isLogin) {
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
    }
  };

  const changeLanguage = (language: "en" | "ch") => {
    setLanguage(language);
  };

  const signOut = (callback?: VoidFunction) => {
    setToken("");
    setUserName("");
    setCurrentTeam(initCurrentTeam);

    localStorage.setItem((window as any).appsettings?.tokenKey, "");
    localStorage.setItem((window as any).appsettings?.userNameKey, "");

    localStorage.removeItem("currentTeam");
    localStorage.removeItem("currentAccount");

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
      {
        permission: FrontRolePermissionEnum.CanViewCameraAiDoorDetection,
        variableName: "canViewCameraAiDoorDetection",
      },
      {
        permission: FrontRolePermissionEnum.CanViewCameraAiInAndOutRegistration,
        variableName: "canViewCameraAiInAndOutRegistration",
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
      {
        permission: FrontRolePermissionEnum.CanCreateCameraAiTeam,
        variableName: "canCreateCameraAiTeam",
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
    if (!isLogin && token) {
      getMineTeam();
    }
  }, [isLogin]);

  useUpdateEffect(() => {
    if (currentTeam.id) getMinePermission(currentTeam.id);
  }, [currentTeam]);

  useUpdateEffect(() => {
    console.log(pagePermission);

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
      : pagePermission["canViewCameraAiDoorDetection"]
      ? "/door"
      : pagePermission["canViewCameraAiInAndOutRegistration"]
      ? "/inout"
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
    setIsGetPermission,
    defaultNavigatePage,
    currentTeam,
    setCurrentTeam,
    setPagePermission,
    currentAccount,
    setCurrentAccount,
    teamList,
    getMineTeam,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};
