import { useContext, useEffect, useRef, useState } from "react";

import {
  IPageDto,
  IRecordRequest,
  IRecordResponse,
  IStatusType,
} from "@/dtos/default";
import { useAuth } from "@/hooks/use-auth";
import { GetRecordList } from "@/services/default";
import { useUpdateEffect } from "ahooks";

import { WarningSearchDataContext } from "../..";
import { App } from "antd";

interface IDto extends IPageDto, IRecordResponse {
  loading: boolean;
}

export const useAction = () => {
  const { message } = App.useApp();

  const { status, selectValues, timeDto, searchKeyWord } = useContext(
    WarningSearchDataContext
  );

  const { navigate, t, pagePermission, currentTeam } = useAuth();

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

  const isStopLoadingList = useRef<boolean>(false);

  const isFirstLoad = useRef<boolean>(true);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadWarningData = async (
    pageIndex: number,
    pageSize: number,
    startTime?: string,
    endTime?: string,
    status?: IStatusType,
    searchKeyWord?: string,
    selectValues?: number[]
  ) => {
    if (isStopLoadingList.current) return;

    if (!currentTeam.id) {
      message.error("TeamId not found！");
      return;
    }

    const data: IRecordRequest = {
      PageIndex: pageIndex,
      PageSize: pageSize,
      TeamId: currentTeam.id,
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

    isFirstLoad.current && updateData("loading", true);

    try {
      const { count, records } = (await GetRecordList(data)) || {};
      updateData("records", records);
      updateData("count", count);

      isFirstLoad.current = false;

      timeoutRef.current = setTimeout(
        () =>
          loadWarningData(
            data.PageIndex,
            data.PageSize,
            data.StartTime,
            data.EndTime,
            data.Status,
            data.EquipmentName,
            data.MonitorTypes
          ),
        5000
      );
    } catch {
      message.error("获取数据失败");
      updateData("records", []);
      updateData("count", 0);
    } finally {
      updateData("PageIndex", data.PageIndex);
      updateData("PageSize", data.PageSize);
      updateData("loading", false);
    }
  };

  useEffect(() => {
    loadWarningData(dto.PageIndex, dto.PageSize);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      isStopLoadingList.current = true;
    };
  }, []);

  const onChangePage = (pageIndex: number, pageSize: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    isFirstLoad.current = true;

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

  useUpdateEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    isFirstLoad.current = true;

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
