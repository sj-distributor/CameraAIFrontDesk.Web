import { useDebounceEffect, useDebounceFn } from "ahooks";
import dayjs, { Dayjs } from "dayjs";
import { clone } from "ramda";
import { useEffect, useRef, useState } from "react";

import { IRecordRequest, IStatusType } from "@/dtos/default";
import { IRegisterRecordRequest } from "@/dtos/warning";
import { useAuth } from "@/hooks/use-auth";
import { GetRecordList } from "@/services/default";
import { PostRegisterRecord } from "@/services/warning";
import { onDownLoadWorkbook } from "@/utils";

interface IKey {
  equipmentName: string;
  monitorTypeName: string;
  monitorContent: string;
  recordStatus: string;
  occurrenceTime: string;
  monitorDuration: string;
}

const keyName: IKey = {
  equipmentName: "設備名稱",
  monitorTypeName: "預警類型",
  monitorContent: "預警內容",
  recordStatus: "狀態",
  occurrenceTime: "開始時間",
  monitorDuration: "持續時間",
};

export const useAction = () => {
  const { location, message, t, pagePermission, currentTeam } = useAuth();

  const state = location.state as {
    status: IStatusType;
  };

  const warningHeaderRef = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState<number | null>(null);

  const [status, setStatus] = useState<IStatusType>(IStatusType.All);

  const [markedStatus, setMarkedStatus] = useState<IStatusType>(
    IStatusType.All
  );

  const [selectValues, setSelectValues] = useState<number[]>([]);

  const [markModelDto, setMarkModelDto] = useState<{
    open: boolean;
    status: IStatusType | null;
    exceptionReason: string;
    recordid: number | null;
  }>({
    open: false,
    status: null,
    exceptionReason: "",
    recordid: null,
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

      const isExist = newData.findIndex((item) => item === id) !== -1;

      if (isExist) newData = newData.filter((item) => item !== id);
      else newData.push(id);

      return newData;
    });
  };

  // 动物、安全配备 细分小项（后端没支持）
  // const onTypeClick = (id: number, childId?: number[]) => {
  //   setSelectValues((prev) => {
  //     let newData = clone(prev);

  //     const animalData = [
  //       ICameraAiMonitorType.Cat,
  //       ICameraAiMonitorType.Dog,
  //       ICameraAiMonitorType.Bird,
  //     ];

  //     const costumeData = [
  //       ICameraAiMonitorType.FluorescentClothing,
  //       ICameraAiMonitorType.Gloves,
  //       ICameraAiMonitorType.SafetyShoes,
  //     ];

  //     if (childId) {
  //       if (id === ICameraAiMonitorType.Costume) {
  //         newData = newData.filter((value) => !costumeData.includes(value));
  //       }

  //       if (id === ICameraAiMonitorType.Animal) {
  //         newData = newData.filter((value) => !animalData.includes(value));
  //       }

  //       newData = newData.concat(childId);

  //       newData.push(id);

  //       if (!childId.length) {
  //         newData = newData.filter((value) => value !== id);
  //       }

  //       newData = newData.filter(
  //         (value, index, self) => self.indexOf(value) === index
  //       );
  //     } else {
  //       if (id === ICameraAiMonitorType.Animal) {
  //         newData = newData.concat(animalData);
  //       }

  //       if (id === ICameraAiMonitorType.Costume) {
  //         newData = newData.concat(costumeData);
  //       }

  //       const isExist = newData.findIndex((item) => item === id) !== -1;

  //       if (isExist) {
  //         newData = newData.filter((item) => item !== id);

  //         if (id === ICameraAiMonitorType.Animal) {
  //           newData = newData.filter((value) => !animalData.includes(value));
  //         }

  //         if (id === ICameraAiMonitorType.Costume) {
  //           newData = newData.filter((value) => !costumeData.includes(value));
  //         }
  //       } else newData.push(id);
  //     }

  //     return newData;
  //   });
  // };

  const getHeight = () => {
    if (warningHeaderRef.current) {
      setHeight(
        document.body.clientHeight -
          64 -
          warningHeaderRef.current?.clientHeight -
          40 - // 1.25rem * 2
          4 - // space-y-1
          8 <
          200
          ? 200
          : document.body.clientHeight -
              64 -
              warningHeaderRef.current?.clientHeight -
              40 - // 1.25rem * 2
              4 - // space-y-1
              8
      );
    }
  };

  // 导出最大数字 2147483647
  const exportData = async () => {
    if (!currentTeam.id) {
      message.error("TeamId not found！");
      return;
    }

    const data: IRecordRequest = {
      PageIndex: 1,
      PageSize: 2147483647,
      TeamId: currentTeam.id,
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

    const { records } = await GetRecordList(data);

    const newData = clone(records);

    if (newData.length > 0) {
      const column = newData.map((item) => ({
        equipmentName: item.equipmentName,
        monitorTypeName: item.monitorTypeName,
        monitorContent: `${item.equipmentName},${item.monitorTypeName}（${item.name}）出現超過 ${item.settingDuration} 秒`,
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
        monitorDuration: item.monitorDuration
          ? String(Math.floor(item.monitorDuration / 60)).padStart(2, "0") +
            "m" +
            (item.monitorDuration % 60 !== 0
              ? String(item.monitorDuration % 60).padStart(2, "0") + "s"
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

  const getParams = () => {
    const data: IRegisterRecordRequest = {
      recordId: markModelDto.recordid ?? 0,
      recordStatus: markModelDto.status ?? IStatusType.Exception,
    };

    if (data.recordStatus === IStatusType.Exception) {
      data.exceptionReason = markModelDto.exceptionReason;
    }

    return data;
  };

  const markRecord = () => {
    setMarkedStatus(markModelDto.status as IStatusType);

    const data = getParams();

    if (
      data.recordStatus >= IStatusType.Verifed ||
      (data.recordStatus === IStatusType.Exception && !data.exceptionReason)
    ) {
      PostRegisterRecord(data)
        .then(() => {
          message.success("標記成功!");
          setMarkModelDto((prev) => ({
            ...prev,
            open: false,
          }));
        })
        .catch(() => {
          message.error("標記失敗!");
        });
    } else {
      message.warning("請輸入完整的標記信息!");
    }
  };

  const { run: handleOnMarkDebounceFn } = useDebounceFn(markRecord, {
    wait: 300,
  });

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
    if (location.pathname !== "/warning/list") {
      setMarkedStatus(
        state && (state.status !== null || state.status !== undefined)
          ? state.status
          : IStatusType.All
      );

      setMarkModelDto((prev) => ({
        ...prev,
        recordid: location.pathname.split("/").filter((item) => item != "")[1]
          ? Number(location.pathname.split("/").filter((item) => item != "")[1])
          : 0,
      }));

      setMarkModelDto((prev) => ({
        ...prev,
        status:
          state && (state.status !== null || state.status !== undefined)
            ? state.status
            : null,
      }));
    }
  }, [location.pathname]);

  return {
    t,
    status,
    height,
    timeDto,
    keyWord,
    location,
    selectValues,
    searchKeyWord,
    warningHeaderRef,
    markModelDto,
    handleOnMarkDebounceFn,
    handleOnExportDebounceFn,
    markedStatus,
    pagePermission,
    setTimeDto,
    setKeyWord,
    onTypeClick,
    onStatusClick,
    setMarkModelDto,
  };
};
