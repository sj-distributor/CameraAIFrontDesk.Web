import { useEffect, useRef, useState } from "react";

import { ScreenType } from "@/entity/screen-type";

export const useAction = () => {
  const optionsLabel = {
    [ScreenType.FourScreen]: "四屏模式",
    [ScreenType.SixScreen]: "六屏模式",
    [ScreenType.NineScreen]: "九屏模式",
  };

  const options = [
    {
      label: optionsLabel[ScreenType.FourScreen],
      value: ScreenType.FourScreen,
    },
    {
      label: optionsLabel[ScreenType.SixScreen],
      value: ScreenType.SixScreen,
    },
    {
      label: optionsLabel[ScreenType.NineScreen],
      value: ScreenType.NineScreen,
    },
  ];

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isShowOption, setIsShowOption] = useState<boolean>(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsShowOption(false);
      }
    }

    // 绑定监听器
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // 解绑监听器
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return { options, isShowOption, wrapperRef, optionsLabel, setIsShowOption };
};
