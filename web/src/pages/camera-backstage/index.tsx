import { useAuth } from "@/hooks/use-auth";
import { LoadingSvg } from "@/icon/main";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WujieReact from "wujie-react";

export const CameraBackstage = () => {
  const { bus } = WujieReact;

  const navigate = useNavigate();

  const { signOut } = useAuth();

  const tokenKey = (window as any).appsettings.tokenKey;

  const userNameKey = (window as any).appsettings.userNameKey;

  const [preloading, setPreLoading] = useState<boolean>(true);

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
      {preloading && (
        <div className="absolute inset-0 flex justify-center items-center z-10 bg-white">
          <LoadingSvg />
        </div>
      )}

      <WujieReact
        width="100%"
        height="100%"
        name="CameraBackstage"
        url={(window as any).appsettings.cameraAIBackstageDomain}
        sync={true}
        alive={true}
        fiber={true}
        activated={() => setPreLoading(false)}
        props={{
          userName: localStorage.getItem(userNameKey),
          token: localStorage.getItem(tokenKey),
          signOut: () => signOut(() => navigate("/login")),
        }}
      />
    </div>
  );
};
