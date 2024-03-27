import { Dayjs } from "dayjs";

import { IStatusType } from "@/services/dtos/default";

export interface IWarningSearchDataContext {
  status: IStatusType;
  selectValues: string[];
  timeDto: {
    startTime: null | string | Dayjs;
    endTime: null | string | Dayjs;
  };
  searchKeyWord: string;
}
