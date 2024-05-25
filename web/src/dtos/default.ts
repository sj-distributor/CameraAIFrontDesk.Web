export interface IPageDto {
  PageIndex: number;
  PageSize: number;
}

export interface IRecordRequest extends IPageDto {
  EquipmentName?: string;
  EquipmentCodes?: string[];
  MonitorTypes?: number[];
  EndTime?: string;
  StartTime?: string;
  Status?: IStatusType;
}

export enum IStatusType {
  Unmarked,
  Verifed = 10,
  Exception = 20,
  All = -1,
}

export enum ICameraAiMonitorType {
  People,
  Vehicles,
  AbnormalVehicles,
}

export interface IRecordResponse {
  count: number;
  records: IRecordItem[];
}

export interface IRecordItem {
  id: number;
  correlationId: string;
  equipmentName: string;
  equipmentCode: string;
  monitorTypeId: number;
  monitorTypeName: string;
  monitorDuration: number;
  settingDuration: number;
  recordStatus: number;
  exceptionReason: string;
  name: string;
  replayTaskId: string;
  replayUrl: string;
  isRegistered: boolean;
  licensePlateImageUrl: string;
  occurrenceTime: string;
  createdTime: string;
}

export interface IStopRealtimeResquest {
  stopList: IStopItem[];
}

export interface IStopItem {
  equipmentId: number;
  locationId: string;
  equipmentCode: string;
}
