import { useDebounceEffect, useUpdateEffect } from "ahooks";
import { Dayjs } from "dayjs";
import { clone } from "ramda";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { ICameraAiMonitorType } from "@/dtos/default";
import { IWarningType } from "@/components/warning-select/props";

export const useAction = () => {
  const { t } = useAuth();

  const replayHeaderRef = useRef<HTMLDivElement>(null);

  const warningSelectRef = useRef({
    selectValues: [],
    checkIndex: [],
    setSelectValues: (_: ICameraAiMonitorType[]) => {},
    setCheckIndex: (_: IWarningType[]) => {},
  });

  const { location } = useAuth();

  const [timeDto, setTimeDto] = useState<{
    startTime: null | string | Dayjs;
    endTime: null | string | Dayjs;
  }>({
    startTime: null,
    endTime: null,
  });

  const [lastSelectValues, setLastSelectValues] = useState<
    ICameraAiMonitorType[]
  >([]);

  const [lastCheckIndex, setLastCheckIndex] = useState<IWarningType[]>([]);

  const [keyWord, setKeyWord] = useState<string>("");

  const [searchKeyWord, setSearchKeyWord] = useState<string>("");

  const [height, setHeight] = useState<number | null>(null);

  const getHeight = () => {
    if (replayHeaderRef.current) {
      setHeight(
        document.body.clientHeight -
          64 -
          replayHeaderRef.current?.clientHeight -
          40 - // 1.25rem * 2
          16 - // space-y-4
          8 <
          200
          ? 200
          : document.body.clientHeight -
              64 -
              replayHeaderRef.current?.clientHeight -
              40 - // 1.25rem * 2
              16 - // space-y-4
              8
      );
    }
  };

  useEffect(() => {
    getHeight();

    window.addEventListener("resize", getHeight);

    return () => {
      window.removeEventListener("resize", getHeight);
    };
  }, []);

  useDebounceEffect(
    () => {
      setSearchKeyWord(keyWord);
    },
    [keyWord],
    {
      wait: 1000,
    }
  );

  return {
    height,
    keyWord,
    timeDto,
    location,
    replayHeaderRef,
    lastSelectValues,
    searchKeyWord,
    t,
    warningSelectRef,
    lastCheckIndex,
    setLastSelectValues,
    setKeyWord,
    setTimeDto,
    setLastCheckIndex,
  };
};
