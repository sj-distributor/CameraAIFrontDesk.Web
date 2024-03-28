import queryString from "query-string";

import { IRecordRequest } from "@/dtos/default";
import {
  IPlayBackGenerateRequest,
  IReplayDetailResponse,
  IReplayResponse,
} from "@/dtos/replay";

import { api } from "./api";

export const GetReplayList = async (data: IRecordRequest) => {
  const string = queryString.stringify(data);

  const response = await api.get<IReplayResponse>(
    `/api/CameraAi/monitor/camera/replays?` + string
  );

  return response.data;
};

export const GetReplayDetail = async (data: { CorrelationId: string }) => {
  const response = await api.get<IReplayDetailResponse>(
    "/api/CameraAi/monitor/camera/replay/detail?CorrelationId=" +
      data.CorrelationId
  );

  return response.data;
};

export const PostPlayBackGenerate = async (data: IPlayBackGenerateRequest) => {
  const response = await api.post("/api/CameraAi/playback/generate", data);

  return response.data;
};
