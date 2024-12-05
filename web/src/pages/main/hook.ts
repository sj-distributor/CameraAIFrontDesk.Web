import { useDebounceFn } from "ahooks";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { message } from "antd";
import {
  IAcceptWarnDataProps,
  IAcceptWarnDtoProps,
  IAddTeamDataProps,
  INewTeamDtoProps,
} from "@/dtos/main";

const initAcceptWarn: IAcceptWarnDataProps = {
  telephone: "",
  weCom: "",
  mailbox: "",
};

const initAddTeam: IAddTeamDataProps[] = [
  {
    teamName: "SJ-CN TEAM",
  },
  {
    teamName: "SJ-CN TEAM",
  },
  {
    teamName: "雲廚房",
  },
  {
    teamName: "XXX農場",
  },
];

export const useAction = () => {
  const {
    t,
    signOut,
    navigate,
    changeLanguage,
    userName,
    location,
    language,
    pagePermission,
  } = useAuth();

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [status, setStatus] = useState<boolean>(false);

  const [languageStatus, setLanguageStatus] = useState<boolean>(false);

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const [clickIndex, setClickIndex] = useState<number>(0);

  const [teamList, setTeamList] = useState<IAddTeamDataProps[]>(initAddTeam);

  const [teamSelect, setTeamSelect] = useState<IAddTeamDataProps>({
    teamName: teamList[0]?.teamName,
  });

  const [newTeamDto, setNewTeamDto] = useState<INewTeamDtoProps>({
    openNewTeam: false,
    isUploading: false,
    addTeamLoading: false,
  });

  const [addTeamData, setAddTeamData] = useState<IAddTeamDataProps>({
    logoUrl: "",
    teamName: "",
  });

  const [acceptWarnDto, setAcceptWarnDto] = useState<IAcceptWarnDtoProps>({
    openAcceptWran: false,
    acceptWarnLoading: false,
  });

  const [acceptWarnData, setAcceptWarnData] =
    useState<IAcceptWarnDataProps>(initAcceptWarn);

  const [errorMessages, setErrorMessages] =
    useState<IAcceptWarnDataProps>(initAcceptWarn);

  const updateAddTeamData = (k: keyof IAddTeamDataProps, v: string) => {
    setAddTeamData((prev) => ({
      ...prev,
      [k]: v,
    }));
  };

  const updateNewTeamDto = (k: keyof INewTeamDtoProps, v: boolean) => {
    setNewTeamDto((prev) => ({
      ...prev,
      [k]: v,
    }));
  };

  const updateAcceptWarnDto = (k: keyof IAcceptWarnDtoProps, v: boolean) => {
    setAcceptWarnDto((prev) => ({
      ...prev,
      [k]: v,
    }));
  };

  const updateErrorMessage = (k: keyof IAcceptWarnDataProps, v: string) => {
    setErrorMessages((prev) => ({
      ...prev,
      [k]: v,
    }));
  };

  const updateAcceptWarnData = (k: keyof IAcceptWarnDataProps, v: string) => {
    setAcceptWarnData((prev) => ({
      ...prev,
      [k]: v,
    }));
  };

  const validationRules: Record<
    keyof IAcceptWarnDataProps,
    { pattern: RegExp; errorMessage: string }
  > = {
    telephone: {
      pattern: /^[0-9]{7,15}$/, // 7-15位数字
      errorMessage: "請輸入正確的電話號碼",
    },
    weCom: {
      pattern: /^[a-zA-Z0-9_-]{4,20}$/, // 4-20位字符
      errorMessage: "請輸入正確的企業微信號碼",
    },
    mailbox: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // 通用邮箱格式
      errorMessage: "請輸入正確的郵箱地址",
    },
  };

  const validateFn = (type: keyof IAcceptWarnDataProps, value: string) => {
    const rule = validationRules[type];

    if (!rule) return;

    const { pattern, errorMessage } = rule;

    updateErrorMessage(type, pattern.test(value) ? "" : errorMessage);
  };

  const jumpToBackstage = () => {
    if (pagePermission.canSwitchCameraAiBackend) {
      var myIframe = document.getElementById("myIframe") as HTMLIFrameElement;

      if (myIframe && myIframe.contentWindow) {
        const token = localStorage.getItem(
          (window as any).appsettings?.tokenKey
        );

        (myIframe as any).contentWindow.postMessage(
          token,
          (window as any).appsettings?.cameraAIBackstageDomain
        );

        window.open(
          (window as any).appsettings?.cameraAIBackstageDomain,
          "_blank"
        );
      }
    } else {
      message.warning("暫無權限切換後台");
    }
  };

  const { run: handleOnSignOut } = useDebounceFn(signOut, {
    wait: 500,
  });

  const { run: handleOnJump } = useDebounceFn(
    () => location.pathname !== "/warning/list" && navigate("/warning/list"),
    {
      wait: 500,
    }
  );

  const { run: handleJumpToBackstage } = useDebounceFn(jumpToBackstage, {
    wait: 500,
  });

  const filterSelectKey = (key: string) => {
    if (!["/home", "/monitor", "/replay"].includes(key)) {
      setOpenKeys(["/monitor-summary"]);
    } else {
      setOpenKeys([key]);
    }
  };

  const handleResize = () => {
    setCollapsed(window.innerWidth > 800 ? false : true);
  };

  const onUpload = (files: File[]) => {
    updateNewTeamDto("isUploading", true);

    files.forEach((files) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;

        setTimeout(() => {
          updateAddTeamData("logoUrl", base64String);

          updateNewTeamDto("isUploading", false);
        }, 3000);
      };

      reader.readAsDataURL(files);
    });
  };

  const { run: onAddTeamDebounceFn } = useDebounceFn(
    () => {
      if (!addTeamData.logoUrl || !addTeamData.teamName) {
        message.error("請輸入以下完整信息！");

        return;
      }

      updateNewTeamDto("addTeamLoading", true);

      setTimeout(() => {
        message.success("創建團隊成功");

        updateNewTeamDto("addTeamLoading", false);

        updateNewTeamDto("openNewTeam", false);
      }, 3000);
    },
    { wait: 500 }
  );

  const { run: onAcceptWarnDebounceFn } = useDebounceFn(
    () => {
      updateAcceptWarnDto("acceptWarnLoading", true);

      setTimeout(() => {
        message.success("接收预警成功");

        updateAcceptWarnDto("acceptWarnLoading", true);

        updateAcceptWarnDto("openAcceptWran", false);
      }, 3000);
    },
    { wait: 500 }
  );

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (location.pathname) {
      const splitArr = location.pathname
        .split("/")
        .filter((str) => str.trim().length > 0);

      let key = "";

      if (splitArr.includes("home")) {
        key = "/home";
      } else if (splitArr.includes("monitor")) {
        key = "/monitor";
      } else if (splitArr.includes("replay")) {
        key = "/replay";
      } else if (splitArr.includes("warning")) {
        key = "/warning";
      } else if (splitArr.includes("feedback")) {
        key = "/feedback";
      }
      filterSelectKey(key);
      setSelectedKeys([key]);
    }
  }, [location.pathname]);

  return {
    t,
    status,
    location,
    openKeys,
    userName,
    language,
    collapsed,
    selectedKeys,
    handleOnJump,
    languageStatus,
    handleOnSignOut,
    pagePermission,
    handleJumpToBackstage,
    clickIndex,
    addTeamData,
    acceptWarnData,
    errorMessages,
    onAddTeamDebounceFn,
    onAcceptWarnDebounceFn,
    teamList,
    teamSelect,
    newTeamDto,
    acceptWarnDto,
    updateAcceptWarnDto,
    updateNewTeamDto,
    setTeamSelect,
    updateErrorMessage,
    updateAcceptWarnData,
    updateAddTeamData,
    setClickIndex,
    navigate,
    setStatus,
    setOpenKeys,
    changeLanguage,
    setSelectedKeys,
    filterSelectKey,
    setLanguageStatus,
    onUpload,
    validateFn,
  };
};
