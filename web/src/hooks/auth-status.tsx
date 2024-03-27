import { Navigate } from "react-router-dom";

import { useAuth } from "./use-auth";

export const AuthStatus = (props: { children: JSX.Element }) => {
  const { location } = useAuth();

  if (!localStorage.getItem((window as any).appsettings.tokenKey)) {
    return <Navigate to="/login" state={{ from: location }} replace={true} />;
  }

  return props.children;
};
