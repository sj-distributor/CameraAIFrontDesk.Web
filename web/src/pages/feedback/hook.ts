import { Dayjs } from "dayjs";
import { clone } from "ramda";
import { useEffect, useRef, useState } from "react";

export const useAction = () => {
  const feedbackHeaderRef = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState<number | null>(null);

  const [selectValues, setSelectValues] = useState<string[]>([]);

  const [timeDto, setTimeDto] = useState<{
    startTime: null | string | Dayjs;
    endTime: null | string | Dayjs;
  }>({
    startTime: null,
    endTime: null,
  });

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
    if (feedbackHeaderRef.current) {
      setHeight(
        document.body.clientHeight -
          64 -
          feedbackHeaderRef.current?.clientHeight -
          40 - // 1.25rem * 2
          16 - // space-y-4
          8 <
          200
          ? 200
          : document.body.clientHeight -
              64 -
              feedbackHeaderRef.current?.clientHeight -
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

  return {
    feedbackHeaderRef,
    selectValues,
    timeDto,
    height,
    onTypeClick,
    setTimeDto,
  };
};
