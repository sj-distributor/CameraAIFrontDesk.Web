import { IRegisterRecordRequest } from "@/services/dtos/warning";

import { api } from "../../api";

export const PostRegisterRecord = async (data: IRegisterRecordRequest) => {
  const response = await api.post(
    "/api/CameraAi/monitor/record/register",
    data
  );

  return response.data;
};
