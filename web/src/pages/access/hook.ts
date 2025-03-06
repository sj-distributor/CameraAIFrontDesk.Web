import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { useDebounce, useDebounceFn, useMemoizedFn } from "ahooks";

import {
  AccessTypeEnum,
  AccessTypeLabel,
  IAccessDataProps,
  IAccessTableProps,
  IPaginationDtoProps,
  IShowPopoverProps,
} from "./props";
import { useAuth } from "@/hooks/use-auth";
import { KeysOf, ValuesOf } from "@/utils/type";
import { GetDoorListApi } from "@/services/access";

const initDoorData: IAccessDataProps = {
  count: 0,
  doors: [],
};

export const useAction = () => {
  const { message } = useAuth();

  const yesterday = dayjs().subtract(1, "day");

  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const [doorData, setDoorData] = useState<IAccessDataProps>(initDoorData);

  const [showPopover, setShowPopover] = useState<IShowPopoverProps>({
    accessTypeOpen: false,
    datePickerOpen: false,
    showCalendar: false,
  });

  const [paginationDto, setPaginationDto] = useState<IPaginationDtoProps>({
    PageIndex: 1,
    PageSize: 10,
    DoorType: AccessTypeEnum.All,
    CreatedDate: dayjs(),
    Keyword: "",
  });

  const updatePaginationDto = useMemoizedFn(
    (k: KeysOf<IPaginationDtoProps>, v: ValuesOf<IPaginationDtoProps>) => {
      setPaginationDto((prev) => ({
        ...prev,
        [k]: v,
      }));
    }
  );

  const updateShowPopover = useMemoizedFn(
    (k: KeysOf<IShowPopoverProps>, v: ValuesOf<IShowPopoverProps>) => {
      setShowPopover((prev) => ({
        ...prev,
        [k]: v,
      }));
    }
  );

  const { run: handleOnExportDebounceFn } = useDebounceFn(
    () => {
      const exportData =
        doorData.doors &&
        doorData.doors.map((item: IAccessTableProps) => ({
          出入口类型:
            item.doorType === AccessTypeEnum.Rolling
              ? AccessTypeLabel[AccessTypeEnum.Rolling]
              : AccessTypeLabel[AccessTypeEnum.Safety],
          出入口名称: item.doorName,
          开门次数: item.openCount,
          合计时长: item.totalOpenDuration,
          图片: item.previewUrl,
          更新時間: dayjs(item.createdDate).format("YYYY-MM-DD"),
        }));

      const ws = XLSX.utils.json_to_sheet(exportData);

      ws["!cols"] = [
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
      ];

      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "出入口檢測數據");

      XLSX.writeFile(wb, `出入口檢測數據.xlsx`);
    },
    {
      wait: 300,
    }
  );

  const { run: onSearchFn } = useDebounceFn(
    () => {
      paginationDto.PageIndex === 1
        ? getDoorList()
        : updatePaginationDto("PageIndex", 1);
    },
    { wait: 500 }
  );

  const searchValueDebounce = useDebounce(paginationDto.Keyword, {
    wait: 500,
  });

  const getDoorList = () => {
    setPageLoading(true);

    GetDoorListApi({
      ...paginationDto,
      DoorType:
        paginationDto.DoorType === AccessTypeEnum.All
          ? undefined
          : paginationDto.DoorType,
      Keyword: searchValueDebounce,
      CreatedDate: dayjs(paginationDto.CreatedDate).format("YYYY/MM/DD"),
    })
      .then((res) => {
        setDoorData(res ?? initDoorData);
      })
      .catch((err) => {
        setDoorData(initDoorData);

        message.error(`獲取出入口檢測數據失敗 ${err?.msg}`);
      })
      .finally(() => {
        setPageLoading(false);
      });
  };

  useEffect(() => {
    getDoorList();
  }, [paginationDto.PageIndex, paginationDto.PageSize]);

  return {
    doorData,
    onSearchFn,
    pageLoading,
    paginationDto,
    yesterday,
    showPopover,
    handleOnExportDebounceFn,
    updatePaginationDto,
    updateShowPopover,
  };
};
