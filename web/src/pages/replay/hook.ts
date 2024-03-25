import { useDebounceEffect } from "ahooks";
import { Dayjs } from "dayjs";
import { clone } from "ramda";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/use-auth";

export const useAction = () => {
  const replayHeaderRef = useRef<HTMLDivElement>(null);

  const { location } = useAuth();

  const [timeDto, setTimeDto] = useState<{
    startTime: null | string | Dayjs;
    endTime: null | string | Dayjs;
  }>({
    startTime: null,
    endTime: null,
  });

  const [selectValues, setSelectValues] = useState<string[]>([]);

  const [keyWord, setKeyWord] = useState<string>("");

  const [searchKeyWord, setSearchKeyWord] = useState<string>("");

  const [height, setHeight] = useState<number | null>(null);

  const onTypeClick = (id: number) => {
    setSelectValues((prev) => {
      let newData = clone(prev);

      const isExist = newData.findIndex((item) => Number(item) === id) !== -1;

      if (isExist) newData = newData.filter((item) => Number(item) !== id);
      else newData.push(id.toString());

      return newData;
    });
  };

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
    selectValues,
    searchKeyWord,
    setKeyWord,
    onTypeClick,
    setTimeDto,
  };
};
