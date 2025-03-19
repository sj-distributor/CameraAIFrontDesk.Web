import { IStatusType } from "./default";

export interface IRegisterRecordRequest {
  recordId: number;
  exceptionReason?: string;
  recordStatus: IStatusType;
}

export interface IPostPlayBackGenerateRequest {
  teamId?: string;
  locationId: string;
  equipmentId: string;
  equipmentCode: string;
  startTime: string;
  endTime: string;
  taskId: string;
  monitorTypes?: number[];
}

export interface IPlayDetailDataDto {
  areaAdress: string;
  locationId: string;
  equipmentId: string;
  equipmentCode: string;
  startTime: string;
  duration: number;
  taskId: string;
}

export interface IGeneratePlayBackRequest {
  locationId: string;
  equipmentId: string;
  equipmentCode: string;
  startTime: string;
  endTime: string;
  monitorTypes: number[];
}
