import { UserOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Input } from "antd";

import { useAction } from "./hook";

export const Login = () => {
  const { userInfo, onLogin, updateUserInfo } = useAction();

  return (
    <div className="w-screen h-screen bg-[#2866F1] flex justify-end md:justify-normal">
      <div className="w-3/5 h-full">
        <img
          src="/src/assets/login.png"
          alt=""
          className="w-full h-full bg-cover"
        />
      </div>
      <div className="w-2/5 bg-white rounded-l-3xl box-border sm:px-8 lg:px-[5.5rem] xl:px-24 2xl:px-38 flex flex-col justify-center space-y-4">
        <strong className="text-3xl">Welcome,</strong>
        <Input
          placeholder="Basic usage"
          size="large"
          prefix={<UserOutlined />}
          value={userInfo.user}
          onChange={(e) => updateUserInfo("user", e.target.value)}
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
            onClick={onLogin}
          >
            登陸
          </Button>
        </ConfigProvider>
      </div>
    </div>
  );
};
