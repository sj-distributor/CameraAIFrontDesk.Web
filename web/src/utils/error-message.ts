import i18n from "i18next";
import KEYS from "@/i18n/keys/error-message";

const ERROR_KEYWORDS = {
  REALTIME_INSUFFICIENT_RESOURCES: "realtime insufficient resource", // 请求直播 资源不够
  PLAYBACK_INSUFFICIENT_RESOURCES: "playback insufficient resource", // 请求回放 资源不够
  CAMERA_INFO_ERROR: "Device information error or Device offline", // 请求直播 请求回放 摄像头信息错误或离线
  CAMERA_CONNECTION_FAILED: "摄像头连接失败",
  VIDEO_STREAM_ERROR: "视频流获取失败",
  TASK_PARAMETER_ERROR: "任务参数错误",
  REPLAY_STREAM_ERROR: "回放流获取失败",
  PROGRAM_ERROR: "程序异常",
  DATA_TIMEOUR: "获取数据超时，请稍后再试",
};

export const getErrorMessage = (error: string) => {
  const { t } = i18n;

  const ERROR_MESSAGES = {
    REALTIME_INSUFFICIENT_RESOURCES: t(KEYS.REALTIME_INSUFFICIENT_RESOURCES, {
      ns: "errorMessage",
    }),
    PLAYBACK_INSUFFICIENT_RESOURCES: t(KEYS.PLAYBACK_INSUFFICIENT_RESOURCES, {
      ns: "errorMessage",
    }),
    CAMERA_INFO_ERROR: t(KEYS.CAMERA_INFO_ERROR, { ns: "errorMessage" }),
    CAMERA_CONNECTION_FAILED: t(KEYS.CAMERA_CONNECTION_FAILED, {
      ns: "errorMessage",
    }),
    VIDEO_STREAM_ERROR: t(KEYS.VIDEO_STREAM_ERROR, { ns: "errorMessage" }),
    TASK_PARAMETER_ERROR: t(KEYS.TASK_PARAMETER_ERROR, { ns: "errorMessage" }),
    REPLAY_STREAM_ERROR: t(KEYS.REPLAY_STREAM_ERROR, { ns: "errorMessage" }),
    PROGRAM_ERROR: t(KEYS.PROGRAM_ERROR, { ns: "errorMessage" }),
    DATA_TIMEOUR: t(KEYS.DATA_TIMEOUT, { ns: "errorMessage" }),
  };

  for (const [key, keyword] of Object.entries(ERROR_KEYWORDS)) {
    if (error.includes(keyword)) {
      return ERROR_MESSAGES[key as keyof typeof ERROR_MESSAGES];
    }
  }

  return error;
};
