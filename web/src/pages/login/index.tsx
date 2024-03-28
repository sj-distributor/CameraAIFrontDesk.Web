import { UserOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Input } from "antd";

import { useAction } from "./hook";

export const Login = () => {
  const { userInfo, loginLoading, handleOnLogin, updateUserInfo } = useAction();

  return (
    <div className="w-screen h-screen bg-[#2866F1] flex justify-end md:justify-normal">
      <div className="w-3/5 h-full hidden min-[1200px]:block">
        <img
          src="/src/assets/login.png"
          alt=""
          className="w-full h-full bg-cover img-no-darg"
        />
      </div>
      <div className="w-full min-[1200px]:w-2/5 lg:px-5 min-[1200px]:bg-white bg-[#2866F1] rounded-l-3xl box-border flex items-center justify-center relative">
        <div className="absolute flex min-[1200px]:hidden top-2 left-2 text-3xl text-white select-none">
          <strong>CAMERA AI</strong>
        </div>
        <div className="w-96 h-[440px] min-[1200px]:box-border box-content p-3 min-[1200px]:p-0 bg-white flex flex-col justify-center space-y-4 rounded-md min-[1200px]:rounded-none">
          <strong className="text-3xl select-none">Welcome,</strong>
          <Input
            placeholder="Basic usage"
            size="large"
            prefix={<UserOutlined />}
            value={userInfo.userName}
            onChange={(e) => updateUserInfo("userName", e.target.value)}
          />
          <Input.Password
            placeholder="Basic usage"
            size="large"
            prefix={<UserOutlined />}
            value={userInfo.password}
            onChange={(e) => updateUserInfo("password", e.target.value)}
          />
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#2866F1",
              },
            }}
          >
            <Button
              type="primary"
              size="large"
              className="bg-[#2866F1] text-white !rounded-full"
              onClick={handleOnLogin}
              loading={loginLoading}
            >
              登陸
            </Button>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};
