import { useContext, useEffect, useState } from "react";

import {
  IPageDto,
  IRecordRequest,
  IRecordResponse,
  IStatusType,
} from "@/dtos/default";
import { GetRecordList } from "@/services/default";

import { FeedbackSearchDataContext } from "../..";
import { useAuth } from "@/hooks/use-auth";

interface IDto extends IPageDto, IRecordResponse {
  loading: boolean;
}

export const useAction = () => {
  const { t, navigate } = useAuth();

  const { selectValues, timeDto } = useContext(FeedbackSearchDataContext);

  const [dto, setDto] = useState<IDto>({
    PageIndex: 1,
    PageSize: 10,
    count: 0,
    records: [],
    loading: false,
  });

  const updateData = (k: keyof IDto, v: any) => {
    setDto((prev) => ({
      ...prev,
      [k]: v,
    }));
  };

  const getRequestPrams = () => {
    const data: IRecordRequest = {
      PageIndex: dto.PageIndex,
      PageSize: dto.PageSize,
      Status: IStatusType.Exception,
    };

    if (timeDto.startTime && timeDto.endTime) {
      data.StartTime = timeDto.startTime as string;
      data.EndTime = timeDto.endTime as string;
    }

    if (selectValues.length > 0) {
      data.MonitorTypes = selectValues;
    }

    return data;
  };

  const loadData = async () => {
    updateData("loading", true);

    const data = getRequestPrams();

    const { count, records } = await GetRecordList(data);

    updateData("records", records ?? []);
    updateData("count", count ?? 0);
    updateData("loading", false);
  };

  const handleScroll = () => {
    const e = new Event("resize");
    window.dispatchEvent(e);
  };

  useEffect(() => {
    loadData();
  }, [dto.PageIndex, dto.PageSize, selectValues, timeDto]);

  return { t, dto, updateData, handleScroll, navigate };
};
