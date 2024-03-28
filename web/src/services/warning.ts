import { IRegisterRecordRequest } from "@/dtos/warning";

import { api } from "./api";

export const PostRegisterRecord = async (data: IRegisterRecordRequest) => {
  const response = await api.post("/api/CameraAi/monitor/record/mark", data);

  return response.data;
};
