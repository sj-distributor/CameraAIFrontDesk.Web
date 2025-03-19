import { Dayjs } from "dayjs";

export interface IPaginationDtoProps {
  PageIndex: number;
  PageSize: number;
  time: Dayjs | undefined;
  Keyword: string;
  CreatedDate: string;
  TeamId?: string;
}

export interface IShowPopoverProps {
  datePickerOpen: boolean;
  showCalendar: boolean;
}

export interface IInoutProps {
  count: number;
  data: IInoutItem[];
}

export interface IInoutItem {
  id: string;
  userName: string;
  picture: string;
  arrivalTime: string;
  departureTime: string;
}
