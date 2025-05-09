import { useDebounceFn } from "ahooks";
import { useState } from "react";

import { IUserInfo } from "@/dtos";
import { useAuth } from "@/hooks/use-auth";
import { Login } from "@/services/home";
import { GetMineRoleList } from "@/services/default";
import { FrontRolePermissionEnum } from "@/dtos/mine";

export const useAction = () => {
  const { signIn, message } = useAuth();

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

  const hanldeNoPermission = () => {
    message.error("您没有访问权限");

    localStorage.removeItem(
      (window as any).appsettings?.tokenKey ?? "tokenKey"
    );

    localStorage.removeItem((window as any).appsettings?.userNameKey);
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
            localStorage.setItem((window as any).appsettings?.tokenKey, res);
            localStorage.setItem(
              (window as any).appsettings?.userNameKey,
              userInfo.userName
            );

            GetMineRoleList()
              .then((response) => {
                if (
                  response.rolePermissionData.some((item) =>
                    item.permissions.some(
                      (permission) =>
                        permission.name ===
                        FrontRolePermissionEnum.CanEnterCameraAi
                    )
                  )
                ) {
                  message.success("登录成功");

                  signIn(
                    localStorage.getItem(
                      (window as any).appsettings?.tokenKey ?? "tokenKey"
                    ) ?? "",
                    userInfo.userName
                  );
                } else {
                  hanldeNoPermission();
                }
              })
              .catch(() => {
                hanldeNoPermission();
              });
          }
        })
        .catch(() => {
          message.error("登录失败，请重试");
        });
    } else {
      message.warning("请输入正确的用户名和密码");
    }

    setTimeout(() => {
      setLoginLoading(false);
    }, 1000);
  };

  const { run: handleOnLogin } = useDebounceFn(onLogin, {
    wait: 300,
  });

  return { userInfo, loginLoading, updateUserInfo, handleOnLogin };
};
