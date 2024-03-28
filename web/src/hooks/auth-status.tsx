import { Navigate } from "react-router-dom";

import { useAuth } from "./use-auth";

export const AuthStatus = (props: { children: JSX.Element }) => {
  // const { userName, mineRoles, location } = useAuth();
  const { location } = useAuth();

  if (!localStorage.getItem((window as any).appsettings.tokenKey)) {
    return <Navigate to="/login" state={{ from: location }} replace={true} />;
  }

  // 在这里判断路由权限
  // console.log("userName", userName, mineRoles.count, location.pathname);

  return props.children;
};
