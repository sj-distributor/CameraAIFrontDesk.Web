import { useUpdateEffect } from "ahooks";
import { message } from "antd";
import { clone } from "ramda";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ICameraAiMonitorType } from "@/dtos/default";
import {
  ICameraAiEquipmentTypeLabel,
  IRealtimeGenerateRequest,
  IRegionEquipmentItem,
} from "@/dtos/monitor";
import { IPlayBackStatus } from "@/dtos/replay";
import { ScreenType } from "@/entity/screen-type";
import {
  GetRegionEquipmentList,
  PostRealtimeGenerate,
} from "@/services/monitor";
import Mpegts from "mpegts.js";
import { PostStopRealtime } from "@/services/default";

export const useAction = () => {
  const videoBodyRef = useRef<HTMLDivElement>(null);

  const pageDto = {
    PageIndex: 1,
    PageSize: 2147483647,
  };

  const regionId = useParams().areaId;

  const queryString = window.location.search;

  const searchParams = new URLSearchParams(queryString);

  const regionName = searchParams.get("regionName");

  const continueExecution = useRef<boolean>(true);

  const mpegtsPlayerPlayer = useRef<Mpegts.Player | null>(null);

  const equipmentsRef = useRef<IRegionEquipmentItem[] | null>(null);

  const [videoBodyWidth, setVideoBodyWidth] = useState<number | null>(null);

  const [layoutMode, setLayoutMode] = useState<ScreenType | null>(
    ScreenType.FourScreen
  );

  const [endSelectValues, setEndSelectValues] = useState<number[]>([]);

  const [videoItemHeight, setVideoItemHeight] = useState<number | null>(null);

  const [isGenerate, setIsGenerate] = useState<boolean>(false);

  const [equipmentList, setEquipmentList] = useState<IRegionEquipmentItem[]>(
    []
  );

  const [successEquipment, setSuccessEquipment] = useState<string[]>([]);

  const [successEquipmentId, setSuccessEquipmentId] = useState<number[]>([]);

  const [errorEquipmentId, setErrorEquipmentId] = useState<number[]>([]);

  const [selectValues, setSelectValues] = useState<ICameraAiMonitorType[]>([
    ICameraAiMonitorType.People,
    ICameraAiMonitorType.Vehicles,
    ICameraAiMonitorType.AbnormalVehicles,
  ]);

  const [data, setData] = useState<string[]>([]);

  // const [number,setNumber] = useState<number>(0)

  // const [dto, setDto] = useState({
  //   count: 0,
  //   flv: [],
  // });

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
  ];

  const onTypeClick = (id: number) => {
    setEndSelectValues((prev) => {
      let newData = clone(prev);

      const isExist = newData.findIndex((item) => item === id) !== -1;

      if (isExist) newData = newData.filter((item) => item !== id);
      else newData.push(id);

      return newData;
    });
  };

  const updateLayoutMode = (value: any) => {
    setLayoutMode(value as ScreenType);
  };

  const getVideoBodyheight = () => {
    if (videoBodyRef.current) {
      setVideoBodyWidth(videoBodyRef.current.clientHeight ?? 0);
    }
  };

  const numberaa = useMemo(() => {
    switch (layoutMode) {
      case ScreenType.FourScreen:
        return 4;

      case ScreenType.SixScreen:
        return 6;

      case ScreenType.NineScreen:
        return 9;

      default:
        return 0;
    }
  }, [layoutMode]);

  const videoLinkArr = useMemo(() => {
    switch (layoutMode) {
      case ScreenType.FourScreen:
        while (data.length < 4) {
          data.push("");
        }

        return data.slice(0, 4);
      case ScreenType.SixScreen:
        while (data.length < 6) {
          data.push("");
        }

        return data.slice(0, 6);
      case ScreenType.NineScreen:
        while (data.length < 9) {
          data.push("");
        }

        return data.slice(0, 9);
      default:
        return [];
    }
  }, [data, layoutMode]);

  const videoRefs = useMemo(() => {
    return Array.from({ length: videoLinkArr.length }, () =>
      React.createRef<HTMLVideoElement>()
    );
  }, [videoLinkArr]);

  const convert = (data: IRegionEquipmentItem[]) => {
    const result: IRealtimeGenerateRequest = {
      lives: data.map(getGenerateParams),
    };

    return result;
  };

  const getGenerateParams = (monitorDetail: IRegionEquipmentItem) => {
    const data = {
      locationId: monitorDetail?.locationId ?? "",
      equipmentCode: monitorDetail?.equipmentCode ?? "",
      taskId: monitorDetail?.taskId ?? "",
      monitorTypes: endSelectValues,
    };

    return data;
  };

  const onSave = (isTrue: boolean) => {
    if (regionId && isTrue) {
      setData([]);

      setSuccessEquipment([]);

      setSuccessEquipmentId([]);

      setErrorEquipmentId([]);

      GetRegionEquipmentList({
        PageIndex: pageDto.PageIndex,
        PageSize: pageDto.PageSize,
        RegionId: Number(regionId),
        TypeLabel: ICameraAiEquipmentTypeLabel.Camera,
      })
        .then((res) => {
          setEquipmentList(res.equipments);

          PostRealtimeGenerate(convert(res.equipments))
            .then(() => {
              setIsGenerate(true);
              continueExecution.current = true;
            })
            .catch(() => {
              message.error("生成回放失敗");
            });
        })
        .catch(() => {
          message.error("獲取設備數據失敗");
        });
    }
  };

  let i = 0;

  const change = (flv: string, index: number) => {
    if (flv) {
      if (Mpegts.isSupported()) {
        const videoElement = document.getElementById(`video${index}`);

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
        if (videoElement) {
          player.attachMediaElement(videoElement! as HTMLMediaElement);
          player.load();
          player.play();

          player.on(Mpegts.Events.ERROR, (...e) => {
            setErrorEquipmentId((prev) => [...prev, index]);
          });
        }
      }
    }
  };

  function executeWithDelay() {
    if (!continueExecution.current) return;

    GetRegionEquipmentList({
      PageIndex: pageDto.PageIndex,
      PageSize: pageDto.PageSize,
      RegionId: Number(regionId),
      TypeLabel: ICameraAiEquipmentTypeLabel.Camera,
    })
      .then((res) => {
        i++;

        const tempSuccessEquipments = res.equipments.filter(
          (item) =>
            item.status === IPlayBackStatus.Success && item.liveStreaming
        );

        tempSuccessEquipments.map((item) => {
          setSuccessEquipment((prev) => [...prev, item.liveStreaming]);

          setSuccessEquipmentId((prev) => [...prev, item.id]);
        });

        if (tempSuccessEquipments.length === res.equipments.length) {
          // const temp = [
          //   {
          //     liveStreaming: ".flv",
          //   },
          //   {
          //     liveStreaming:
          //       "https://camera-ai-realtime.wiltechs.com/1800-1/1201.flv",
          //   },
          // ];

          if (mpegtsPlayerPlayer.current) {
            mpegtsPlayerPlayer.current.pause();
            mpegtsPlayerPlayer.current.unload();
            mpegtsPlayerPlayer.current.detachMediaElement();
            mpegtsPlayerPlayer.current.destroy();
            mpegtsPlayerPlayer.current = null;
          }

          tempSuccessEquipments.map((item, index) => {
            change(item.liveStreaming, index);
          });

          setIsGenerate(false);
          continueExecution.current = false;

          return;
        } else if (
          res.equipments.some((item) => item.status === IPlayBackStatus.Failed)
        ) {
          PostRealtimeGenerate(convert(equipmentList));
        }
      })
      .catch(() => {
        message.error("調用url接口失敗");
      })
      .finally(() => {
        setTimeout(() => {
          executeWithDelay(); // 递归调用自己
        }, 5000);
      });
  }

  const navigate = useNavigate();

  const navigateToFullScreem = (index: number) => {
    const equipmentId = successEquipmentId[index];

    navigate(`/monitor/${regionId}/${equipmentId}?regionName=${regionName}`, {
      state: {
        equipmentId: equipmentId,
      },
    });
  };

  useEffect(() => {
    onSave(true);

    getVideoBodyheight();

    window.addEventListener("resize", getVideoBodyheight);

    return window.removeEventListener("resize", getVideoBodyheight);
  }, []);

  useEffect(() => {
    const newData = data.map((item, index) => {
      if (index < successEquipment.length) {
        return successEquipment[index];
      } else {
        return item;
      }
    });

    setData(newData);
  }, [layoutMode]);

  useEffect(() => {
    if (isGenerate) {
      executeWithDelay();
    }
  }, [isGenerate]);

  useUpdateEffect(() => {
    setEndSelectValues(selectValues ?? []);
  }, [selectValues]);

  useEffect(() => {
    if (videoBodyWidth !== null && layoutMode !== null) {
      switch (layoutMode) {
        case ScreenType.FourScreen:
        case ScreenType.SixScreen:
          setVideoItemHeight((videoBodyWidth - 4) / 2);
          break;

        case ScreenType.NineScreen:
          setVideoItemHeight((videoBodyWidth - 8) / 3);
          break;
      }
    }
  }, [videoBodyWidth, layoutMode]);

  useEffect(() => {
    equipmentsRef.current = equipmentList;
  }, [equipmentList]);

  useEffect(() => {
    return () => {
      if (mpegtsPlayerPlayer.current) {
        mpegtsPlayerPlayer.current.pause();
        mpegtsPlayerPlayer.current.unload();
        mpegtsPlayerPlayer.current.detachMediaElement();
        mpegtsPlayerPlayer.current.destroy();
        mpegtsPlayerPlayer.current = null;
      }

      continueExecution.current = false;

      const data = equipmentsRef.current?.map((item) => ({
        taskId: item?.taskId ?? [],
        locationId: item?.locationId ?? [],
        equipmentCode: item?.equipmentCode ?? [],
      }));

      PostStopRealtime({
        stopList: data ?? [],
      });
    };
  }, []);

  return {
    videoBodyRef,
    layoutMode,
    updateLayoutMode,
    videoBodyWidth,
    videoItemHeight,
    videoRefs,
    endSelectValues,
    setEndSelectValues,
    onTypeClick,
    typeList,
    onSave,
    setSelectValues,
    numberaa,
    navigateToFullScreem,
    errorEquipmentId,
  };
};
