import i18n from "i18next";
import KEYS from "@/i18n/keys/error-message";

const ERROR_KEYWORDS = {
  DUPLICATE_CAMERA: "Reduplicative camera",
  DATABASE_ERROR: "gateway database error",
  INSUFFICIENT_RESOURCES: "No node free",
  CAMERA_INFO_ERROR: "Device information error or Device offline",
  CAMERA_CONNECTION_FAILED: "摄像头连接失败",
  VIDEO_STREAM_ERROR: "视频流获取失败",
  TASK_PARAMETER_ERROR: "任务参数错误",
  REPLAY_STREAM_ERROR: "回放流获取失败",
  PROGRAM_ERROR: "程序异常",
};

export const getErrorMessage = (error: string) => {
  const { t } = i18n;

  const ERROR_MESSAGES = {
    DUPLICATE_CAMERA: t(KEYS.DUPLICATE_CAMERA, { ns: "errorMessage" }),
    DATABASE_ERROR: t(KEYS.DATABASE_ERROR, { ns: "errorMessage" }),
    INSUFFICIENT_RESOURCES: t(KEYS.INSUFFICIENT_RESOURCES, {
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
  };

  for (const [key, keyword] of Object.entries(ERROR_KEYWORDS)) {
    if (error.includes(keyword)) {
      return ERROR_MESSAGES[key as keyof typeof ERROR_MESSAGES];
    }
  }
  return error;
};
