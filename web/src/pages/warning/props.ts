import { Dayjs } from "dayjs";

import { IStatusType } from "@/dtos/default";

export interface IWarningSearchDataContext {
  status: IStatusType;
  selectValues: number[];
  timeDto: {
    startTime: null | string | Dayjs;
    endTime: null | string | Dayjs;
  };
  searchKeyWord: string;
}
