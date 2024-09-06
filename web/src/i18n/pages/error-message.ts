import KEYS from "../keys/error-message";

export default {
  en: {
    [KEYS.REALTIME_INSUFFICIENT_RESOURCES]:
      "No node free,please try again later",
    [KEYS.PLAYBACK_INSUFFICIENT_RESOURCES]:
      "No node free,please try again later",
    [KEYS.CAMERA_INFO_ERROR]:
      "Device information error or Device offline,please try again later",
    [KEYS.CAMERA_CONNECTION_FAILED]:
      "Camera Connection Failed,please try again later",
    [KEYS.VIDEO_STREAM_ERROR]: "Video Stream Error,please try again later",
    [KEYS.TASK_PARAMETER_ERROR]: "Task Parameter Error,please try again later",
    [KEYS.REPLAY_STREAM_ERROR]: "Replay Stream Error,please try again later",
    [KEYS.PROGRAM_ERROR]: "Program Error,please try again later",
    [KEYS.DATA_TIMEOUT]: "Get Data Timeout,please try again later",
  },
  ch: {
    [KEYS.REALTIME_INSUFFICIENT_RESOURCES]: "請求直播资源不够，請稍候重試",
    [KEYS.PLAYBACK_INSUFFICIENT_RESOURCES]: "請求回放资源不够，請稍候重試",
    [KEYS.CAMERA_INFO_ERROR]: "當前摄像头信息错误或离线，請稍候重試",
    [KEYS.CAMERA_CONNECTION_FAILED]: "摄像头连接失败，請稍候重試",
    [KEYS.VIDEO_STREAM_ERROR]: "视频流获取失败，請稍候重試",
    [KEYS.TASK_PARAMETER_ERROR]: "任务参数错误，請稍候重試",
    [KEYS.REPLAY_STREAM_ERROR]: "回放流获取失败，請稍候重試",
    [KEYS.PROGRAM_ERROR]: "程序异常，請稍候重試",
    [KEYS.DATA_TIMEOUT]: "获取数据超时，請稍候重試",
  },
};
