import "dayjs/locale/zh-cn";

import { ConfigProvider } from "antd";
import { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AuthStatus } from "@/hooks/auth-status";
import { useAuth } from "@/hooks/use-auth";
import { Feedback } from "@/pages/feedback";
import { FeedbackList } from "@/pages/feedback/component/feedback-list";
import { Home } from "@/pages/home";
import { Login } from "@/pages/login";
import { Main } from "@/pages/main";
import { Monitor } from "@/pages/monitor";
import { AreaItem } from "@/pages/monitor/component/area-item";
import { AreaList } from "@/pages/monitor/component/area-list";
import { FullScreen } from "@/pages/monitor/component/full-screen";
import { MultiScreen } from "@/pages/monitor/component/multi-screen";
import { None } from "@/pages/none";
import { Replay } from "@/pages/replay";
import { Equipment as ReplayEquipment } from "@/pages/replay/component/equipment";
import { ReplayList } from "@/pages/replay/component/replay-list";
import { Warning } from "@/pages/warning";
import { Equipment } from "@/pages/warning/component/equipment";
import { WarningList } from "@/pages/warning/component/warning-list";

export interface IRouteItem {
  path: string;
  element: ReactElement;
  icon?: string;
  children?: IRouteItem[];
}
export const routers: IRouteItem[] = [
  {
    path: "/home",
    element: <Home />,
    icon: "",
  },
  {
    // 实时
    path: "/monitor",
    element: <Monitor />,
    icon: "",
    children: [
      {
        path: "",
        element: <Navigate to="/monitor/list" />,
      },
      {
        // 区域s
        path: "/monitor/list",
        element: <AreaList />,
      },
      {
        // 设备s
        // path: "/monitoring/:areaId",
        path: "/monitor/:areaId",
        element: <AreaItem />,
      },
      {
        // 全屏
        path: "/monitor/:areaId/:equipmentId",
        element: <FullScreen />,
      },
      {
        // 多屏
        path: "/monitor/:areaId/multi-screen",
        element: <MultiScreen />,
      },
    ],
  },
  {
    // 回放
    path: "/replay",
    element: <Replay />,
    icon: "",
    children: [
      {
        path: "",
        element: <Navigate to="/replay/list" />,
      },
      {
        path: "/replay/list",
        element: <ReplayList />,
      },
      {
        path: "/replay/:equipmentId",
        element: <ReplayEquipment />,
      },
    ],
  },
  {
    path: "/warning",
    element: <Warning />,
    icon: "",
    children: [
      {
        path: "",
        element: <Navigate to="/warning/list" />,
      },
      {
        path: "/warning/list",
        element: <WarningList />,
      },
      {
        path: "/warning/:warningId",
        element: <Equipment />,
      },
    ],
  },
  {
    path: "/feedback",
    element: <Feedback />,
    icon: "",
    children: [
      {
        path: "",
        element: <Navigate to="/feedback/list" />,
      },
      {
        path: "/feedback/list",
        element: <FeedbackList />,
      },
    ],
  },
  {
    path: "/none",
    element: <None />,
    icon: "",
  },
];

export const Router = () => {
  const { locale } = useAuth();

  return (
    <ConfigProvider locale={locale}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to={"/home"} />} />
        <Route element={<Main />}>
          {routers.map((item, index) => {
            return (
              <Route
                key={index}
                path={item.path}
                element={<AuthStatus>{item.element}</AuthStatus>}
              >
                {item?.children?.map((childrenItem, childrenIndex) => {
                  return (
                    <Route
                      key={childrenIndex}
                      path={childrenItem.path}
                      element={childrenItem.element}
                    />
                  );
                })}
              </Route>
            );
          })}
        </Route>
      </Routes>
    </ConfigProvider>
  );
};
