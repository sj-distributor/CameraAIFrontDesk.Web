import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDebounceFn, useMemoizedFn } from "ahooks";

import {
  AccessTypeEnum,
  IAccessDataProps,
  IPaginationDtoProps,
  IShowPopoverProps,
} from "./props";
import { useAuth } from "@/hooks/use-auth";
import { KeysOf, ValuesOf } from "@/utils/type";
import { GetDoorListApi } from "@/services/door";

const initDoorData: IAccessDataProps = {
  count: 0,
  doors: [],
};

export const useAction = () => {
  const { message, currentTeam } = useAuth();

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

  const { run: onSearchFn } = useDebounceFn(
    () => {
      paginationDto.PageIndex === 1
        ? getDoorList()
        : updatePaginationDto("PageIndex", 1);
    },
    { wait: 500 }
  );

  const getDoorList = () => {
    setPageLoading(true);

    GetDoorListApi({
      ...paginationDto,
      DoorType:
        paginationDto.DoorType === AccessTypeEnum.All
          ? undefined
          : paginationDto.DoorType,
      CreatedDate: dayjs(paginationDto.CreatedDate).format("YYYY/MM/DD"),
      TeamId: currentTeam.id,
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
    updatePaginationDto,
    updateShowPopover,
  };
};
