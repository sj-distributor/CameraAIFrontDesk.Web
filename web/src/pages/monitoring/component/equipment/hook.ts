import { useEffect, useState } from "react";

import { ScreenType } from "@/entity/screen-type";
import { useAuth } from "@/hooks/use-auth";

export const useAction = () => {
  const { parseQueryParams } = useAuth();

  const [layoutMode, setLayoutMode] = useState<ScreenType | null>(null);

  const updateLayoutMode = (value: any) => {
    setLayoutMode(value as ScreenType);
  };

  const [data, setData] = useState<string[]>([]);

  const updateData = (value: string[]) => {
    setData(value);
  };

  useEffect(() => {
    const object = parseQueryParams<{ screenNum: string; areaName: string }>();

    switch (object?.screenNum) {
      case "4":
        setLayoutMode(ScreenType.FourScreen);
        break;
      case "6":
        setLayoutMode(ScreenType.SixScreen);
        break;
      case "9":
        setLayoutMode(ScreenType.NineScreen);
        break;
      default:
        setLayoutMode(null);
        break;
    }
  }, []);

  return { layoutMode, data, updateLayoutMode, updateData };
};
