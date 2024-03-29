import { IStatusType } from "./default";

export interface IRegisterRecordRequest {
  recordId: number;
  exceptionReason?: string;
  recordStatus: IStatusType;
}

export interface IPostPlayBackGenerateRequest {
  locationId: string;
  equipmentCode: string;
  startTime: string;
  endTime: string;
  taskId: string;
}

export interface IPlayDetailDataDto {
  areaAdress: string;
  locationId: string;
  equipmentCode: string;
  startTime: string;
  duration: number;
  taskId: string;
}

export interface IGeneratePlayBackRequest {
  locationId: string;
  equipmentCode: string;
  startTime: string;
  endTime: string;
  monitorTypes: number[];
}
