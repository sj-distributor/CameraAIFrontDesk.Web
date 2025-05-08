import { ICameraAiMonitorType } from "@/dtos/default";

export enum IWarningType {
  People,
  Vehicles,
  Element,
  Security,
}

export interface IItemProps {
  label: string;
  value: ICameraAiMonitorType;
  defaultCheck?: boolean;
  children?: IItemProps[];
}

export interface IWarningListProps {
  label: string;
  value: IWarningType;
  children: IItemProps[];
}
