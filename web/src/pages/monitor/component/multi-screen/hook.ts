import { useUpdateEffect } from "ahooks";
import { message } from "antd";
import { clone } from "ramda";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

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

export const useAction = () => {
  const videoBodyRef = useRef<HTMLDivElement>(null);

  const pageDto = {
    PageIndex: 1,
    PageSize: 2147483647,
  };

  const regionId = useParams().areaId;

  const continueExecution = useRef<boolean>(true);

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

  const [selectValues, setSelectValues] = useState<ICameraAiMonitorType[]>([
    ICameraAiMonitorType.People,
    ICameraAiMonitorType.Vehicles,
    ICameraAiMonitorType.AbnormalVehicles,
  ]);

  const [data, setData] = useState<string[]>([]);

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
          (item) => item.status === 0 && item.liveStreaming
        );

        tempSuccessEquipments.map((item) => {
          setSuccessEquipment((prev) => [...prev, item.liveStreaming]);
        });

        if (tempSuccessEquipments.length === res.equipments.length && i > 0) {
          i = 0;

          /* 测试 */
          setData([
            "https://video-builder.oss-cn-hongkong.aliyuncs.com/video/test-001.mp4",
            "https://video-builder.oss-cn-hongkong.aliyuncs.com/video/test-001.mp4",
            "https://video-builder.oss-cn-hongkong.aliyuncs.com/video/test-001.mp4",
          ]);
          setSuccessEquipment([
            "https://video-builder.oss-cn-hongkong.aliyuncs.com/video/test-001.mp4",
            "https://video-builder.oss-cn-hongkong.aliyuncs.com/video/test-001.mp4",
            "https://video-builder.oss-cn-hongkong.aliyuncs.com/video/test-001.mp4",
          ]);

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

  return {
    videoBodyRef,
    layoutMode,
    updateLayoutMode,
    videoBodyWidth,
    videoItemHeight,
    videoLinkArr,
    videoRefs,
    endSelectValues,
    setEndSelectValues,
    onTypeClick,
    typeList,
    onSave,
    setSelectValues,
  };
};
