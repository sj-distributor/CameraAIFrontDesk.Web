import { useEffect, useRef, useState } from "react";

import { ICameraAiMonitorType } from "@/dtos/default";

import { useAuth } from "@/hooks/use-auth";

import KEYS from "@/i18n/keys/alert-list";

// import { useTypeList } from "@/hooks/hook";

export const useAction = (monitorSummary?: boolean) => {
  const { t } = useAuth();

  const typeList = [
    {
      label: t(KEYS.PEOPLE, { ns: "alertList" }),
      value: ICameraAiMonitorType.People,
    },
    {
      label: t(KEYS.VEHICLES, { ns: "alertList" }),
      value: ICameraAiMonitorType.Vehicles,
    },
    {
      label: t(KEYS.ABNORMALVEHICLES, { ns: "alertList" }),
      value: ICameraAiMonitorType.AbnormalVehicles,
    },
    {
      label: t(KEYS.ANIMAL, { ns: "alertList" }),
      value: ICameraAiMonitorType.Animal,
    },
    {
      label: t(KEYS.SMOKE, { ns: "alertList" }),
      value: ICameraAiMonitorType.Smoke,
    },
    {
      label: t(KEYS.FIGHT, { ns: "alertList" }),
      value: ICameraAiMonitorType.Fight,
    },
    {
      label: t(KEYS.COSTUME, { ns: "alertList" }),
      value: ICameraAiMonitorType.Costume,
    },
    {
      label: "觸摸二層貨物規範檢測",
      value: ICameraAiMonitorType.TouchGoods,
    },
    {
      label: "叉車熒光帶匹配檢測",
      value: ICameraAiMonitorType.Forklift,
    },
    {
      label: "識別地面水跡",
      value: ICameraAiMonitorType.FloorWater,
    },
    {
      label: "識別地面結冰",
      value: ICameraAiMonitorType.FloorIce,
    },
    {
      label: "安全門關閉檢測",
      value: ICameraAiMonitorType.DoorSafety,
    },
    {
      label: "卷簾門關閉檢測",
      value: ICameraAiMonitorType.DoorRolling,
    },
    {
      label: "進出時間登記",
      value: ICameraAiMonitorType.Attendance,
    },
  ];

  const securityItem = {
    label: t(KEYS.SECURITY, { ns: "alertList" }),
    value: ICameraAiMonitorType.Security,
  };

  const checkTypeList = monitorSummary ? [...typeList, securityItem] : typeList;

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // 绑定监听器
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // 解绑监听器
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return {
    t,
    wrapperRef,
    isOpen,
    typeList,
    checkTypeList,
    toggleDropdown,
  };
};
