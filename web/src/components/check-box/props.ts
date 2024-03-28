import { ICameraAiMonitorType } from "@/dtos/default";

export interface ICheckBoxComponentProps {
  title: string;
  selectValues: number[];
  onClick: (id: number) => void;
  options?: { label: string; value: ICameraAiMonitorType }[];
}
