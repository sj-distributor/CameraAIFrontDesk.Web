import "dayjs/locale/zh-cn";

import { ConfigProvider } from "antd";
import { ReactElement, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

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
import { Door } from "@/pages/door";
import { InoutRegistration } from "@/pages/inout-registration";
import { CameraBackstage } from "@/pages/camera-backstage";

export interface IRouteItem {
  path: string;
  element: ReactElement;
  icon?: string;
  children?: IRouteItem[];
}

export const Router = () => {
  const { locale } = useAuth();

  const location = useLocation();

  useEffect(() => {
    const handleTokenRefresh = (token: string, userName: string) => {
      if (window.$wujie?.props) {
        window.$wujie.props.token = token;
        window.$wujie.props.userName = userName;
      }
    };

    const registerListener = () => {
      if (window.$wujie?.bus) {
        window.$wujie.bus.$on("token_refresh", handleTokenRefresh);
      } else {
        console.log("Wujie bus 未初始化");
      }
    };

    registerListener();

    return () => {
      if (window.$wujie?.bus) {
        window.$wujie.bus.$off("token_refresh", handleTokenRefresh);
      }
    };
  }, []);

  const routers: IRouteItem[] = [
    {
      path: "/home",
      element: <Home key={location.key} />,
      icon: "",
    },
    {
      // 实时
      path: "/monitor",
      element: <Monitor key={location.key} />,
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
      element: <Replay key={location.key} />,
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
      element: <Warning key={location.key} />,
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
      element: <Feedback key={location.key} />,
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
    // 出入口检测
    {
      path: "/door",
      element: <Door />,
      icon: "",
    },
    // 进入登记
    {
      path: "/inout",
      element: <InoutRegistration />,
      icon: "",
    },
    {
      path: "/none",
      element: <None />,
      icon: "",
    },
  ];

  return (
    <ConfigProvider locale={locale}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to={"/home"} />} />
        <Route
          path="/backstage"
          element={
            <AuthStatus>
              <CameraBackstage />
            </AuthStatus>
          }
        />
        <Route
          element={
            <AuthStatus>
              <Main />
            </AuthStatus>
          }
        >
          {routers.map((item, index) => {
            return (
              <Route key={index} path={item.path} element={item.element}>
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
