import { Dayjs } from "dayjs";

import { IPageDto } from "./default";

export interface IRegionListRequest extends IPageDto {
  RegionId?: number;
  RegionAddress?: string;
  Keyword?: string;
}

export interface IRegionListResponse {
  count: number;
  regions: IRegionItem[];
}

export interface IRegionItem {
  id: number;
  areaId: number;
  areaName: string;
  regionAddress: string;
  regionAreaNames: string[];
  principal: string;
  createdTime: string | Dayjs;
}

export interface IRegionEquipmentListRequest extends IPageDto {
  EquipmentCode?: string;
  EquipmentName?: string;
  IsOnline?: boolean;
  IsBind?: boolean;
  EquipmentType?: string;
  Keyword?: string;
  RegionId: number;
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
  equipmentType: string;
  equipmentName: string;
  isBind: boolean;
  areaId: number;
  areaName: string;
  regionAddress: string;
  liveStreaming: string;
  isDeleted: boolean;
  createdTime: string | Dayjs;
}
