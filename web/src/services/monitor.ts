import {
  IMonitorDetailResponse,
  IRealtimeGenerateRequest,
  IRegionEquipmentListRequest,
  IRegionEquipmentListResponse,
  IRegionListRequest,
  IRegionListResponse,
} from "@/dtos/monitor";

import { api } from "./api";

export const GetRegionList = async (data: IRegionListRequest) => {
  const response = await api.get<IRegionListResponse>(
    "/api/CameraAi/region/camera/page",
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

export const GetMonitorDetail = async (data: { EquipmentId: number }) => {
  const response = await api.get<IMonitorDetailResponse>(
    "/api/CameraAi/equipment/live/detail?EquipmentId=" + data.EquipmentId
  );

  return response.data;
};

export const PostRealtimeGenerate = async (data: IRealtimeGenerateRequest) => {
  const response = await api.post("/api/CameraAi/realtime/generate", data);

  return response.data;
};

export const GetMonitorRecordDetail = async (data: { RecordId: number }) => {
  const response = await api.get("/api/CameraAi/monitor/record/detail", {
    params: data,
  });

  return response.data;
};
