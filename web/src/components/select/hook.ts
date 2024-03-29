import { useEffect, useRef, useState } from "react";

import { IStatusType } from "@/dtos/default";

import KEYS from "@/i18n/keys/alert-list";
import { useAuth } from "@/hooks/use-auth";

export const useAction = () => {
  const { t } = useAuth();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const options = [
    {
      label: t(KEYS.ALL, { ns: "alertList" }),
      value: IStatusType.All,
    },
    {
      label: t(KEYS.UN_MARKED, { ns: "alertList" }),
      value: IStatusType.Unmarked,
    },
    {
      label: t(KEYS.VERIFED, { ns: "alertList" }),
      value: IStatusType.Verifed,
    },
    {
      label: t(KEYS.EXCEPTION, { ns: "alertList" }),
      value: IStatusType.Exception,
    },
  ];

  const selectValueText = (value: IStatusType) => {
    switch (value) {
      case IStatusType.All:
        return t(KEYS.ALL, { ns: "alertList" });
      case IStatusType.Unmarked:
        return t(KEYS.UN_MARKED, { ns: "alertList" });
      case IStatusType.Verifed:
        return t(KEYS.VERIFED, { ns: "alertList" });
      case IStatusType.Exception:
        return t(KEYS.EXCEPTION, { ns: "alertList" });
      default:
        return "请选择";
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
