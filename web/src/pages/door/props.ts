import { Dayjs } from "dayjs";

export enum AccessTypeEnum {
  All = -1,
  Rolling = 0,
  Safety = 1,
}

export const AccessTypeLabel = {
  [AccessTypeEnum.All]: "请选择",
  [AccessTypeEnum.Safety]: "安全门",
  [AccessTypeEnum.Rolling]: "卷帘门",
};

export interface IPaginationDtoProps {
  PageIndex: number;
  PageSize: number;
  DoorType?: AccessTypeEnum;
  CreatedDate: Dayjs | string | undefined;
  Keyword: string;
  TeamId?: string;
}

export interface IShowPopoverProps {
  accessTypeOpen: boolean;
  datePickerOpen: boolean;
  showCalendar: boolean;
}

export interface IAccessDataProps {
  count: number;
  doors: IAccessTableProps[];
}

export interface IAccessTableProps {
  doorId: string;
  doorName: string;
  doorType: number;
  locationId: string;
  equipmentCode: string;
  orientation: number[][];
  remark: string;
  previewUrl: string;
  totalOpenDuration: number;
  openCount: number;
  createdDate: string;
  lastUpdatedDate: string;
}
