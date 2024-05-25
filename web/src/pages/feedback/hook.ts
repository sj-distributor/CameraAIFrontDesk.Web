import { useDebounceFn } from "ahooks";
import dayjs, { Dayjs } from "dayjs";
import { clone } from "ramda";
import { useEffect, useRef, useState } from "react";

import { IRecordRequest, IStatusType } from "@/dtos/default";
import { useAuth } from "@/hooks/use-auth";
import { GetRecordList } from "@/services/default";
import { onDownLoadWorkbook } from "@/utils";

interface IKey {
  equipmentName: string;
  monitorTypeName: string;
  monitorContent: string;
  exceptionReason: string;
  occurrenceTime: string;
  settingDuration: string;
}

const keyName: IKey = {
  equipmentName: "設備名稱",
  monitorTypeName: "預警類型",
  monitorContent: "預警內容",
  exceptionReason: "異常原因",
  occurrenceTime: "開始時間",
  settingDuration: "持續時間",
};

export const useAction = () => {
  const { t, message, pagePermission } = useAuth();

  const feedbackHeaderRef = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState<number | null>(null);

  const [selectValues, setSelectValues] = useState<number[]>([]);

  const [timeDto, setTimeDto] = useState<{
    startTime: null | string | Dayjs;
    endTime: null | string | Dayjs;
  }>({
    startTime: null,
    endTime: null,
  });

  const onTypeClick = (id: number) => {
    setSelectValues((prev) => {
      let newData = clone(prev);

      const isExist = newData.findIndex((item) => item === id) !== -1;

      if (isExist) newData = newData.filter((item) => item !== id);
      else newData.push(id);

      return newData;
    });
  };

  // 导出最大数字 2147483647
  const exportData = async () => {
    const data: IRecordRequest = {
      PageIndex: 1,
      PageSize: 2147483647,
      Status: IStatusType.Exception,
    };

    if (timeDto.startTime && timeDto.endTime) {
      data.StartTime = timeDto.startTime as string;
      data.EndTime = timeDto.endTime as string;
    }

    if (selectValues.length > 0) {
      data.MonitorTypes = selectValues;
    }

    const { records } = await GetRecordList(data);

    const newData = clone(records);

    if (newData.length > 0) {
      const column = newData.map((item) => ({
        equipmentName: item.equipmentName,
        monitorTypeName: item.monitorTypeName,
        monitorContent: `${item.equipmentName},${item.monitorTypeName}（${item.name}）出現超過 ${item.monitorDuration} 秒`,
        exceptionReason: item.exceptionReason,
        occurrenceTime: item.occurrenceTime
          ? dayjs(item.occurrenceTime).format("YYYY-MM-DD HH:mm:ss")
          : "",
        settingDuration: item.settingDuration
          ? String(Math.round(item.settingDuration / 60)).padStart(2, "0") +
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

  const getHeight = () => {
    if (feedbackHeaderRef.current) {
      setHeight(
        document.body.clientHeight -
          64 -
          feedbackHeaderRef.current?.clientHeight -
          40 - // 1.25rem * 2
          4 - // space-y-1
          8 <
          200
          ? 200
          : document.body.clientHeight -
              64 -
              feedbackHeaderRef.current?.clientHeight -
              40 - // 1.25rem * 2
              4 - // space-y-1
              8
      );
    }
  };

  useEffect(() => {
    getHeight();

    window.addEventListener("resize", getHeight);

    return () => {
      window.removeEventListener("resize", getHeight);
    };
  }, []);

  return {
    t,
    feedbackHeaderRef,
    selectValues,
    timeDto,
    height,
    handleOnExportDebounceFn,
    pagePermission,
    onTypeClick,
    setTimeDto,
  };
};
