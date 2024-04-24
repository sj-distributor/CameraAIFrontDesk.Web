import { IStopRealtimeResquest } from "@/dtos/default";
import { Post } from "./api";

export const PostStopRealtime = (data: IStopRealtimeResquest) => {
  return Post("/api/CameraAi/media/realtime/stop", data);
};
