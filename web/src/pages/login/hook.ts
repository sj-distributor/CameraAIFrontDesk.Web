import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { IUserInfo } from "@/entity/types";

export const useAction = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState<IUserInfo>({
    user: "",
    password: "",
  });

  const updateUserInfo = (k: keyof IUserInfo, v: string) => {
    setUserInfo((prev) => ({
      ...prev,
      [k]: v,
    }));
  };

  const onLogin = () => {
    navigate("/home");
  };

  const getwidth = () => {
    console.log(document.body.clientWidth);
  };

  useEffect(() => {
    getwidth();

    window.addEventListener("resize", getwidth);

    return () => {
      window.removeEventListener("resize", getwidth);
    };
  }, []);

  return { userInfo, updateUserInfo, onLogin };
};
