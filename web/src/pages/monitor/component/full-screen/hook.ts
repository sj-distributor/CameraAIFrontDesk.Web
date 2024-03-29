import { useUpdateEffect } from "ahooks";
import Mpegts from "mpegts.js";
import { clone } from "ramda";
import { useEffect, useRef, useState } from "react";

import { ICameraAiMonitorType } from "@/dtos/default";
import {
  IMonitorDetailResponse,
  IRealtimeGenerateRequest,
} from "@/dtos/monitor";
import { IPlayBackStatus } from "@/dtos/replay";
import { useAuth } from "@/hooks/use-auth";
import { PostStopRealtime } from "@/services/default";
import { GetMonitorDetail, PostRealtimeGenerate } from "@/services/monitor";

export const useAction = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const scaleRef = useRef<HTMLDivElement>(null);

  const exportRef = useRef<HTMLDivElement>(null);

  const [duration, setDuration] = useState<number | null>(null);

  const [left, setLeft] = useState<boolean>(false);

  const [right, setRight] = useState<boolean>(false);

  const getWidth = (duration: number) => {
    return (
      Math.floor(Math.floor(duration) / 120) * 60 +
      (Math.floor(duration) % 120) * 0.5
    );
  };

  const mouseUp = (direction: "left" | "right") => {
    direction === "right" ? setRight(false) : setLeft(false);
  };

  const updateProgressBar = (e: MouseEvent) => {
    if (exportRef.current && scaleRef.current) {
      const container = exportRef.current.parentElement;

      if (container) {
        // scaleRef 最外层box
        // exportRef 导出条box
        // 新增宽度
        const width =
          e.clientX +
          scaleRef.current.scrollLeft -
          exportRef.current.offsetLeft -
          exportRef.current.offsetWidth -
          container.offsetLeft;

        exportRef.current.style.width =
          (exportRef.current.offsetWidth + width < 5
            ? 5
            : getWidth(duration ?? 0) <
              scaleRef.current.offsetWidth - exportRef.current.offsetLeft
            ? exportRef.current.offsetWidth + width >=
              getWidth(duration ?? 0) - exportRef.current.offsetLeft
              ? getWidth(duration ?? 0) - exportRef.current.offsetLeft
              : exportRef.current.offsetWidth + width
            : exportRef.current.offsetWidth + width >=
              scaleRef.current.offsetWidth -
                exportRef.current.offsetLeft +
                scaleRef.current.scrollLeft
            ? scaleRef.current.offsetWidth -
              exportRef.current.offsetLeft +
              scaleRef.current.scrollLeft
            : exportRef.current.offsetWidth + width) + "px";

        // 总宽度
        // exportRef.current.style.width =
        //   // (exportRef.current.offsetWidth + width < 1
        //   //   ? 1
        //   //   : exportRef.current.offsetWidth + width) + "px";
        //   (exportRef.current.offsetWidth + width < 1
        //     ? 1
        //     : container.offsetWidth - exportRef.current.offsetLeft <
        //       exportRef.current.offsetWidth + width
        //     ? container.offsetWidth - exportRef.current.offsetLeft
        //     : exportRef.current.offsetWidth + width) + "px";

        // if (exportRef.current.offsetWidth + width < 5) {
        //   exportRef.current.style.width = 5 + "px";
        // } else {
        //   if (
        //     exportRef.current.offsetWidth + width >=
        //     scaleRef.current.offsetWidth -
        //       exportRef.current.offsetLeft +
        //       scaleRef.current.scrollLeft
        //   ) {
        //     exportRef.current.style.width =
        //       scaleRef.current.offsetWidth -
        //       exportRef.current.offsetLeft +
        //       scaleRef.current.scrollLeft +
        //       "px";
        //   } else {
        //     exportRef.current.style.width =
        //       exportRef.current.offsetWidth + width + "px";
        //   }
        // }

        // exportRef.current.style.width =
        //   (exportRef.current.offsetWidth + width < 5
        //     ? 5
        //     : exportRef.current.offsetWidth + width >=
        //       scaleRef.current.offsetWidth -
        //         exportRef.current.offsetLeft +
        //         scaleRef.current.scrollLeft
        //     ? scaleRef.current.offsetWidth -
        //       exportRef.current.offsetLeft +
        //       scaleRef.current.scrollLeft
        //     : exportRef.current.offsetWidth + width) + "px";
      }
    }
  };

  // scaleRef 最外层box
  // exportRef 导出条box
  // 外层左宽度

  const updateProgressBarLeft = (e: MouseEvent) => {
    if (exportRef.current && scaleRef.current) {
      const container = exportRef.current.parentElement;

      if (container) {
        // const newLeft = e.clientX - container.offsetLeft;

        // 现有长度
        exportRef.current.offsetWidth + container.offsetLeft;

        // 滑动距离
        e.clientX;

        // 现有长度 - 滑动距离
        exportRef.current.style.width =
          exportRef.current.offsetWidth +
          container.offsetLeft -
          e.clientX +
          "px";

        console.log(
          exportRef.current.offsetWidth + container.offsetLeft - e.clientX,
          container.offsetLeft
        );

        // exportRef.current.style.left = newLeft + "px";

        // console.log(
        //   e.clientX,
        //   // newLeft,
        //   // exportRef.current.offsetWidth,
        //   // exportRef.current.offsetWidth - newLeft,
        //   "exportRef.current.offsetWidth - newLeft"
        // );

        // exportRef.current.style.width =
        //   exportRef.current.offsetWidth - newLeft + "px";

        // exportRef.current.style.left =
        //   (newLeft <= 0
        //     ? 0
        //     : newLeft >=
        //       scaleRef.current.offsetWidth - exportRef.current.offsetWidth
        //     ? scaleRef.current.offsetWidth - exportRef.current.offsetWidth
        //     : newLeft) + "px";

        // 超出当前可视宽度时，默认最宽为可视宽度
        // exportRef.current.style.left =
        //   (newLeft < 0
        //     ? 0
        //     : newLeft >= container.offsetWidth - exportRef.current.offsetWidth
        //     ? container.offsetWidth - exportRef.current.offsetWidth
        //     : newLeft) + "px";

        // if (newLeft <= 0) {
        //   exportRef.current.style.left = 0 + "px";
        //   console.log(1);
        // } else {
        //   if (
        //     // newLeft >=
        //     // container.offsetWidth - exportRef.current.offsetWidth
        //     newLeft >=
        //     scaleRef.current.offsetWidth - exportRef.current.offsetWidth
        //   ) {
        //     exportRef.current.style.left =
        //       scaleRef.current.offsetWidth -
        //       exportRef.current.offsetWidth +
        //       "px";
        //   } else {
        //     exportRef.current.style.left = newLeft + "px";
        //   }
        // }
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    const getVideoDuration = () => {
      setDuration(video?.duration ?? 0);
    };

    video?.addEventListener("loadedmetadata", getVideoDuration);

    return () => {
      video?.removeEventListener("loadedmetadata", getVideoDuration);
    };
  }, []);

  useEffect(() => {
    if (right) {
      document.addEventListener("mousemove", updateProgressBar);
      document.addEventListener("mouseup", () => mouseUp("right"));

      return () => {
        document.removeEventListener("mousemove", updateProgressBar);
        document.removeEventListener("mouseup", () => mouseUp("right"));
      };
    }
  }, [right]);

  useEffect(() => {
    if (left) {
      document.addEventListener("mousemove", updateProgressBarLeft);
      document.addEventListener("mouseup", () => mouseUp("left"));

      return () => {
        document.removeEventListener("mousemove", updateProgressBarLeft);
        document.removeEventListener("mouseup", () => mouseUp("left"));
      };
    }
  }, [left]);

  // new

  const { location, message } = useAuth();

  const [paramsDto, setParamsDto] = useState<{
    regionId: string;
    equipmentId: string;
  }>();

  const [isGenerate, setIsGenerate] = useState<boolean>(false);

  const [monitorDetail, setMonitorDetail] =
    useState<IMonitorDetailResponse | null>(null);

  const monitorDetailRef = useRef<IMonitorDetailResponse | null>(null);

  const [selectValues, setSelectValues] = useState<ICameraAiMonitorType[]>([
    ICameraAiMonitorType.People,
    ICameraAiMonitorType.Vehicles,
    ICameraAiMonitorType.AbnormalVehicles,
  ]);

  const [endSelectValues, setEndSelectValues] = useState<number[]>([]);

  const continueExecution = useRef<boolean>(true);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [successUrl, setSuccessUrl] = useState<string>("");

  const mpegtsPlayerPlayer = useRef<Mpegts.Player | null>(null);

  const [isOpenExportPlaybackModal, setIsOpenExportPlaybackModal] =
    useState<boolean>(false);

  const onTypeClick = (id: number) => {
    setEndSelectValues((prev) => {
      let newData = clone(prev);

      const isExist = newData.findIndex((item) => item === id) !== -1;

      if (isExist) newData = newData.filter((item) => item !== id);
      else newData.push(id);

      return newData;
    });
  };

  // 保存预警筛选
  const onSave = (isTrue: boolean) => {
    if (isTrue) {
      if (!isGenerate && !continueExecution.current && isSuccess) {
        const data = getGenerateParams(monitorDetail!);

        // 调用生成回放
        PostRealtimeGenerate(data)
          .then(() => {
            console.log("生成回放成功");
            setSelectValues(endSelectValues);
            setIsGenerate(true);
            setIsSuccess(false);
            continueExecution.current = true;
          })
          .catch(() => {
            message.error("生成回放失败,请重试");
          });
      } else {
        message.info("在生成視頻，請視頻生成完再更換預警篩選條件");
        setEndSelectValues(selectValues ?? []);
      }
    } else {
      setEndSelectValues(selectValues ?? []);
    }
  };

  useEffect(() => {
    const params = location.pathname.split("/").filter((item) => item !== "");

    const regionId = params[1],
      equipmentId = params[2] ?? location.state?.equipmentId;

    setParamsDto({
      equipmentId,
      regionId,
    });
  }, []);

  useEffect(() => {
    if (paramsDto?.equipmentId) {
      GetMonitorDetail({
        EquipmentId: Number(paramsDto?.equipmentId),
      })
        .then((res) => {
          console.log("获取详情成功");
          setMonitorDetail(res ?? null);
        })
        .catch(() => {
          setMonitorDetail(null);
        });
    }
  }, [paramsDto?.equipmentId]);

  useUpdateEffect(() => {
    setEndSelectValues(selectValues ?? []);
  }, [selectValues]);

  const getGenerateParams = (monitorDetail: IMonitorDetailResponse) => {
    const data: IRealtimeGenerateRequest = {
      lives: [
        {
          locationId: monitorDetail?.locationId ?? "",
          equipmentCode: monitorDetail?.equipmentCode ?? "",
          taskId: monitorDetail?.taskId ?? "",
          monitorTypes: selectValues,
        },
      ],
    };

    return data;
  };

  useEffect(() => {
    if (monitorDetail && !isGenerate) {
      monitorDetailRef.current = monitorDetail;

      const data = getGenerateParams(monitorDetail);

      PostRealtimeGenerate(data)
        .then(() => {
          setIsGenerate(true);
          console.log("生成实时成功");
        })
        .catch(() => {
          message.error("生成实时失败");
        });
    }
  }, [monitorDetail]);

  useEffect(() => {
    if (isGenerate) {
      executeWithDelay();
    }
  }, [isGenerate]);

  function executeWithDelay() {
    if (!continueExecution.current) return;

    console.log("Method executed");
    GetMonitorDetail({ EquipmentId: Number(paramsDto?.equipmentId) })
      .then((res) => {
        if (res) {
          console.log(res, "生成成功后获取轮训");
          if (res.status === IPlayBackStatus.Success) {
            setIsSuccess(true);
            setIsGenerate(false);
            setSuccessUrl(res.liveStreaming);
            continueExecution.current = false;

            return;
          } else if (res.status === IPlayBackStatus.Failed) {
            const data = getGenerateParams(monitorDetail!);

            PostRealtimeGenerate(data);
          }
        }
      })
      .catch()
      .finally(() => {
        // 等待1秒钟后再次执行
        // setTimeout(() => {
        //   executeWithDelay(); // 递归调用自己
        // }, 5000);
      });
  }

  // 通过拿到url去播放视频
  useEffect(() => {
    if (successUrl) {
      if (Mpegts.isSupported()) {
        console.log(successUrl);

        // 需要替换为当前videoElement
        const videoElement = document.getElementById("homeVideo");

        const player = Mpegts.createPlayer({
          type: "flv",
          isLive: true,
          url: successUrl,
          hasAudio: true,
          hasVideo: true,
        });

        mpegtsPlayerPlayer.current = player;

        player.attachMediaElement(videoElement! as HTMLMediaElement);
        player.load();
        player.play();
      }
    }

    return () => {
      mpegtsPlayerPlayer?.current?.pause();
      mpegtsPlayerPlayer?.current?.unload();
      mpegtsPlayerPlayer?.current?.detachMediaElement();
      mpegtsPlayerPlayer?.current?.destroy();
    };
  }, [successUrl]);

  useEffect(() => {
    return () => {
      continueExecution.current = false;

      PostStopRealtime({
        stopList: [
          {
            locationId: monitorDetailRef.current?.locationId ?? "",
            equipmentCode: monitorDetailRef.current?.equipmentCode ?? "",
            taskId: monitorDetailRef.current?.taskId ?? "",
          },
        ],
      });
    };
  }, []);

  // const isShow = useMemo(() => {
  //   return !continueExecution.current && !isGenerate && isSuccess;
  // }, [continueExecution, isGenerate, isSuccess]);

  return {
    onTypeClick,
    onSave,
    endSelectValues,
    setIsOpenExportPlaybackModal,
    isOpenExportPlaybackModal,
  };
};
