import { useAuth } from "@/hooks/use-auth";
import { LoadingSvg } from "@/icon/main";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WujieReact from "wujie-react";
import { None } from "../none";

export const CameraBackstage = () => {
  const { bus } = WujieReact;

  const navigate = useNavigate();

  const { signOut, pagePermission, isGetPermission } = useAuth();

  const tokenKey = (window as any).appsettings.tokenKey;

  const userNameKey = (window as any).appsettings.userNameKey;

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const newToken = localStorage.getItem(tokenKey);

        const newUserName = localStorage.getItem(userNameKey);

        bus.$emit("token_refresh", newToken, newUserName);
      } catch (error) {
        console.log(error);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div>
      {isGetPermission ? (
        pagePermission.canSwitchCameraAiBackend ? (
          <>
            <WujieReact
              width="100%"
              height="100%"
              name="CameraBackstage"
              url={(window as any).appsettings.cameraAIBackstageDomain}
              sync={true}
              alive={false}
              fiber={true}
              props={{
                userName: localStorage.getItem(userNameKey),
                token: localStorage.getItem(tokenKey),
                signOut: () => signOut(() => navigate("/login")),
              }}
            />
          </>
        ) : (
          <None />
        )
      ) : (
        <div className="absolute inset-0 flex justify-center items-center z-10 bg-white">
          <LoadingSvg />
        </div>
      )}
    </div>
  );
};
