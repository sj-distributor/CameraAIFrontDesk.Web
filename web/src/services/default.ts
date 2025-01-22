import queryString from "query-string";

import { IRecordRequest, IRecordResponse } from "@/dtos/default";
import { IMineRoleResponse } from "@/dtos/mine";

import { api } from "./api";

export const GetMineRoleList = async (data: { TeamId: string }) => {
  const response = await api.get<IMineRoleResponse>(
    "/api/CameraAi/mine/roles",
    { params: data }
  );

  return response.data;
};

export const GetRecordList = async (data: IRecordRequest) => {
  const string = queryString.stringify(data);

  const response = await api.get<IRecordResponse>(
    "/api/CameraAi/monitor/records?" + string
  );

  return response.data;
};
