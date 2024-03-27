import { Dayjs } from "dayjs";

export interface IFeedbackSearchDataContext {
  selectValues: string[];
  timeDto: {
    startTime: null | string | Dayjs;
    endTime: null | string | Dayjs;
  };
}
