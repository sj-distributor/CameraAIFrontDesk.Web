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
  ];

  const animalList = [
    {
      label: t(KEYS.ANIMAL, { ns: "alertList" }),
      value: ICameraAiMonitorType.Cat,
    },
    {
      label: t(KEYS.ANIMAL, { ns: "alertList" }),
      value: ICameraAiMonitorType.Dog,
    },
    {
      label: t(KEYS.ANIMAL, { ns: "alertList" }),
      value: ICameraAiMonitorType.Bird,
    },
  ];

  const costumeList = [
    {
      label: t(KEYS.FlUORESCENTCLOTHING, { ns: "alertList" }),
      value: ICameraAiMonitorType.FluorescentClothing,
    },
    {
      label: t(KEYS.GLOVES, { ns: "alertList" }),
      value: ICameraAiMonitorType.Gloves,
    },
    {
      label: t(KEYS.SAFETYSHOES, { ns: "alertList" }),
      value: ICameraAiMonitorType.SafetyShoes,
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

  const [selectAnimal, setSelectAnimal] = useState<ICameraAiMonitorType[]>([]);

  const [selectCostume, setSelectCostume] = useState<ICameraAiMonitorType[]>(
    []
  );

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
    animalList,
    selectAnimal,
    costumeList,
    selectCostume,
    setSelectCostume,
    setSelectAnimal,
  };
};
