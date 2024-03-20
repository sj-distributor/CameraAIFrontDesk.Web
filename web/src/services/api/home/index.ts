import { ICameraListResponse } from "@/services/dtos/home";

import { api } from "../../api";

export const GetCameraList = async () => {
  const response = await api.get<ICameraListResponse[]>(
    "/api/CameraAi/region/camera/page"
  );

  return response.data;
};
