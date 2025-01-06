import {
  ICreateTeamProps,
  IGetAttachUrlProps,
  ITeamListProps,
  IUserDataItem,
} from "@/dtos/main";
import { api } from "./api";

export const PostUploadApi = async (data: FormData) => {
  const response = await api.post<IGetAttachUrlProps>(
    "/api/Attachment/upload",
    data
  );

  return response.data;
};

export const PostTeamCreateApi = async (data: ICreateTeamProps) => {
  const response = await api.post("/api/CameraAi/team/create", data);

  return response.data;
};

export const GetTeamsMineApi = async (data: object) => {
  const response = await api.get<ITeamListProps[]>(
    "/api/CameraAi/teams/mine",
    data
  );

  return response.data;
};

export const GetAccountInfoApi = async (data: object) => {
  const response = await api.get<{ userProfile: IUserDataItem }>(
    "/api/CameraAi/user/mine",
    data
  );

  return response.data;
};
