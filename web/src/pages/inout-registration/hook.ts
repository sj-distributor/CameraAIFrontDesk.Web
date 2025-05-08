import { useState } from "react";
import { IInoutProps, IPaginationDtoProps, IShowPopoverProps } from "./props";
import { useMemoizedFn, useRequest } from "ahooks";
import { KeysOf, ValuesOf } from "@/utils/type";
import dayjs from "dayjs";
import { GetInoutListApi } from "@/services/inout";
import { message } from "antd";
import { useAuth } from "@/hooks/use-auth";

export const useAction = () => {
  const { currentTeam } = useAuth();

  const yesterday = dayjs().subtract(1, "day");

  const [paginationDto, setPaginationDto] = useState<IPaginationDtoProps>({
    PageIndex: 1,
    PageSize: 10,
    time: dayjs(),
    Keyword: "",
    CreatedDate: "",
  });

  const [doorList, setDoorList] = useState<IInoutProps>({
    count: 0,
    data: [],
  });

  const [showPopover, setShowPopover] = useState<IShowPopoverProps>({
    datePickerOpen: false,
    showCalendar: false,
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

  const { loading: listLoading, run: getInoutList } = useRequest(
    () =>
      GetInoutListApi({
        ...paginationDto,
        time: undefined,
        CreatedDate: dayjs(paginationDto.time).format("YYYY/MM/DD"),
        TeamId: currentTeam.id,
      }),
    {
      refreshDeps: [paginationDto.PageIndex, paginationDto.PageSize],
      onSuccess: (res) => {
        setDoorList({
          count: res?.count ?? 0,
          data: res?.data ?? [],
        });
      },
      onError: () => {
        setDoorList({
          count: 0,
          data: [],
        });
        message.error("獲取數據失敗");
      },
    }
  );

  return {
    doorList,
    paginationDto,
    showPopover,
    yesterday,
    listLoading,
    updatePaginationDto,
    updateShowPopover,
    getInoutList,
  };
};
