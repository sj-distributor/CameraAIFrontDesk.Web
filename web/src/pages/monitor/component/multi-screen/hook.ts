import Mpegts from "mpegts.js";
import { clone } from "ramda";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ICameraAiMonitorType } from "@/dtos/default";
import {
  ICameraAiEquipmentTypeLabel,
  IRegionEquipmentItem,
} from "@/dtos/monitor";
import { IPlayBackStatus } from "@/dtos/replay";
import { useAuth } from "@/hooks/use-auth";
import {
  GetRegionEquipmentList,
  PostRealtimeGenerate,
} from "@/services/monitor";
import { useUpdateEffect } from "ahooks";
import { PostStopRealtime } from "@/services/stop-media";

enum ScreenCountEnum {
  FOUR = 4,
  SIX = 6,
  NINE = 9,
}

export const useAction = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const { message } = useAuth();

  const [numberDto, setNumberDto] = useState<{
    number: number;
    successOrFailFlv: {
      index: number;
      status: IPlayBackStatus;
      liveStreaming: string;
    }[];
  }>({
    number: ScreenCountEnum.FOUR,
    successOrFailFlv: [],
  });

  const [equipments, setEquipments] = useState<IRegionEquipmentItem[]>([]);

  const queryString = window.location.search;

  const searchParams = new URLSearchParams(queryString);

  const regionName = searchParams.get("regionName");

  const [nowRegionId, setNowRegionId] = useState<string>("");

  const [isGenerate, setIsGenerate] = useState<boolean>(false);

  const continueExecution = useRef<boolean>(true);

  const [returnErrorIndexs, setReturnErrorIndexs] = useState<number[]>([]);

  const [errorFlvIndexs, setErrorFlvIndexs] = useState<number[]>([]);

  const mpegtsPlayerPlayer = useRef<Mpegts.Player | null>(null);

  const videoBodyRef = useRef<HTMLDivElement>(null);

  const [videoItemHeight, setVideoItemHeight] = useState<number | null>(null);

  const [videoBodyWidth, setVideoBodyWidth] = useState<number | null>(null);

  const [endSelectValues, setEndSelectValues] = useState<number[]>([]);

  const equipmentsRef = useRef<IRegionEquipmentItem[] | null>(null);

  const [currentEquipmentsIds, setCurrentEquipmentsIds] = useState<number[]>(
    []
  );

  const typeList = [
    {
      label: "識別人員",
      value: ICameraAiMonitorType.People,
    },
    {
      label: "識別車輛",
      value: ICameraAiMonitorType.Vehicles,
    },
    {
      label: "識別異常車輛",
      value: ICameraAiMonitorType.AbnormalVehicles,
    },
    {
      label: "動物入侵識別",
      value: ICameraAiMonitorType.Animal,
    },
  ];

  const [selectValues, setSelectValues] = useState<ICameraAiMonitorType[]>([
    ICameraAiMonitorType.People,
    ICameraAiMonitorType.Vehicles,
    ICameraAiMonitorType.AbnormalVehicles,
  ]);

  // 获取设备详情
  const getEquipmentList = () => {
    if (mpegtsPlayerPlayer.current) {
      mpegtsPlayerPlayer.current.pause();
      mpegtsPlayerPlayer.current.unload();
      mpegtsPlayerPlayer.current.detachMediaElement();
      mpegtsPlayerPlayer.current.destroy();
      mpegtsPlayerPlayer.current = null;
    }

    setReturnErrorIndexs([]);

    setErrorFlvIndexs([]);

    continueExecution.current = false;

    const data = location.pathname.split("/").filter((item) => item !== "");

    if (data.length >= 2) {
      const regionId = data[1];

      setNowRegionId(regionId);

      GetRegionEquipmentList({
        PageIndex: 1,
        PageSize: 2147483647,
        RegionId: Number(regionId),
        TypeLabel: ICameraAiEquipmentTypeLabel.Camera,
      })
        .then((res) => {
          setIsGenerate(false);

          setEquipments(res?.equipments ?? []);
        })
        .catch(() => {
          setEquipments([]);
          message.error("獲取設備詳情失敗");
        });
    }
  };

  useEffect(() => {
    getEquipmentList();
  }, [numberDto.number]);

  // 通过设备详情，调用生成接口
  useEffect(() => {
    if (!isGenerate) {
      const data = equipments.map((item) => {
        return {
          locationId: item?.locationId ?? "",
          equipmentCode: item?.equipmentCode ?? "",
          equipmentId: item?.id ?? "",
          monitorTypes: endSelectValues,
        };
      });

      PostRealtimeGenerate({ lives: data })
        .then(() => {
          setIsGenerate(true);
          continueExecution.current = true;
        })
        .catch(() => {
          message.error("生成直播流失敗，請重試");
        });
    }
  }, [equipments]);

  useEffect(() => {
    if (isGenerate) {
      loadEquipmentList();
    }
  }, [isGenerate]);

  const onTypeClick = (id: number) => {
    setEndSelectValues((prev) => {
      let newData = clone(prev);

      const isExist = newData.findIndex((item) => item === id) !== -1;

      if (isExist) newData = newData.filter((item) => item !== id);
      else newData.push(id);

      return newData;
    });
  };

  const navigateToFullScreem = (index: number) => {
    const equipmentId = currentEquipmentsIds[index];

    navigate(
      `/monitor/${nowRegionId}/${equipmentId}?regionName=${regionName}`,
      {
        state: {
          equipmentId: equipmentId,
        },
      }
    );
  };

  useUpdateEffect(() => {
    setEndSelectValues(selectValues ?? []);
  }, [selectValues]);

  const loadEquipmentList = () => {
    if (!continueExecution.current) return;

    GetRegionEquipmentList({
      PageIndex: 1,
      PageSize: 2147483647,
      RegionId: nowRegionId ? Number(nowRegionId) : 0,
      TypeLabel: ICameraAiEquipmentTypeLabel.Camera,
    })
      .then((res) => {
        const equipments = res.equipments.map((item, index) => {
          return { ...item, index: index };
        });

        // const equipments = [
        //   {
        //     id: 63,
        //     index: 0,
        //     status: 2,
        //     liveStreaming: ".flv",
        //   },
        //   {
        //     id: 46,
        //     index: 1,
        //     status: 3,
        //     liveStreaming:
        //       "https://camera-ai-realtime.wiltechs.com/1800-1/1201.flv",
        //   },
        //   {
        //     id: 61,
        //     index: 2,
        //     status: 2,
        //     liveStreaming:
        //       "https://camera-ai-realtime.wiltechs.com/1800-1/1201.flv",
        //   },
        // ];

        const data: {
          index: number;
          status: IPlayBackStatus;
          liveStreaming: string;
        }[] = [];

        equipments.forEach((item) => {
          setCurrentEquipmentsIds((prev) => [...prev, item.id]);

          if (
            (item.status === IPlayBackStatus.Success && item.liveStreaming) ||
            item.status === IPlayBackStatus.Failed
          ) {
            data.push({
              index: item.index,
              status: item.status,
              liveStreaming: item.liveStreaming,
            });
          }
        });

        if (
          data.length >= numberDto.number ||
          data.length === equipments.length
        ) {
          const flvList = data.slice(0, numberDto.number);

          if (mpegtsPlayerPlayer.current) {
            mpegtsPlayerPlayer.current.pause();
            mpegtsPlayerPlayer.current.unload();
            mpegtsPlayerPlayer.current.detachMediaElement();
            mpegtsPlayerPlayer.current.destroy();
            mpegtsPlayerPlayer.current = null;
          }

          flvList.map((item, index) => {
            if (item.status === IPlayBackStatus.Success) {
              change(item.liveStreaming, index);
            } else if (item.status === IPlayBackStatus.Failed) {
              setReturnErrorIndexs((prev) => [...prev, index]);
            }
          });

          setIsGenerate(false);

          continueExecution.current = false;

          return;
        }
      })
      .catch(() => {
        message.error("獲取視頻流錯誤，請稍候重試");

        setIsGenerate(false);

        continueExecution.current = false;

        setReturnErrorIndexs([]);

        setErrorFlvIndexs([]);

        return;
      })
      .finally(() => {
        setTimeout(() => {
          loadEquipmentList();
        }, 5000);
      });
  };

  useEffect(() => {
    equipmentsRef.current = equipments;
  }, [equipments]);

  useEffect(() => {
    const cleanup = () => {
      const data = equipmentsRef.current?.map((item) => ({
        equipmentId: item?.id ?? [],
        locationId: item?.locationId ?? [],
        equipmentCode: item?.equipmentCode ?? [],
      }));

      if (data?.length) {
        PostStopRealtime({
          stopList: data,
        });
      }
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      continueExecution.current = false;

      window.removeEventListener("beforeunload", cleanup);

      cleanup();

      if (mpegtsPlayerPlayer.current) {
        mpegtsPlayerPlayer.current.pause();
        mpegtsPlayerPlayer.current.unload();
        mpegtsPlayerPlayer.current.detachMediaElement();
        mpegtsPlayerPlayer.current.destroy();
        mpegtsPlayerPlayer.current = null;
      }
    };
  }, []);

  const change = (flv: string, index: number) => {
    const videoElement = document.getElementById(`video${index}`);

    if (videoElement) {
      const player = Mpegts.createPlayer(
        {
          type: "flv",
          isLive: true,
          url: flv,
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

      player.attachMediaElement(videoElement as HTMLMediaElement);
      player.load();
      player.play();

      player.on(Mpegts.Events.ERROR, () => {
        setErrorFlvIndexs((prev) => [...prev, index]);
      });
    }
  };

  const getVideoBodyheight = () => {
    if (videoBodyRef.current) {
      setVideoBodyWidth(videoBodyRef.current.clientHeight ?? 0);
    }
  };

  useEffect(() => {
    getVideoBodyheight();

    window.addEventListener("resize", getVideoBodyheight);

    return window.removeEventListener("resize", getVideoBodyheight);
  }, []);

  useEffect(() => {
    if (videoBodyWidth !== null && numberDto.number !== null) {
      switch (numberDto.number) {
        case ScreenCountEnum.FOUR:
        case ScreenCountEnum.SIX:
          setVideoItemHeight((videoBodyWidth - 4) / 2);
          break;

        case ScreenCountEnum.NINE:
          setVideoItemHeight((videoBodyWidth - 8) / 3);
          break;
      }
    }
  }, [videoBodyWidth, numberDto.number]);

  return {
    numberDto,
    returnErrorIndexs,
    errorFlvIndexs,
    videoItemHeight,
    videoBodyRef,
    typeList,
    endSelectValues,
    ScreenCountEnum,
    getEquipmentList,
    onTypeClick,
    setNumberDto,
    navigateToFullScreem,
    setSelectValues,
  };
};
