import { Navigate } from "react-router-dom";

import { useAuth } from "./use-auth";
import { isNil } from "ramda";

export const AuthStatus = (props: { children: JSX.Element }) => {
  const { location, pagePermission, isGetPermission, defaultNavigatePage } =
    useAuth();

  if (!localStorage.getItem((window as any).appsettings.tokenKey)) {
    return <Navigate to="/login" state={{ from: location }} replace={true} />;
  }

  if (
    isGetPermission &&
    ((location.pathname.includes("/home") && !pagePermission.canViewHome) ||
      (location.pathname.includes("/monitor") &&
        !pagePermission.canViewMonitor) ||
      (location.pathname.includes("/replay") &&
        !pagePermission.canViewReplay) ||
      (location.pathname.includes("/warning") &&
        !pagePermission.canViewWarning) ||
      (location.pathname.includes("/feedback") &&
        !pagePermission.canViewFeedback) ||
      (location.pathname.includes("/door") &&
        !pagePermission.canViewCameraAiDoorDetection) ||
      (location.pathname.includes("/inout") &&
        !pagePermission.canViewCameraAiInAndOutRegistration))
  ) {
    return <Navigate to="/none" state={{ from: location }} replace={true} />;
  }

  if (
    location.pathname.includes("/none") &&
    !isNil(defaultNavigatePage) &&
    defaultNavigatePage !== "/none"
  ) {
    return (
      <Navigate
        to={defaultNavigatePage}
        state={{ from: location }}
        replace={true}
      />
    );
  }

  return props.children;
};
