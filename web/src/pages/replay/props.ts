import { Dayjs } from "dayjs";

export interface IReplaySearchDataContext {
  selectValues: number[];
  timeDto: {
    startTime: null | string | Dayjs;
    endTime: null | string | Dayjs;
  };
  searchKeyWord: string;
}
