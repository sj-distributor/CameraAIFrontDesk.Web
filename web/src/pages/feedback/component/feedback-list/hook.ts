import { useContext, useEffect, useState } from "react";
import { useUpdateEffect } from "ahooks";

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
  const { t, navigate, pagePermission } = useAuth();

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

  const handleScroll = () => {
    const e = new Event("resize");
    window.dispatchEvent(e);
  };

  const onChangePage = (pageIndex: number, pageSize: number) => {
    loadFeedbackData(
      pageIndex,
      pageSize,
      (timeDto.startTime as string) ?? "",
      (timeDto.endTime as string) ?? "",
      selectValues
    );
  };

  const loadFeedbackData = async (
    pageIndex: number,
    pageSize: number,
    startTime?: string,
    endTime?: string,
    selectValues?: number[]
  ) => {
    const data: IRecordRequest = {
      PageIndex: pageIndex,
      PageSize: pageSize,
      Status: IStatusType.Exception,
    };

    if (startTime && endTime) {
      data.StartTime = startTime as string;
      data.EndTime = endTime as string;
    }

    if (selectValues && selectValues.length > 0) {
      data.MonitorTypes = selectValues;
    }

    updateData("loading", true);

    const { count, records } = await GetRecordList(data);

    updateData("records", records ?? []);
    updateData("count", count ?? 0);
    updateData("PageIndex", data.PageIndex);
    updateData("PageSize", data.PageSize);
    updateData("loading", false);
  };

  useEffect(() => {
    loadFeedbackData(dto.PageIndex, dto.PageSize);
  }, []);

  useUpdateEffect(() => {
    loadFeedbackData(
      1,
      dto.PageSize,
      (timeDto.startTime as string) ?? "",
      (timeDto.endTime as string) ?? "",
      selectValues
    );
  }, [selectValues, timeDto]);

  return { t, dto, pagePermission, handleScroll, navigate, onChangePage };
};
