import { useContext, useEffect, useState } from "react";

import { GetRecordList } from "@/services/api/default";
import {
  IPageDto,
  IRecordRequest,
  IRecordResponse,
  IStatusType,
} from "@/services/dtos/default";

import { WarningSearchDataContext } from "../..";

interface IDto extends IPageDto, IRecordResponse {
  loading: boolean;
}

export const useAction = () => {
  const { status, selectValues, timeDto, searchKeyWord } = useContext(
    WarningSearchDataContext
  );

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

  const getWidth = () => {
    setIsShowQuickJumper(document.body.clientWidth > 800 ? true : false);
  };

  const getHeight = () => {
    setHeight(
      (document.getElementById("warning-box")?.scrollHeight ?? 0) -
        20 -
        (dto.records.length > 0 ? 24 + 32 : 0) -
        (document.getElementsByClassName("ant-table-thead")[0]?.clientHeight ??
          0)
    );
  };

  const getRequestPrams = (pageIndex?: number, pageSize?: number) => {
    const data: IRecordRequest = {
      PageIndex: pageIndex ?? dto.PageIndex,
      PageSize: pageSize ?? dto.PageSize,
    };

    if (timeDto.startTime && timeDto.endTime) {
      data.StartTime = timeDto.startTime as string;
      data.EndTime = timeDto.endTime as string;
    }

    if (status !== IStatusType.All) {
      data.Status = status;
    }

    if (searchKeyWord) {
      data.EquipmentName = searchKeyWord;
    }

    if (selectValues.length > 0) {
      data.MonitorTypeIds = selectValues;
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
  }, [
    dto.PageIndex,
    dto.PageSize,
    status,
    selectValues,
    timeDto,
    searchKeyWord,
  ]);

  return {
    height,
    dto,
    isShowQuickJumper,
    updateData,
  };
};
