import { Dayjs } from "dayjs";

export enum AccessTypeEnum {
  All = -1,
  SafeDoor = 0,
  RollDoor = 1,
}

export const AccessTypeLabel = {
  [AccessTypeEnum.All]: "请选择",
  [AccessTypeEnum.SafeDoor]: "安全门",
  [AccessTypeEnum.RollDoor]: "卷帘门",
};

export interface IPaginationDtoProps {
  PageIndex: number;
  PageSize: number;
  accessType: AccessTypeEnum;
  time: Dayjs | undefined;
}

export interface IShowPopoverProps {
  accessTypeOpen: boolean;
  datePickerOpen: boolean;
  showCalendar: boolean;
}
