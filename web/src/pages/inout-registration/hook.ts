import { useState } from "react";
import { IPaginationDtoProps, IShowPopoverProps } from "./props";
import { useMemoizedFn } from "ahooks";
import { KeysOf, ValuesOf } from "@/utils/type";
import dayjs from "dayjs";

const mockTableList = {
  count: 100,
  data: [
    {
      id: 1,
      userName: "HENRY.W",
      picture:
        "https://smartiestest.oss-cn-hongkong.aliyuncs.com/20241217/6be331e8-0b6a-4a65-aeb8-e14f70407c33.jpeg?Expires=253402300799&OSSAccessKeyId=LTAI5tEYyDT8YqJBSXaFDtyk&Signature=zhqP7kcVoYACfR7K6rmQkC3sQSk%3D",
      arrivalTime: "2023/09/21 18:05:12",
      departureTime: "2023/09/21 19:05:12",
    },
    {
      id: 2,
      userName: "AAA",
      picture:
        "https://smartiestest.oss-cn-hongkong.aliyuncs.com/20241217/6be331e8-0b6a-4a65-aeb8-e14f70407c33.jpeg?Expires=253402300799&OSSAccessKeyId=LTAI5tEYyDT8YqJBSXaFDtyk&Signature=zhqP7kcVoYACfR7K6rmQkC3sQSk%3D",
      arrivalTime: "2023/09/21 19:05:12",
      departureTime: "",
    },
    {
      id: 3,
      userName: "BBB",
      picture:
        "https://smartiestest.oss-cn-hongkong.aliyuncs.com/20241217/6be331e8-0b6a-4a65-aeb8-e14f70407c33.jpeg?Expires=253402300799&OSSAccessKeyId=LTAI5tEYyDT8YqJBSXaFDtyk&Signature=zhqP7kcVoYACfR7K6rmQkC3sQSk%3D",
      arrivalTime: "2023/09/21 18:05:12",
      departureTime: "2023/09/21 19:05:12",
    },
  ],
};

export const useAction = () => {
  const yesterday = dayjs().subtract(1, "day");

  const [paginationDto, setPaginationDto] = useState<IPaginationDtoProps>({
    PageIndex: 1,
    PageSize: 10,
    time: dayjs(),
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

  return {
    mockTableList,
    paginationDto,
    showPopover,
    yesterday,
    updatePaginationDto,
    updateShowPopover,
  };
};
