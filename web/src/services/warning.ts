import {
  IGeneratePlayBackRequest,
  IPostPlayBackGenerateRequest,
  IRegisterRecordRequest,
} from "@/dtos/warning";

import { api } from "./api";

export const PostRegisterRecord = async (data: IRegisterRecordRequest) => {
  const response = await api.post("/api/CameraAi/monitor/record/mark", data);

  return response.data;
};

export const GetRecordDetailApi = async (data: { RecordId: string }) => {
  const response = await api.get("/api/CameraAi/monitor/record/detail", {
    params: data,
  });

  return response.data;
};

export const PostPlaybackGenerateApi = async (
  data: IPostPlayBackGenerateRequest
) => {
  const response = await api.post("/api/CameraAi/playback/generate", data);

  return response.data;
};

export const PostGeneratePlayBack = async (data: IGeneratePlayBackRequest) => {
  const response = await api.post(
    "/api/CameraAi/media/generate/playback",
    data
  );

  return response.data;
};

export const GetGenerateUrl = async (generateTaskId: string) => {
  const response = await api.get("/api/CameraAi/media/generate", {
    params: { generateTaskId },
  });

  return response.data;
};

export const PostBatchMark = async (data?: Object) => {
  const response = await api.post(
    "/api/CameraAi/monitor/record/unread/batch/mark",
    data
  );

  return response.data;
};

export const GetUnreadCountApi = async () => {
  const response = await api.get("/api/CameraAi/monitor/record/unread/count");

  return response.data;
};
