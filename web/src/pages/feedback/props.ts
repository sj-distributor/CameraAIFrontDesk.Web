import { Dayjs } from "dayjs";

export interface IFeedbackSearchDataContext {
  selectValues: number[];
  timeDto: {
    startTime: null | string | Dayjs;
    endTime: null | string | Dayjs;
  };
}
