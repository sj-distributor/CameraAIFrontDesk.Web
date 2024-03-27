import queryString from "query-string";

import { IRecordRequest } from "@/services/dtos/default";
import { IReplayResponse } from "@/services/dtos/replay";

import { api } from "../../api";

export const GetReplayList = async (data: IRecordRequest) => {
  const string = queryString.stringify(data);

  const response = await api.get<IReplayResponse>(
    `/api/CameraAi/monitor/camera/replays?` + string
  );

  return response.data;
};
