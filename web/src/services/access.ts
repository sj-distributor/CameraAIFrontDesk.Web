import { IAccessDataProps, IPaginationDtoProps } from "@/pages/access/props";
import { api } from "./api";

export const GetDoorListApi = async (data: IPaginationDtoProps) => {
  const response = await api.get<IAccessDataProps>("/api/CameraAi/door/list", {
    params: data,
  });

  return response.data;
};
