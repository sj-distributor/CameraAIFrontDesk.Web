import { Dayjs } from "dayjs";
import { useState } from "react";

import { IPageDto, IRecordResponse } from "@/services/dtos/default";

interface IDto extends IPageDto, IRecordResponse {
  loading: boolean;
  startTime: Dayjs | string | null;
  endTime: Dayjs | string | null;
  monitorTypeId: number;
}

export const useAction = () => {
  const [dto, setDto] = useState<IDto>({
    PageIndex: 1,
    PageSize: 20,
    count: 0,
    records: [],
    loading: false,
    monitorTypeId: 0,
  });

  const loadData = () => {};

  return { dto };
};
