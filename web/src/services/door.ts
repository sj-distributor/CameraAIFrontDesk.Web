import { IAccessDataProps, IPaginationDtoProps } from "@/pages/door/props";
import { api } from "./api";

export const GetDoorListApi = async (data: IPaginationDtoProps) => {
  const response = await api.get<IAccessDataProps>("/api/CameraAi/door/daily", {
    params: data,
  });

  return response.data;
};
