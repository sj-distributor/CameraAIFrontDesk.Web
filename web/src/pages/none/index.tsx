import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth";

export const None = () => {
  const { defaultNavigatePage } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="h-full w-screen flex justify-center items-start">
      <Button
        type="link"
        className="flex self-center text-[1.5rem] font-bold text-[#2966F2] cursor-pointer"
        onClick={() => defaultNavigatePage && navigate(defaultNavigatePage)}
      >
        暫無權限，請點擊跳轉默認頁面
      </Button>
    </div>
  );
};
