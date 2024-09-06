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
  People, // 識別人員
  Vehicles, // 識別車輛
  AbnormalVehicles, // 識別異常車輛
  Smoke, // 吸烟检测
  Fight, // 打架检测
  Costume, // 安全配备检测
  FluorescentClothing = 501, // 荧光衣
  Gloves = 502, // 手套
  SafetyShoes = 503, // 安全鞋
  Security = 6, // 防盜
  Animal = 7, // 动物
  All = -1,
  Cat = 701,
  Dog = 702,
  Bird = 703,
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
  monitorType: ICameraAiMonitorType;
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
  costumesDetected: string;
  occurrenceTime: string;
  createdTime: string;
  locationTime: string;
}

export interface IStopRealtimeResquest {
  stopList: IStopItem[];
}

export interface IStopItem {
  equipmentId: number;
  locationId: string;
  equipmentCode: string;
}
