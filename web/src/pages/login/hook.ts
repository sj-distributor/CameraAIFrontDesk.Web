import { useEffect, useState } from "react";

import { IUserInfo } from "@/entity/types";
import { useAuth } from "@/hooks/use-auth";
import { Login } from "@/services/api/login";
import { useDebounceFn } from "ahooks";

export const useAction = () => {
  const { signIn, navigate, message, location } = useAuth();

  const [userInfo, setUserInfo] = useState<IUserInfo>({
    userName: "",
    password: "",
  });

  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const updateUserInfo = (k: keyof IUserInfo, v: string) => {
    setUserInfo((prev) => ({
      ...prev,
      [k]: v,
    }));
  };

  const onLogin = () => {
    setLoginLoading(true);
    if (
      userInfo.userName.trim().length !== 0 &&
      userInfo.password.trim().length !== 0
    ) {
      Login(userInfo)
        .then((res) => {
          if (res) {
            message.success("登录成功");
            localStorage.setItem((window as any).appsettings?.tokenKey, res);
            localStorage.setItem(
              (window as any).appsettings?.userNameKey,
              userInfo.userName
            );

            signIn(res, userInfo.userName);
          }
        })
        .catch(() => {
          message.error("登录失败，请重试");
        });
    } else {
      console.log("995");
      message.warning("请输入正确的用户名和密码");
    }
    setTimeout(() => {
      setLoginLoading(false);
    }, 1000);
  };

  const { run: handleOnLogin } = useDebounceFn(onLogin, {
    wait: 300,
  });

  const historyCallback = () => {
    const historyState = location.state;

    historyState?.from?.pathname
      ? navigate(historyState?.from?.pathname, { replace: true })
      : navigate("/home");
  };

  useEffect(() => {
    const token = localStorage.getItem((window as any).appsettings?.tokenKey);

    if (token) {
      historyCallback();
    }
  }, []);

  return { userInfo, loginLoading, updateUserInfo, handleOnLogin };
};
