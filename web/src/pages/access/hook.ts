import { useState } from "react";
import {
  AccessTypeEnum,
  IPaginationDtoProps,
  IShowPopoverProps,
} from "./props";
import { KeysOf, ValuesOf } from "@/utils/type";
import { useMemoizedFn } from "ahooks";
import dayjs from "dayjs";

const mockTableList = {
  count: 100,
  data: [
    {
      id: "1",
      type: "安全门",
      name: "1号安全门",
      openTimes: "2",
      continue: "1m10s",
      picture:
        "https://smartiestest.oss-cn-hongkong.aliyuncs.com/20241217/6be331e8-0b6a-4a65-aeb8-e14f70407c33.jpeg?Expires=253402300799&OSSAccessKeyId=LTAI5tEYyDT8YqJBSXaFDtyk&Signature=zhqP7kcVoYACfR7K6rmQkC3sQSk%3D",
      updateTime: "2023/09/21 19:05:12",
    },
    {
      id: "2",
      type: "卷帘门",
      name: "1号卷帘门",
      openTimes: "4",
      continue: "1m10s",
      picture:
        "https://smartiestest.oss-cn-hongkong.aliyuncs.com/20241217/6be331e8-0b6a-4a65-aeb8-e14f70407c33.jpeg?Expires=253402300799&OSSAccessKeyId=LTAI5tEYyDT8YqJBSXaFDtyk&Signature=zhqP7kcVoYACfR7K6rmQkC3sQSk%3D",
      updateTime: "2023/09/21 19:05:12",
    },
  ],
};

export const useAction = () => {
  const yesterday = dayjs().subtract(1, "day");

  const [showPopover, setShowPopover] = useState<IShowPopoverProps>({
    accessTypeOpen: false,
    datePickerOpen: false,
    showCalendar: false,
  });

  const [paginationDto, setPaginationDto] = useState<IPaginationDtoProps>({
    PageIndex: 1,
    PageSize: 10,
    accessType: AccessTypeEnum.All,
    time: dayjs(),
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

  return {
    mockTableList,
    paginationDto,
    yesterday,
    showPopover,
    updatePaginationDto,
    updateShowPopover,
  };
};
