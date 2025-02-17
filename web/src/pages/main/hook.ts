import { useDebounceFn, useUpdateEffect } from "ahooks";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { App } from "antd";
import {
  IAcceptWarnDtoProps,
  IAddTeamDataProps,
  INewTeamDtoProps,
  IUserProfileNotificationDto,
} from "@/dtos/main";
import {
  GetAccountInfoApi,
  GetUserNotificationApi,
  PostTeamCreateApi,
  PostUploadApi,
  PostUserNotificationUpdateApi,
} from "@/services/main";
import { isEmpty } from "ramda";

const initAcceptWarn: IUserProfileNotificationDto = {
  id: "",
  phone: "",
  workWechat: "",
  email: "",
};

export const useAction = () => {
  const { message } = App.useApp();

  const {
    t,
    signOut,
    navigate,
    changeLanguage,
    userName,
    location,
    language,
    pagePermission,
    currentTeam,
    defaultNavigatePage,
    setCurrentTeam,
    setPagePermission,
    teamList,
    getMineTeam,
    setIsGetPermission,
    currentAccount,
    setCurrentAccount,
  } = useAuth();

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [status, setStatus] = useState<boolean>(false);

  const [languageStatus, setLanguageStatus] = useState<boolean>(false);

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const [newTeamDto, setNewTeamDto] = useState<INewTeamDtoProps>({
    openNewTeam: false,
    isUploading: false,
    addTeamLoading: false,
  });

  const [addTeamData, setAddTeamData] = useState<IAddTeamDataProps>({
    avatarUrl: "",
    name: "",
  });

  const [acceptWarnDto, setAcceptWarnDto] = useState<IAcceptWarnDtoProps>({
    openAcceptWran: false,
    acceptWarnLoading: false,
  });

  const [acceptWarnData, setAcceptWarnData] =
    useState<IUserProfileNotificationDto>(initAcceptWarn);

  const [originAcceptWarnData, setOriginAcceptWarnData] =
    useState<IUserProfileNotificationDto>(initAcceptWarn);

  const [errorMessages, setErrorMessages] =
    useState<IUserProfileNotificationDto>(initAcceptWarn);

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

  const updateErrorMessage = (
    k: keyof IUserProfileNotificationDto,
    v: string
  ) => {
    setErrorMessages((prev) => ({
      ...prev,
      [k]: v,
    }));
  };

  const updateAcceptWarnData = (
    k: keyof IUserProfileNotificationDto,
    v: string
  ) => {
    setAcceptWarnData((prev) => ({
      ...prev,
      [k]: v,
    }));
  };

  const validationRules: Record<
    keyof IUserProfileNotificationDto,
    { pattern: RegExp | undefined; errorMessage: string }
  > = {
    phone: {
      pattern: /^[0-9]{7,15}$/, // 7-15位数字
      errorMessage: "請輸入正確的電話號碼",
    },
    workWechat: {
      pattern: /^[a-zA-Z0-9_-]{4,20}$/, // 4-20位字符
      errorMessage: "請輸入正確的企業微信號碼",
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // 通用邮箱格式
      errorMessage: "請輸入正確的郵箱地址",
    },
    id: {
      pattern: undefined,
      errorMessage: "",
    },
  };

  const validateFn = (
    type: keyof IUserProfileNotificationDto,
    value: string
  ) => {
    const rule = validationRules[type];

    if (!rule) return;

    const { pattern, errorMessage } = rule;

    updateErrorMessage(type, pattern?.test(value) ? "" : errorMessage);
  };

  const jumpToBackstage = () => {
    if (pagePermission.canSwitchCameraAiBackend) {
      if (window.__POWERED_BY_WUJIE__) {
        window.$wujie.props?.goBackstage();
      } else {
        const newWindow = window.open(`/backstage`, "_blank");

        if (newWindow) {
          newWindow.document.write(`
            <script>
              sessionStorage.setItem("backstage", "admin");
              window.location.href = "/backstage";
            </script>
          `);
        }
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
      const formData = new FormData();

      formData.append("file", files);

      PostUploadApi(formData)
        .then((res) => {
          updateAddTeamData("avatarUrl", res.fileUrl);
        })
        .catch((err) => {
          message.error(err.msg);
        })
        .finally(() => updateNewTeamDto("isUploading", false));
    });
  };

  const { run: onAddTeamDebounceFn } = useDebounceFn(
    () => {
      if (!addTeamData.avatarUrl || !addTeamData.name) {
        message.error("請輸入以下完整信息！");

        return;
      }

      updateNewTeamDto("addTeamLoading", true);

      PostTeamCreateApi({ team: addTeamData })
        .then(() => {
          getMineTeam(userName);

          message.success("創建團隊成功");
        })
        .catch((err) => {
          message.error(`創建團隊失敗：${err}`);
        })
        .finally(() => {
          updateNewTeamDto("addTeamLoading", false);

          updateNewTeamDto("openNewTeam", false);

          updateAddTeamData("avatarUrl", "");

          updateAddTeamData("name", "");
        });
    },
    { wait: 500 }
  );

  const { run: onAcceptWarnDebounceFn } = useDebounceFn(
    () => {
      updateAcceptWarnDto("acceptWarnLoading", true);

      PostUserNotificationUpdateApi({
        userProfileNotificationDto: acceptWarnData,
      })
        .then(() => {
          getUserNotification();

          message.success("保存成功");
        })
        .catch((err) => {
          message.error(`保存失敗：${err}`);
        })
        .finally(() => {
          updateAcceptWarnDto("acceptWarnLoading", false);

          updateAcceptWarnDto("openAcceptWran", false);
        });
    },
    { wait: 500 }
  );

  const getMineInfo = () => {
    GetAccountInfoApi({})
      .then((res) => {
        if (!isEmpty(res)) {
          setCurrentAccount(res.userProfile);

          localStorage.setItem(
            "currentAccount",
            JSON.stringify(res.userProfile)
          );
        }
      })
      .catch((err) => {
        message.error(`获取个人信息失败：${err}`);
      });
  };

  const getUserNotification = () => {
    GetUserNotificationApi({
      TeamId: currentTeam.id,
      UserProfileId: String(currentAccount.id),
    })
      .then((res) => {
        setAcceptWarnData(res?.userProfileNotificationDto);

        setOriginAcceptWarnData(res?.userProfileNotificationDto);
      })
      .catch((err) => {
        message.error(`獲取預警信息失敗：${err}`);
      });
  };

  useEffect(() => {
    getMineInfo();

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useUpdateEffect(() => {
    localStorage.setItem("currentTeam", JSON.stringify(currentTeam));
  }, [currentTeam]);

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
    addTeamData,
    acceptWarnData,
    errorMessages,
    onAddTeamDebounceFn,
    onAcceptWarnDebounceFn,
    teamList,
    newTeamDto,
    acceptWarnDto,
    initAcceptWarn,
    updateAcceptWarnDto,
    updateNewTeamDto,
    updateErrorMessage,
    updateAcceptWarnData,
    updateAddTeamData,
    navigate,
    setStatus,
    setOpenKeys,
    changeLanguage,
    setSelectedKeys,
    filterSelectKey,
    setLanguageStatus,
    onUpload,
    validateFn,
    currentTeam,
    defaultNavigatePage,
    setCurrentTeam,
    setPagePermission,
    setIsGetPermission,
    originAcceptWarnData,
    setAcceptWarnData,
    setErrorMessages,
    getUserNotification,
  };
};
