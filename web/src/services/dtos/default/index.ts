export interface IPageDto {
  PageIndex: number;
  PageSize: number;
}

export interface IRecordRequest extends IPageDto {
  EquipmentName?: string;
  EquipmentCodes?: string[];
  MonitorTypeIds?: string[];
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
  plateNumber: string;
  faceName: string;
  replayTaskId: string;
  replayUrl: string;
  isRegistered: boolean;
  licensePlateImageUrl: string;
  occurrenceTime: string;
  createdTime: string;
}

export interface IMonitorType {
  id: number;
  name: string;
  description: string;
  isDeleted: boolean;
  createdDate: string;
}
