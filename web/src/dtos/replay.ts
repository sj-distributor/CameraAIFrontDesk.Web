import { ICameraAiMonitorType, IStatusType } from "./default";

export interface IReplayResponse {
  count: number;
  replays: IReplayItem[];
}

export interface IReplayItem {
  equipment: IReplayEquipmentItem;
  records: IReplayRecordItem[];
  occurenceTime: string;
  duration: number;
}

export interface IReplayEquipmentItem {
  id: number;
  equipmentCode: string;
  equipmentTypeId: number;
  isOnline: boolean;
  equipmentTypeName: string;
  label: number;
  equipmentName: string;
  isBind: boolean;
  areaId: number;
  ipAddress: string;
  brand: string;
  username: string;
  password: string;
  taskId: string;
  areaName: string;
  locationId: string;
  regionAddress: string;
  liveStreaming: string;
  regionId: number;
  previewImg: string;
  isDeleted: boolean;
  createdTime: string;
}

export interface IReplayRecordItem {
  id: number;
  correlationId: string;
  settingId: number;
  equipmentName: string;
  equipmentCode: string;
  monitorType: ICameraAiMonitorType;
  monitorTypeName: string;
  monitorDuration: number;
  settingDuration: number;
  recordStatus: IStatusType;
  exceptionReason: string;
  name: string;
  replayTaskId: string;
  replayUrl: string;
  isRegistered: boolean;
  licensePlateImageUrl: string;
  occurrenceTime: string;
  createdTime: string;
}

export interface IReplayDetailResponse {
  equipment: IReplayEquipmentItem | null;
  totalRecord: IReplayTotalRecordItem | null;
  records: IReplayRecordItem[];
}

export interface IReplayTotalRecordItem {
  id: number;
  correlationId: string;
  duration: number;
  occurrenceTime: string;
  replayTaskId: string;
  replayUrl: string;
  createdTime: string;
  playbackStatus: IPlayBackStatus;
}

export interface IPlayBackGenerateRequest {
  locationId: string;
  equipmentCode: string;
  startTime: string;
  endTime: string;
  taskId: string;
  monitorTypes: number[];
}

export interface IGeneratePlayBackRequest {
  locationId: string;
  equipmentCode: string;
  startTime: string;
  endTime: string;
  monitorTypes: number[];
}

export enum IPlayBackStatus {
  Pending,
  Processing,
  Success,
  Failed,
}
