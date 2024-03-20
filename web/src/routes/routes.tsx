import "dayjs/locale/zh-cn";

import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { Feedback } from "@/pages/feedback";
import { FeedbackList } from "@/pages/feedback/component/feedback-list";
import { Home } from "@/pages/home";
import { Monitoring } from "@/pages/monitoring";
import { AreaItem } from "@/pages/monitoring/component/area-item";
import { AreaList } from "@/pages/monitoring/component/area-list";
// import { Equipment as MonitoringEquipment } from "@/pages/monitoring/component/equipment";
import { FullScreen } from "@/pages/monitoring/component/full-screen";
import { MultiScreen } from "@/pages/monitoring/component/multi-screen";
import { Replay } from "@/pages/replay";
import { Equipment as ReplayEquipment } from "@/pages/replay/component/equipment";
import { ReplayList } from "@/pages/replay/component/replay-list";
import { Warning } from "@/pages/warning";
import { Equipment as WarningEquipment } from "@/pages/warning/component/equipment";
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
    path: "/monitoring",
    element: <Monitoring />,
    icon: "",
    children: [
      {
        path: "",
        element: <Navigate to="/monitoring/list" />,
      },
      {
        // 区域s
        path: "/monitoring/list",
        element: <AreaList />,
      },
      {
        // 设备s
        // path: "/monitoring/:areaId",
        // ?areaId areaName
        path: "/monitoring/:areaId",
        element: <AreaItem />,
      },
      // {
      //   // 视频
      //   // ?areaId ?equipmentId areaName screen
      //   path: "/monitoring/:areaId/:equipmentId",
      //   element: <MonitoringEquipment />,
      // },

      {
        // 全屏
        path: "/monitoring/:areaId/:equipmentId",
        element: <FullScreen />,
      },
      {
        // 多屏
        path: "/monitoring/:areaId/multi-screen",
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
        element: <WarningEquipment />,
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
];
