import queryString from "query-string";

import { IRecordRequest, IRecordResponse } from "@/dtos/default";
import { IMineRoleResponse } from "@/dtos/mine";

import { api } from "./api";

export const GetMineRoleList = async () => {
  const response = await api.get<IMineRoleResponse>(
    "/api/Security/mine/roles?SystemSource=2"
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
