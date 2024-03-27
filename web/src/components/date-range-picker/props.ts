import dayjs, { Dayjs } from "dayjs";
import { SetStateAction } from "react";

export interface IRangePickerProps {
  timeDto: {
    startTime: string | Dayjs | null;
    endTime: string | Dayjs | null;
  };
  setTimeDto: (
    value: SetStateAction<{
      startTime: string | dayjs.Dayjs | null;
      endTime: string | dayjs.Dayjs | null;
    }>
  ) => void;
}
