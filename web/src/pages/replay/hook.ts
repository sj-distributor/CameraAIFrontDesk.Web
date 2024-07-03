import { useDebounceEffect, useUpdateEffect } from "ahooks";
import { Dayjs } from "dayjs";
import { clone } from "ramda";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { ICameraAiMonitorType } from "@/dtos/default";

export const useAction = () => {
  const { t } = useAuth();

  const replayHeaderRef = useRef<HTMLDivElement>(null);

  const { location } = useAuth();

  const [timeDto, setTimeDto] = useState<{
    startTime: null | string | Dayjs;
    endTime: null | string | Dayjs;
  }>({
    startTime: null,
    endTime: null,
  });

  const [selectValues, setSelectValues] = useState<number[]>([]);

  const [keyWord, setKeyWord] = useState<string>("");

  const [searchKeyWord, setSearchKeyWord] = useState<string>("");

  const [height, setHeight] = useState<number | null>(null);

  const onTypeClick = (id: number, childId?: number[]) => {
    setSelectValues((prev) => {
      let newData = clone(prev);

      const animalData = [
        ICameraAiMonitorType.Cat,
        ICameraAiMonitorType.Dog,
        ICameraAiMonitorType.Bird,
      ];

      if (childId) {
        newData = newData.filter((value) => !animalData.includes(value));

        newData = newData.concat(childId);

        newData.push(ICameraAiMonitorType.Animal);

        newData = newData.filter(
          (value, index, self) => self.indexOf(value) === index
        );
      } else {
        if (id === ICameraAiMonitorType.Animal) {
          newData = newData.concat(animalData);
        }

        const isExist = newData.findIndex((item) => item === id) !== -1;

        if (isExist) {
          newData = newData.filter((item) => item !== id);

          if (id === ICameraAiMonitorType.Animal) {
            newData = newData.filter((value) => !animalData.includes(value));
          }
        } else newData.push(id);
      }

      return newData;
    });
  };

  useUpdateEffect(() => {
    console.log(selectValues);
  }, [selectValues]);

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
    t,
    setKeyWord,
    onTypeClick,
    setTimeDto,
  };
};
