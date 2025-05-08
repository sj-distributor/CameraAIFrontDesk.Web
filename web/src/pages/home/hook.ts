import { useDebounceFn, useUpdateEffect } from "ahooks";
import Mpegts from "mpegts.js";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ICameraItem,
  ICameraListResponse,
  IEquipmentOnlineCountItem,
  IRecordTop5CountListResponse,
} from "@/dtos/home";
import { IPlayBackStatus } from "@/dtos/replay";
import { useAuth } from "@/hooks/use-auth";
import { PostStopRealtime } from "@/services/stop-media";
import {
  GetCameraList,
  GetEquipmentOnlineList,
  GetRecordTop5CountList,
  PostHomeStream,
} from "@/services/home";
import { IRealtimeGenerateRequest } from "@/dtos/monitor";
import { getErrorMessage } from "@/utils/error-message";

type EChartsOption = echarts.EChartsOption;

export const useAction = () => {
  const { t, message, currentTeam } = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);

  const [volume, setVolume] = useState<number>(50);

  const [height, setHeight] = useState<number | null>(null);

  const [selectStatus, setSelectStatus] = useState<boolean>(false);

  const [volumeSliderStatus, setVolumeSliderStatus] = useState<boolean>(false);

  const [equipmentCountList, setEquipmentCountList] = useState<
    IEquipmentOnlineCountItem[]
  >([]);

  const continueExecution = useRef<boolean>(true);

  const [cameraList, setCameraList] = useState<ICameraListResponse>({
    count: 0,
    regionCameras: [],
  });

  const [isGenerate, setIsGenerate] = useState<boolean>(false);

  const generateError = useRef<boolean>(false);

  const [isFind, setIsFind] = useState<boolean>(false);

  const [nowStream, setNowStream] = useState<string>("");

  const [errorFlv, setErrorFlv] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [clickCamera, setClickCamera] = useState<{
    locationId: string;
    equipmentCode: string;
    regionId: number;
    cameraId: number;
    equipmentName: string;
    equipmentId: number;
  }>({
    locationId: "",
    equipmentCode: "",
    regionId: 0,
    cameraId: 0,
    equipmentName: "",
    equipmentId: 0,
  });

  const clickCameraCameraRef = useRef<{
    locationId: string;
    equipmentCode: string;
    regionId: number;
    cameraId: number;
    equipmentName: string;
    equipmentId: number;
  }>({
    locationId: "",
    equipmentCode: "",
    regionId: 0,
    cameraId: 0,
    equipmentName: "",
    equipmentId: 0,
  });

  useUpdateEffect(() => {
    clickCameraCameraRef.current = clickCamera;
  }, [clickCamera]);

  const mpegtsPlayerPlayer = useRef<Mpegts.Player | null>(null);

  const [recordTop5Obj, setRecordTop5Obj] =
    useState<IRecordTop5CountListResponse>({
      thisMouthRecordCount: 0,
      todayRecordCount: 0,
      topCount: [],
    });

  const videoFullScreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  const videoPlayback = () => {
    if (mpegtsPlayerPlayer.current && videoRef.current) {
      if (!videoRef.current.paused) {
        mpegtsPlayerPlayer.current.pause();
      } else {
        mpegtsPlayerPlayer.current.play();
      }
    }
  };

  const isShow = useMemo(() => {
    return !isGenerate && isFind;
  }, [isGenerate, isFind]);

  const getCameraStream = (
    locationId: string,
    regionId: number,
    cameraId: number,
    item: ICameraItem
  ) => {
    // setNowStream("http://camera-ai-realtime.wiltechs.com/1800-1/1201.flv");
    // setNowStream("http://47.254.86.185:8080/live/1.flv");
    if (!isGenerate) {
      // 停止推流
      if (nowStream && !generateError.current) {
        PostStopRealtime({
          stopList: [
            {
              equipmentId: clickCamera.equipmentId,
              locationId: clickCamera.locationId,
              equipmentCode: clickCamera.equipmentCode,
            },
          ],
        })
          .then(() => {
            mpegtsPlayerPlayer?.current?.unload();
            mpegtsPlayerPlayer?.current?.pause();
            mpegtsPlayerPlayer?.current?.detachMediaElement();
            mpegtsPlayerPlayer?.current?.destroy();
            mpegtsPlayerPlayer.current = null;
          })
          .catch(() => {});
      }

      setClickCamera({
        locationId,
        equipmentCode: item?.equipmentCode ?? "",
        regionId: regionId,
        cameraId: cameraId,
        equipmentName: item?.equipmentName ?? "",
        equipmentId: item?.id ?? 0,
      });

      const data: IRealtimeGenerateRequest = {
        lives: [
          {
            locationId: locationId ?? "",
            equipmentCode: item?.equipmentCode ?? "",
            equipmentId: item?.id ?? "",
            monitorTypes: [],
          },
        ],
      };

      PostHomeStream(data)
        .then(() => {
          setIsGenerate(true);
          setNowStream("");
          setIsFind(false);
          setErrorFlv(false);
          generateError.current = false;
        })
        .catch((error) => {
          generateError.current = true;
          setIsGenerate(false);
          setErrorFlv(true);
          setIsFind(true);
          message.error(getErrorMessage(error ?? "生成視頻流失敗"));
          setErrorMessage(getErrorMessage(error ?? "生成視頻流失敗"));
          setClickCamera({
            locationId: "",
            equipmentCode: "",
            regionId: 0,
            cameraId: 0,
            equipmentName: "",
            equipmentId: 0,
          });
        });
    } else {
      message.info("正在獲取視頻流，請勿切換攝像頭");
    }
  };

  const { run: handleGetCameraStream } = useDebounceFn(getCameraStream, {
    wait: 300,
  });

  const getHeight = () => {
    const videoTitle = document.getElementById("video-title")?.clientHeight;

    const header = document.getElementById("header")?.offsetHeight;

    const box = document.getElementById("box")?.clientHeight;

    if (box && videoTitle && header) {
      // window.innerHeight - header - 32(py-4) - 16(space-y-4) - box - 32(py-4) - videoTitle - 4(space-y-1)

      setHeight(
        window.innerHeight - header - 32 - 16 - box - 32 - videoTitle - 4 >= 492
          ? window.innerHeight - header - 32 - 16 - box - 32 - videoTitle - 4
          : 492
      );
    }
  };

  useEffect(() => {
    getHeight();

    window.addEventListener("resize", getHeight);

    return window.removeEventListener("reset", getHeight);
  }, []);

  // 獲取top5跟設備
  useEffect(() => {
    if (!currentTeam.id) {
      message.error("TeamId not found！");
      return;
    }

    GetEquipmentOnlineList({ TeamId: currentTeam.id })
      .then((res) => {
        if (res) setEquipmentCountList(res ?? []);
      })
      .catch(() => {
        setEquipmentCountList([]);
      });

    GetRecordTop5CountList({ TeamId: currentTeam.id })
      .then((res) => {
        if (res) {
          setRecordTop5Obj({
            thisMouthRecordCount: res?.thisMouthRecordCount ?? 0,
            todayRecordCount: res?.todayRecordCount ?? 0,
            topCount: res?.topCount ?? [],
          });
        }
      })
      .catch(() => {
        setRecordTop5Obj({
          thisMouthRecordCount: 0,
          todayRecordCount: 0,
          topCount: [],
        });
      });
  }, []);

  const option: EChartsOption = useMemo(() => {
    const nameList = recordTop5Obj.topCount.map((item) => item.monitorTypeName);

    const countList = recordTop5Obj.topCount.map(
      (item) => item.monitorRecordCount
    );

    const data = [
      {
        value: 0,
        itemStyle: {
          color: "#ACF1F0",
          opacity: 0.6,
        },
        emphasis: {
          itemStyle: {
            color: "#ACF1F0",
            opacity: 1,
          },
        },
      },
      {
        value: 0,
        itemStyle: {
          color: "#FFD599",
          opacity: 0.6,
        },
        emphasis: {
          itemStyle: {
            color: "#FFD599",
            opacity: 1,
          },
        },
      },
      {
        value: 0,
        itemStyle: {
          color: "#FFB1AC",
          opacity: 0.6,
        },
        emphasis: {
          itemStyle: {
            color: "#FFB1AC",
            opacity: 1,
          },
        },
      },
      {
        value: 0,
        itemStyle: {
          color: "#A8C5DA",
          opacity: 0.6,
        },
        emphasis: {
          itemStyle: {
            color: "#A8C5DA",
            opacity: 1,
          },
        },
      },
      {
        value: 0,
        itemStyle: {
          color: "#95A4FC",
          opacity: 0.6,
        },
        emphasis: {
          itemStyle: {
            color: "#95A4FC",
            opacity: 1,
          },
        },
      },
    ];

    const seriesData: any[] = [];

    countList.map((outItem, outIndex) => {
      data.map((inItem, inIndex) => {
        if (outIndex === inIndex) {
          seriesData.push({
            ...inItem,
            value: outItem,
          });
        }
      });
    });

    return {
      yAxis: {
        type: "value",
      },
      xAxis: {
        type: "category",
        data: nameList,
      },
      tooltip: {
        show: true,
        trigger: "item",
        position: function (point: any, params: any) {
          return [
            params.name === nameList[nameList.length - 1]
              ? point[0] - 130
              : point[0] + 10,
            point[1] > 140 ? point[1] - 40 : point[1] + 20,
          ];
        },
        confine: true,
      },
      series: [
        {
          data: seriesData,
          type: "bar",
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
          },
          label: {
            show: true,
            position: "top",
            color: "#2866F1",
          },
        },
      ],
    };
  }, [recordTop5Obj.topCount]);

  // 轮训获取摄像头List
  const getCameraList = () => {
    if (!continueExecution.current) return;

    if (!currentTeam.id) return;

    GetCameraList({ TeamId: currentTeam.id })
      .then((res) => {
        generateError.current = false;

        setCameraList({
          count: res?.count ?? 0,
          regionCameras: res?.regionCameras ?? [],
        });
      })
      .catch(() => {
        generateError.current = true;

        setCameraList({
          count: 0,
          regionCameras: [],
        });
      })
      .finally(() => {
        setTimeout(() => {
          getCameraList();
        }, 5000);
      });
  };

  useEffect(() => {
    getCameraList();

    const cleanup = () => {
      clickCameraCameraRef.current.equipmentId &&
        clickCameraCameraRef.current.locationId &&
        clickCameraCameraRef.current.equipmentCode &&
        !generateError.current &&
        PostStopRealtime({
          stopList: [
            {
              equipmentId: clickCameraCameraRef.current.equipmentId,
              locationId: clickCameraCameraRef.current.locationId,
              equipmentCode: clickCameraCameraRef.current.equipmentCode,
            },
          ],
        });
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      continueExecution.current = false;

      window.removeEventListener("beforeunload", cleanup);

      mpegtsPlayerPlayer?.current?.unload();
      videoRef.current && mpegtsPlayerPlayer?.current?.pause();
      mpegtsPlayerPlayer?.current?.detachMediaElement();
      mpegtsPlayerPlayer?.current?.destroy();
      mpegtsPlayerPlayer.current = null;

      cleanup();
    };
  }, []);

  useEffect(() => {
    if (isGenerate) {
      const findCameraItem = cameraList.regionCameras.filter(
        (item) => item.id === clickCamera.regionId
      );

      if (findCameraItem.length > 0) {
        if (
          findCameraItem[0].cameras.some(
            (item) => item.id === clickCamera.cameraId
          )
        ) {
          findCameraItem[0].cameras.forEach((item) => {
            if (
              item.id === clickCamera.cameraId &&
              item.status === IPlayBackStatus.Success &&
              !isFind
            ) {
              setNowStream(item.liveStreaming);
              setIsFind(true);
              setIsGenerate(false);
              generateError.current = false;
            } else if (
              item.id === clickCamera.cameraId &&
              item.status === IPlayBackStatus.Failed &&
              !isFind
            ) {
              setNowStream("");
              setIsFind(true);
              setIsGenerate(false);
              setErrorFlv(true);
              generateError.current = true;

              message.warning(
                getErrorMessage(
                  item?.errorMessage ?? "生成的視頻流有問題，請重新生成"
                )
              );
              setErrorMessage(
                getErrorMessage(
                  item?.errorMessage ?? "生成的視頻流有問題，請重新生成"
                )
              );
              setClickCamera((prev) => ({
                ...prev,
                equipmentName: "",
              }));
            }
          });
        } else {
          generateError.current = true;
          setNowStream("");
          setIsFind(true);
          setIsGenerate(false);
          setErrorFlv(true);
          setClickCamera((prev) => ({
            ...prev,
            equipmentName: "",
          }));
          message.error("获取當前攝像頭失败，请重新選擇攝像頭");
        }
      } else {
        generateError.current = true;
        setNowStream("");
        setIsFind(true);
        setIsGenerate(false);
        setErrorFlv(true);
        setClickCamera((prev) => ({
          ...prev,
          equipmentName: "",
        }));
        message.error("获取當前攝像頭失败，请重新選擇攝像頭");
      }
    }
  }, [cameraList.regionCameras]);

  const [videoDuration, setVideoDuration] = useState("00:00");

  useEffect(() => {
    if (nowStream) {
      if (Mpegts.isSupported()) {
        const videoElement = document.getElementById("homeVideo");

        const player = Mpegts.createPlayer(
          {
            type: "flv",
            isLive: true,
            url: nowStream,
            cors: true,
          },
          {
            enableWorker: true, // 启用分离的线程进行转换（如果不想看到控制台频繁报错把它设置为false，官方的回答是这个属性还不稳定，所以要测试实时视频流的话设置为true控制台经常报错）
            enableStashBuffer: false, // 关闭IO隐藏缓冲区（如果需要最小延迟，则设置为false，此项设置针对直播视频流）
            stashInitialSize: 128, // 减少首帧等待时长（针对实时视频流）
            lazyLoad: false, // 关闭懒加载模式（针对实时视频流）
            lazyLoadMaxDuration: 0.2, // 懒加载的最大时长。单位：秒。建议针对直播：调整为200毫秒
            deferLoadAfterSourceOpen: false, // 在MediaSource sourceopen事件触发后加载。在Chrome上，在后台打开的标签页可能不会触发sourceopen事件，除非切换到该标签页。
            liveBufferLatencyChasing: true, // 追踪内部缓冲区导致的实时流延迟
            liveBufferLatencyMaxLatency: 1.5, // HTMLMediaElement 中可接受的最大缓冲区延迟（以秒为单位）之前使用flv.js发现延时严重，还有延时累加的问题，而mpegts.js对此做了优化，不需要我们自己设置快进追帧了
            liveBufferLatencyMinRemain: 0.3, // HTMLMediaElement 中可接受的最小缓冲区延迟（以秒为单位）
          }
        );

        mpegtsPlayerPlayer.current = player;
        if (videoElement) {
          player.attachMediaElement(videoElement! as HTMLMediaElement);
          player.load();
          player.play();

          player.on(Mpegts.Events.ERROR, () => {
            setErrorFlv(true);
            setErrorMessage("当前视频出现问题，无法播放");
          });

          const handleTimeUpdate = () => {
            if (videoRef.current?.currentTime) {
              const min = Math.round(videoRef.current?.currentTime);

              const minutes = Math.floor(min / 60);

              const remainingSeconds = min % 60;

              const paddedMinutes = String(minutes).padStart(2, "0");

              const paddedSeconds = String(remainingSeconds).padStart(2, "0");

              setVideoDuration(`${paddedMinutes}:${paddedSeconds}`);
            }
          };

          videoElement.addEventListener("timeupdate", handleTimeUpdate);

          return () => {
            videoElement.removeEventListener("timeupdate", handleTimeUpdate);
          };
        }
      }
    }
  }, [nowStream]);

  return {
    t,
    height,
    volume,
    videoRef,
    option,
    selectStatus,
    recordTop5Obj,
    volumeSliderStatus,
    equipmentCountList,
    cameraList,
    clickCamera,
    videoDuration,
    isShow,
    errorFlv,
    setClickCamera,
    videoPlayback,
    handleGetCameraStream,
    setVolume,
    setSelectStatus,
    videoFullScreen,
    setVolumeSliderStatus,
    errorMessage,
  };
};
