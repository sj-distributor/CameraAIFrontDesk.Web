import { useContext, useEffect, useState } from "react";

import {
  IPageDto,
  IRecordRequest,
  IRecordResponse,
  IStatusType,
} from "@/dtos/default";
import { GetRecordList } from "@/services/default";

import { FeedbackSearchDataContext } from "../..";

interface IDto extends IPageDto, IRecordResponse {
  loading: boolean;
}

export const useAction = () => {
  const { selectValues, timeDto } = useContext(FeedbackSearchDataContext);

  const [height, setHeight] = useState<number | null>(null);

  const [isShowQuickJumper, setIsShowQuickJumper] = useState<boolean>(false);

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

  const getHeight = () => {
    setHeight(
      (document.getElementById("feedback-box")?.scrollHeight ?? 0) -
        20 -
        (dto.records.length > 0 ? 24 + 32 : 0) -
        (document.getElementsByClassName("ant-table-thead")[0]?.clientHeight ??
          0)
    );
  };

  const getWidth = () => {
    setIsShowQuickJumper(document.body.clientWidth > 800 ? true : false);
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

  useEffect(() => {
    getHeight();
    window.addEventListener("resize", getHeight);

    return window.removeEventListener("reset", getHeight);
  }, [dto.records]);

  useEffect(() => {
    getWidth();
    window.addEventListener("resize", getWidth);

    return window.removeEventListener("reset", getWidth);
  }, []);

  useEffect(() => {
    loadData();
  }, [dto.PageIndex, dto.PageSize, selectValues, timeDto]);

  return { height, dto, isShowQuickJumper, updateData };
};
