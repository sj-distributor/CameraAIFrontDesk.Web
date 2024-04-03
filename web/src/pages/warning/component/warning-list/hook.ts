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

  const { navigate, t, pagePermission } = useAuth();

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

  const loadWarningData = async (
    pageIndex: number,
    pageSize: number,
    startTime?: string,
    endTime?: string,
    status?: IStatusType,
    searchKeyWord?: string,
    selectValues?: number[]
  ) => {
    const data: IRecordRequest = {
      PageIndex: pageIndex,
      PageSize: pageSize,
    };

    if (startTime && endTime) {
      data.StartTime = startTime as string;
      data.EndTime = endTime as string;
    }

    if (status !== IStatusType.All) {
      data.Status = status;
    }

    if (searchKeyWord) {
      data.EquipmentName = searchKeyWord;
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
    loadWarningData(dto.PageIndex, dto.PageSize);
  }, []);

  const onChangePage = (pageIndex: number, pageSize: number) => {
    loadWarningData(
      pageIndex,
      pageSize,
      (timeDto.startTime as string) ?? "",
      (timeDto.endTime as string) ?? "",
      status,
      searchKeyWord,
      selectValues
    );
  };

  useEffect(() => {
    loadWarningData(
      1,
      dto.PageSize,
      (timeDto.startTime as string) ?? "",
      (timeDto.endTime as string) ?? "",
      status,
      searchKeyWord,
      selectValues
    );
  }, [status, selectValues, timeDto, searchKeyWord]);

  return {
    t,
    dto,
    pagePermission,
    navigate,
    handleScroll,
    onChangePage,
  };
};
