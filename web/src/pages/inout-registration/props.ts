import { Dayjs } from "dayjs";

export interface IPaginationDtoProps {
  PageIndex: number;
  PageSize: number;
  time: Dayjs | undefined;
}

export interface IShowPopoverProps {
  datePickerOpen: boolean;
  showCalendar: boolean;
}
