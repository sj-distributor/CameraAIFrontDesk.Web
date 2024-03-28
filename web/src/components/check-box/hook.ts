import { useEffect, useRef, useState } from "react";

import { ICameraAiMonitorType } from "@/dtos/default";

// import { useTypeList } from "@/hooks/hook";
export const typeList = [
  {
    label: "識別人員",
    value: ICameraAiMonitorType.People,
  },
  {
    label: "識別車輛",
    value: ICameraAiMonitorType.Vehicles,
  },
  {
    label: "識別異常車輛",
    value: ICameraAiMonitorType.AbnormalVehicles,
  },
];

export const useAction = () => {
  // const { typeList } = useTypeList();

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
    wrapperRef,
    isOpen,
    typeList,
    toggleDropdown,
  };
};
