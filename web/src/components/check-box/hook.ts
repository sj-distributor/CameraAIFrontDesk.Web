import { useEffect, useRef, useState } from "react";

import { ICameraAiMonitorType } from "@/dtos/default";

import { useAuth } from "@/hooks/use-auth";

import KEYS from "@/i18n/keys/alert-list";

// import { useTypeList } from "@/hooks/hook";

export const useAction = () => {
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
      label: t(KEYS.SECURITY, { ns: "alertList" }),
      value: ICameraAiMonitorType.Security,
    },
  ];

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
    toggleDropdown,
  };
};
