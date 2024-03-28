import {
  IRegionEquipmentListRequest,
  IRegionEquipmentListResponse,
  IRegionListRequest,
  IRegionListResponse,
} from "@/dtos/monitor";

import { api } from "./api";

export const GetRegionList = async (data: IRegionListRequest) => {
  const response = await api.get<IRegionListResponse>(
    "/api/CameraAi/region/page",
    { params: data }
  );

  return response.data;
};

export const GetRegionEquipmentList = async (
  data: IRegionEquipmentListRequest
) => {
  const response = await api.get<IRegionEquipmentListResponse>(
    "/api/CameraAi/equipment/page",
    { params: data }
  );

  return response.data;
};
