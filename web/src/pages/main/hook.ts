import { useDebounceFn, useUpdateEffect } from "ahooks";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { App } from "antd";
import {
  IAcceptWarnDataProps,
  IAcceptWarnDtoProps,
  IAddTeamDataProps,
  INewTeamDtoProps,
  ITeamListProps,
} from "@/dtos/main";
import {
  GetAccountInfoApi,
  GetTeamsMineApi,
  PostTeamCreateApi,
  PostUploadApi,
} from "@/services/main";
import { isEmpty } from "ramda";

const initAcceptWarn: IAcceptWarnDataProps = {
  telephone: "",
  weCom: "",
  mailbox: "",
};

const initCurrentTeam: ITeamListProps = {
  id: "",
  name: "",
  leaderId: "",
  tenantId: "",
  avatarUrl: "",
};

const mockTeamList: ITeamListProps[] = [
  {
    id: "1",
    name: "Alpha Team",
    leaderId: "leader-001",
    tenantId: "tenant-001",
    avatarUrl:
      "https://smartiestest.oss-cn-hongkong.aliyuncs.com/20241217/6be331e8-0b6a-4a65-aeb8-e14f70407c33.jpeg?Expires=253402300799&OSSAccessKeyId=LTAI5tEYyDT8YqJBSXaFDtyk&Signature=zhqP7kcVoYACfR7K6rmQkC3sQSk%3D",
  },
  {
    id: "2",
    name: "Beta Team",
    leaderId: "leader-002",
    tenantId: "tenant-002",
    avatarUrl:
      "https://smartiestest.oss-cn-hongkong.aliyuncs.com/20250101/6feaeab5-920e-4073-81e1-ae305255593d.png?Expires=253402300799&OSSAccessKeyId=LTAI5tEYyDT8YqJBSXaFDtyk&Signature=JMZaXL5KBflFrNUSlowuYKhCNqk%3D",
  },
  {
    id: "3",
    name: "Gamma Team",
    leaderId: "leader-003",
    tenantId: "tenant-003",
    avatarUrl:
      "https://smartiestest.oss-cn-hongkong.aliyuncs.com/20250101/6eac6763-87a2-4958-93cc-e895de06906b.jpeg?Expires=253402300799&OSSAccessKeyId=LTAI5tEYyDT8YqJBSXaFDtyk&Signature=%2BCqlH7S0BI8sF7449SvJpyaErDo%3D",
  },
];

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
  } = useAuth();

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [status, setStatus] = useState<boolean>(false);

  const [languageStatus, setLanguageStatus] = useState<boolean>(false);

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const [teamList, setTeamList] = useState<ITeamListProps[]>([]);

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
      window.open(`/backstage`, "_blank", "noopener,noreferrer");
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
          getMineTeam();

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

      setTimeout(() => {
        message.success("接收预警成功");

        updateAcceptWarnDto("acceptWarnLoading", false);

        updateAcceptWarnDto("openAcceptWran", false);

        updateAcceptWarnData("mailbox", initAcceptWarn.mailbox);

        updateAcceptWarnData("telephone", initAcceptWarn.telephone);

        updateAcceptWarnData("weCom", initAcceptWarn.weCom);
      }, 3000);
    },
    { wait: 500 }
  );

  const getMineTeam = () => {
    GetTeamsMineApi({})
      .then((res) => {
        if (!isEmpty(res)) {
          setTeamList(res);

          setCurrentTeam(res[0] ?? initCurrentTeam);
        }
      })
      .catch((err) => {
        message.error(`獲取團隊失敗：${err}`);
      });
  };

  const getMineInfo = () => {
    GetAccountInfoApi({})
      .then((res) => {
        if (!isEmpty(res)) {
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

  useEffect(() => {
    getMineTeam();

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
  };
};
