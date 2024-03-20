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
