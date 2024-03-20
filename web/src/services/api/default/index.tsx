import queryString from "query-string";

import {
  IMonitorType,
  IRecordRequest,
  IRecordResponse,
} from "@/services/dtos/default";

import { api } from "../../api";

export const GetRecordList = async (data: IRecordRequest) => {
  const string = queryString.stringify(data);

  const response = await api.get<IRecordResponse>(
    "/api/CameraAi/monitor/records?" + string
  );

  return response.data;
};

// 获取预警类型
export const GetTypeList = async () => {
  const response = await api.get<IMonitorType[]>("/api/CameraAi/monitor/types");

  return response.data;
};
