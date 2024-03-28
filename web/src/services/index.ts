import {
  ICameraListResponse,
  IEquipmentOnlineCountItem,
  IRecordTop5CountListResponse,
} from "@/dtos/home";

import { api } from "./api";

export const Login = async (data: { userName: string; password: string }) => {
  const response = await api.post<string>("/auth/login", data);

  return response.data;
};

export const GetCameraList = async () => {
  const response = await api.get<ICameraListResponse[]>(
    "/api/CameraAi/region/camera/page"
  );

  return response.data;
};

export const GetEquipmentOnlineList = async () => {
  const response = await api.get<IEquipmentOnlineCountItem[]>(
    "/api/CameraAi/equipment/online/count"
  );

  return response.data;
};

export const GetRecordTop5CountList = async () => {
  const response = await api.get<IRecordTop5CountListResponse>(
    "/api/CameraAi/monitor/record/count?TimeZone=America/Los_Angeles"
  );

  return response.data;
};
