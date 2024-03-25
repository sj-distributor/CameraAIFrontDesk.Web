import { useDebounceFn } from "ahooks";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";

interface IPasswordDto {
  currentPW: string;
  newPW: string;
  confirmPW: string;
}

export const useAction = () => {
  const { location, t, userName, navigate, signOut } = useAuth();

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [delModalStatus, setDelModalStatus] = useState<boolean>(false);

  const [status, setStatus] = useState<boolean>(false);

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

  const submitModifyPassword = () => {};

  const { run: handleOnSignOut } = useDebounceFn(signOut, {
    wait: 500,
  });

  const { run: handleOnJump } = useDebounceFn(
    () => location.pathname !== "/warning/list" && navigate("/warning/list"),
    {
      wait: 500,
    }
  );

  const filterSelectKey = (key: string) => {
    if (!["/home", "/monitoring", "/replay"].includes(key)) {
      setOpenKeys(["/monitoring-summary"]);
    } else {
      setOpenKeys([key]);
    }
  };

  const handleResize = () => {
    setCollapsed(window.innerWidth > 800 ? false : true);
  };

  useEffect(() => {
    if (location.pathname) {
      const splitArr = location.pathname
        .split("/")
        .filter((str) => str.trim().length > 0);

      let key = "";

      if (splitArr.includes("home")) {
        key = "/home";
      } else if (splitArr.includes("monitoring")) {
        key = "/monitoring";
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

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    openKeys,
    selectedKeys,
    delModalStatus,
    passwordDto,
    status,
    collapsed,
    t,
    userName,
    handleOnSignOut,
    handleOnJump,
    setStatus,
    setDelModalStatus,
    filterSelectKey,
    setOpenKeys,
    setSelectedKeys,
    updatePWDto,
    submitModifyPassword,
  };
};
