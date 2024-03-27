export interface ICameraListResponse {
  id: number;
  regionAddress: string;
  principal: string;
  isDeleted: boolean;
  createdTime: string;
  cameras: ICameraItem[];
}

export interface ICameraItem {
  id: number;
  equipmentCode: string;
  equipmentTypeId: number;
  isOnline: boolean;
  equipmentType: string;
  equipmentName: string;
  isBind: boolean;
  areaId: number;
  areaName: string;
  regionAddress: string;
  liveStreaming: string;
  isDeleted: boolean;
  createdTime: string;
}

export interface IEquipmentOnlineCountItem {
  total: number;
  online: number;
  equipmentTypeName: string;
}

export interface IRecordTop5CountListResponse {
  thisMouthRecordCount: number;
  todayRecordCount: number;
  topCount: ITopCountItem[];
}

export interface ITopCountItem {
  monitorTypeName: string;
  monitorRecordCount: number;
}
