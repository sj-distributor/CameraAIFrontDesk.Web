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
      label: "識別吸煙",
      value: ICameraAiMonitorType.Smoke,
    },
    {
      label: "識別打架",
      value: ICameraAiMonitorType.Fight,
    },
    {
      label: "識別安全配備",
      value: ICameraAiMonitorType.Costume,
    },
  ];

  const animalList = [
    {
      label: "猫",
      value: ICameraAiMonitorType.Cat,
    },
    {
      label: "狗",
      value: ICameraAiMonitorType.Dog,
    },
    {
      label: "鸟",
      value: ICameraAiMonitorType.Bird,
    },
  ];

  const costumeList = [
    {
      label: "螢光衣",
      value: ICameraAiMonitorType.FluorescentClothing,
    },
    {
      label: "手套",
      value: ICameraAiMonitorType.Gloves,
    },
    {
      label: "安全鞋",
      value: ICameraAiMonitorType.SafetyShoes,
    },
  ];

  const animalList = [
    {
      label: "猫",
      value: ICameraAiMonitorType.Cat,
    },
    {
      label: "狗",
      value: ICameraAiMonitorType.Dog,
    },
    {
      label: "鸟",
      value: ICameraAiMonitorType.Bird,
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
