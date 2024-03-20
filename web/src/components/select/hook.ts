import { useEffect, useRef, useState } from "react";

import { IStatusType } from "@/services/dtos/default";

const options = [
  {
    label: "全部",
    value: IStatusType.All,
  },
  {
    label: "待標記",
    value: IStatusType.Unmarked,
  },
  {
    label: "通過",
    value: IStatusType.Verifed,
  },
  {
    label: "異常",
    value: IStatusType.Exception,
  },
];

export const useAction = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectValueText = (value: IStatusType) => {
    switch (value) {
      case IStatusType.All:
        return "全部";
      case IStatusType.Unmarked:
        return "待標記";
      case IStatusType.Verifed:
        return "通過";
      case IStatusType.Exception:
        return "異常";
      default:
        return "請選擇";
    }
  };

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
    isOpen,
    wrapperRef,
    options,
    toggleDropdown,
    selectValueText,
  };
};
