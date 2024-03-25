export interface IReplayResponse {
  count: number;
  replays: IReplayItem[];
}

export interface IReplayItem {
  equipment: IEquipmentItem;
  records: IRecordItem[];
  occurenceTime: string;
  duration: number;
}

export interface IEquipmentItem {
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
  isDeleted: boolean;
  createdTime: string;
}

export interface IRecordItem {
  id: number;
  correlationId: string;
  equipmentCode: string;
  settingId: number;
  monitorTypeId: number;
  duration: number;
  exceptionReason: string;
  recordStatus: number;
  plateNumber: string;
  faceName: string;
  replayTaskId: string;
  replayUrl: string;
  isRegistered: boolean;
  licensePlateImageUrl: string;
  occurrenceTime: string;
  createdTime: string;
}
