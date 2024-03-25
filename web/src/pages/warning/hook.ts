import { useDebounceEffect, useDebounceFn } from "ahooks";
import dayjs, { Dayjs } from "dayjs";
import { clone } from "ramda";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { GetRecordList } from "@/services/api/default";
import { IRecordRequest, IStatusType } from "@/services/dtos/default";
import { onDownLoadWorkbook } from "@/utils";

interface IKey {
  equipmentName: string;
  monitorTypeName: string;
  monitorContent: string;
  recordStatus: string;
  occurrenceTime: string;
  settingDuration: string;
}

const keyName: IKey = {
  equipmentName: "設備名稱",
  monitorTypeName: "預警類型",
  monitorContent: "預警內容",
  recordStatus: "狀態",
  occurrenceTime: "開始時間",
  settingDuration: "持續時間",
};

export const useAction = () => {
  const { location, message } = useAuth();

  const warningHeaderRef = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState<number | null>(null);

  const [status, setStatus] = useState<IStatusType>(IStatusType.All);

  const [selectValues, setSelectValues] = useState<string[]>([]);

  const [isMark, setIsMark] = useState<boolean>(false);

  const [markModelDto, setMarkModelDto] = useState<{
    open: boolean;
    status: boolean;
    exceptionReason: string;
  }>({
    open: false,
    status: false,
    exceptionReason: "",
  });

  const [timeDto, setTimeDto] = useState<{
    startTime: null | string | Dayjs;
    endTime: null | string | Dayjs;
  }>({
    startTime: null,
    endTime: null,
  });

  const [keyWord, setKeyWord] = useState<string>("");

  const [searchKeyWord, setSearchKeyWord] = useState<string>("");

  const onStatusClick = (value: IStatusType) => {
    setStatus(value);
  };

  const onTypeClick = (id: number) => {
    setSelectValues((prev) => {
      let newData = clone(prev);

      const isExist = newData.findIndex((item) => Number(item) === id) !== -1;

      if (isExist) newData = newData.filter((item) => Number(item) !== id);
      else newData.push(id.toString());

      return newData;
    });
  };

  const getHeight = () => {
    if (warningHeaderRef.current) {
      setHeight(
        document.body.clientHeight -
          64 -
          warningHeaderRef.current?.clientHeight -
          40 - // 1.25rem * 2
          16 - // space-y-4
          8 <
          200
          ? 200
          : document.body.clientHeight -
              64 -
              warningHeaderRef.current?.clientHeight -
              40 - // 1.25rem * 2
              16 - // space-y-4
              8
      );
    }
  };

  // 导出最大数字 2147483647
  const exportData = async () => {
    const data: IRecordRequest = {
      PageIndex: 1,
      PageSize: 2147483647,
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

    const { records } = await GetRecordList(data);

    const newData = clone(records);

    if (newData.length > 0) {
      const column = newData.map((item) => ({
        equipmentName: item.equipmentName,
        monitorTypeName: item.monitorTypeName,
        monitorContent: `${item.equipmentName},${item.monitorTypeName}（${item.plateNumber}）出現超過 ${item.monitorDuration} 秒`,
        recordStatus:
          item.recordStatus === IStatusType.Unmarked
            ? "待標記"
            : item.recordStatus === IStatusType.Verifed
            ? "通過"
            : item.recordStatus === IStatusType.Exception
            ? "異常"
            : "",
        occurrenceTime: item.occurrenceTime
          ? dayjs(item.occurrenceTime).format("YYYY-MM-DD HH:mm:ss")
          : "",
        settingDuration: item.settingDuration
          ? String(item.settingDuration / 60).padStart(2, "0") +
            "m" +
            (item.settingDuration % 60 !== 0
              ? String(item.settingDuration % 60).padStart(2, "0") + "s"
              : "")
          : "",
      }));

      const header = Object.keys(column[0]).map((item) => ({
        title: keyName[item as keyof IKey],
        key: item,
        width: 200,
      }));

      onDownLoadWorkbook(header, column);
    } else {
      message.warning("暂无数据需要导出");
    }
  };

  const { run: handleOnExportDebounceFn } = useDebounceFn(exportData, {
    wait: 300,
  });

  useDebounceEffect(
    () => {
      setSearchKeyWord(keyWord);
    },
    [keyWord],
    {
      wait: 1000,
    }
  );

  useEffect(() => {
    getHeight();

    window.addEventListener("resize", getHeight);

    return () => {
      window.removeEventListener("resize", getHeight);
    };
  }, []);

  useEffect(() => {
    const state = location.state as {
      isMark: boolean;
    };

    if (state && (state.isMark !== null || state.isMark !== undefined)) {
      setIsMark(state.isMark);
    }
  }, [location.pathname]);

  return {
    isMark,
    status,
    height,
    timeDto,
    keyWord,
    location,
    selectValues,
    searchKeyWord,
    warningHeaderRef,
    markModelDto,
    handleOnExportDebounceFn,
    setTimeDto,
    setKeyWord,
    onTypeClick,
    onStatusClick,
    setMarkModelDto,
  };
};
