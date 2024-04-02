import { ICameraAiMonitorType, IPageDto } from "./default";
import { IPlayBackStatus } from "./replay";

export interface IRegionListRequest extends IPageDto {
  RegionId?: number;
  RegionAddress?: string;
  Keyword?: string;
}

export interface IRegionListResponse {
  count: number;
  regionCameras: IRegionItem[];
}

export interface IRegionItem {
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
}

export interface IRegionEquipmentListRequest extends IPageDto {
  EquipmentCode?: string;
  EquipmentName?: string;
  IsOnline?: boolean;
  IsBind?: boolean;
  TypeLabel: ICameraAiEquipmentTypeLabel;
  Keyword?: string;
  RegionId: number;
}

export enum ICameraAiEquipmentTypeLabel {
  Camera,
  Sound,
  Lighting,
}

export interface IRegionEquipmentListResponse {
  count: number;
  equipments: IRegionEquipmentItem[];
}

export interface IRegionEquipmentItem {
  id: number;
  equipmentCode: string;
  equipmentTypeId: number;
  isOnline: boolean;
  equipmentTypeName: string;
  label: 0;
  equipmentName: string;
  isBind: true;
  areaId: 0;
  ipAddress: string;
  brand: string;
  username: string;
  password: string;
  taskId: string;
  areaName: string;
  locationId: string;
  regionAddress: string;
  liveStreaming: string;
  regionId: 0;
  previewImg: string;
  isDeleted: true;
  status: IPlayBackStatus;
  createdTime: string;
}

export interface IMonitorDetailResponse {
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
}

export interface IRealtimeGenerateRequest {
  lives: ILiveItem[];
}

export interface ILiveItem {
  locationId: string;
  equipmentCode: string;
  taskId: string;
  monitorTypes: ICameraAiMonitorType[];
}
