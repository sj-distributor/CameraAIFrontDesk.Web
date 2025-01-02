import { ICameraAiEquipmentTypeLabel } from "./monitor";
import { IPlayBackStatus } from "./replay";

export interface ICameraListResponse {
  count: number;
  regionCameras: IReginCameraItem[];
}

export interface IReginCameraItem {
  id: number;
  locationId: string;
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
  equipmentTypeName: string;
  label: ICameraAiEquipmentTypeLabel;
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
  status: IPlayBackStatus;
  createdTime: string;
  errorMessage: string;
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
