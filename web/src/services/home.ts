import {
  ICameraListResponse,
  IEquipmentOnlineCountItem,
  IRecordTop5CountListResponse,
} from "@/dtos/home";
import { IRealtimeGenerateRequest } from "@/dtos/monitor";

import { api } from "./api";
import { IUserInfo } from "@/dtos";

export const Login = async (data: IUserInfo) => {
  const response = await api.post<string>("/auth/login", data);

  return response.data;
};

export const GetCameraList = async (data: {
  TeamId: string;
  KeyWord: string;
}) => {
  const response = await api.get<ICameraListResponse>(
    "/api/CameraAi/region/camera/page",
    { params: data }
  );

  return response.data;
};

export const GetEquipmentOnlineList = async (data: { TeamId: string }) => {
  const response = await api.get<IEquipmentOnlineCountItem[]>(
    "/api/CameraAi/equipment/online/count",
    {
      params: data,
    }
  );

  return response.data;
};

export const GetRecordTop5CountList = async (data: { TeamId: string }) => {
  const response = await api.get<IRecordTop5CountListResponse>(
    "/api/CameraAi/monitor/record/count?TimeZone=America/Los_Angeles",
    {
      params: data,
    }
  );

  return response.data;
};

export const PostHomeStream = async (data: IRealtimeGenerateRequest) => {
  const response = await api.post("/api/CameraAi/realtime/generate", data);

  return response.data;
};
