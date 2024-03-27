import {
  ICameraListResponse,
  IEquipmentOnlineCountItem,
  IRecordTop5CountListResponse,
} from "@/services/dtos/home";

import { api } from "../../api";

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
    "/api/CameraAi/monitor/record/count?TimeZone=Pacific Standard Time"
  );

  return response.data;
};
