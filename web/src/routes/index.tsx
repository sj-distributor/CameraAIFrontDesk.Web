import { ConfigProvider } from "antd";
import { Navigate, Route, Routes } from "react-router-dom";

import { AuthStatus } from "@/hooks/auth-status";
import { useAuth } from "@/hooks/use-auth";
import { Demo } from "@/pages/demo";
import { Login } from "@/pages/login";
import { Main } from "@/pages/main";

import { IRouteItem, routers } from "./routes";

export const Router = () => {
  const { locale } = useAuth();

  const router = (routers: IRouteItem[]) => {
    return routers.map((item, index) => (
      <Route
        path={item.path}
        element={<AuthStatus>{item.element}</AuthStatus>}
        key={item.path + index}
      >
        {item.children && router(item.children)}
      </Route>
    ));
  };

  return (
    <ConfigProvider locale={locale}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Main />}>
          <Route path="/demo" element={<Demo />} />

          {router(routers)}
          <Route path="*" element={<Navigate to={"/home"} />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
};
