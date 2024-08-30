import KEYS from "../keys/error-message";

export default {
  en: {
    [KEYS.INSUFFICIENT_RESOURCES]: "No node free",
    [KEYS.CAMERA_INFO_ERROR]: "Device information error or Device offline",
    [KEYS.CAMERA_CONNECTION_FAILED]: "Camera Connection Failed",
    [KEYS.VIDEO_STREAM_ERROR]: "Video Stream Error",
    [KEYS.TASK_PARAMETER_ERROR]: "Task Parameter Error",
    [KEYS.REPLAY_STREAM_ERROR]: "Replay Stream Error",
    [KEYS.PROGRAM_ERROR]: "Program Error",
  },
  ch: {
    [KEYS.INSUFFICIENT_RESOURCES]: "资源不够",
    [KEYS.CAMERA_INFO_ERROR]: "摄像头信息错误或离线",
    [KEYS.CAMERA_CONNECTION_FAILED]: "摄像头连接失败",
    [KEYS.VIDEO_STREAM_ERROR]: "视频流获取失败",
    [KEYS.TASK_PARAMETER_ERROR]: "任务参数错误",
    [KEYS.REPLAY_STREAM_ERROR]: "回放流获取失败",
    [KEYS.PROGRAM_ERROR]: "程序异常",
  },
};
