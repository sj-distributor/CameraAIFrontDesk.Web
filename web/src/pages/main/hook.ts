import { useDebounceFn } from "ahooks";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { message } from "antd";

interface IPasswordDto {
  currentPW: string;
  newPW: string;
  confirmPW: string;
}

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

  const [delModalStatus, setDelModalStatus] = useState<boolean>(false);

  const [status, setStatus] = useState<boolean>(false);

  const [languageStatus, setLanguageStatus] = useState<boolean>(false);

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const [passwordDto, setPasswordDto] = useState<IPasswordDto>({
    currentPW: "",
    newPW: "",
    confirmPW: "",
  });

  const updatePWDto = (k: keyof IPasswordDto, v: string) => {
    setPasswordDto((prev) => ({
      ...prev,
      [k]: v,
    }));
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

  const submitModifyPassword = () => {};

  const handleResize = () => {
    setCollapsed(window.innerWidth > 800 ? false : true);
  };

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
    userName,
    language,
    handleOnJump,
    delModalStatus,
    collapsed,
    location,
    openKeys,
    selectedKeys,
    passwordDto,
    languageStatus,
    handleOnSignOut,
    pagePermission,
    handleJumpToBackstage,
    navigate,
    setStatus,
    setOpenKeys,
    updatePWDto,
    changeLanguage,
    setSelectedKeys,
    filterSelectKey,
    setLanguageStatus,
    setDelModalStatus,
    submitModifyPassword,
  };
};
