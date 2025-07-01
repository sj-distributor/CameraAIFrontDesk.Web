import {
  IInoutProps,
  IPaginationDtoProps,
} from "@/pages/inout-registration/props";
import { api } from "./api";

export const GetInoutListApi = async (data: IPaginationDtoProps) => {
  const response = await api.get<IInoutProps>(
    "/api/CameraAi/portrait/attendances/page",
    {
      params: data,
    }
  );

  return response.data;
};
