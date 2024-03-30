import { useContext, useEffect, useState } from "react";

import {
  IPageDto,
  IRecordRequest,
  IRecordResponse,
  IStatusType,
} from "@/dtos/default";
import { useAuth } from "@/hooks/use-auth";
import { GetRecordList } from "@/services/default";

import { WarningSearchDataContext } from "../..";

interface IDto extends IPageDto, IRecordResponse {
  loading: boolean;
}

export const useAction = () => {
  const { status, selectValues, timeDto, searchKeyWord } = useContext(
    WarningSearchDataContext
  );

  const { navigate, t } = useAuth();

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

  const onChangePage = (page: number, pageSize: number) => {
    updateData("PageIndex", page);
    updateData("PageSize", pageSize);
    loadData();
  };

  useEffect(() => {
    updateData("PageIndex", 1);
    loadData();
  }, [status, selectValues, timeDto, searchKeyWord]);

  return {
    t,
    dto,
    navigate,
    handleScroll,
    onChangePage,
  };
};
