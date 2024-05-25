import { message } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { ICameraAiMonitorType } from "@/dtos/default";
import { IPlayBackStatus } from "@/dtos/replay";
import {
  IPlayDetailDataDto,
  IPostPlayBackGenerateRequest,
} from "@/dtos/warning";
import { useAuth } from "@/hooks/use-auth";
import KEYS from "@/i18n/keys/alert-list";
import KEYS_VIDEO from "@/i18n/keys/video-playback";
import {
  GetGenerateUrl,
  GetRecordDetailApi,
  PostGeneratePlayBack,
  PostPlaybackGenerateApi,
} from "@/services/warning";
import { useDebounceFn } from "ahooks";

export const useAction = () => {
  const { t } = useAuth();

  const { warningId } = useParams();

  const record = useLocation().state.record;

  const [playDetailData, setPlayDetailData] = useState<IPlayDetailDataDto>({
    areaAdress: "",
    locationId: "",
    equipmentCode: "",
    startTime: "",
    duration: 0,
    taskId: "",
  });

  const [warningRecordDetail, setWarningRecordDetail] = useState<any>();

  const [isFirstGenerate, setIsFirstGenerate] = useState<boolean>(false);

  const [successUrl, setSuccessUrl] = useState<string>("");

  const [isShow, setIsShow] = useState<boolean>(false);

  const [isError, setIsError] = useState<boolean>(false);

  const continueExecution = useRef<boolean>(true);

  const [isOpenExportPlaybackModal, setIsOpenExportPlaybackModal] =
    useState<boolean>(false);

  // 導出視頻接口邏輯
  const handelGetVideoPlayBackUrl = () => {
    {
      if (palybackData.endTime && palybackData.startTime) {
        const data = {
          equipmentCode: playDetailData.equipmentCode,
          monitorTypes: palybackData.monitorTypes,
          locationId: playDetailData.locationId,
          startTime: dayjs
            .utc(palybackData.startTime)
            .format("YYYY_MM_DD_HH_mm_ss"),
          endTime: dayjs
            .utc(palybackData.endTime)
            .format("YYYY_MM_DD_HH_mm_ss"),
        };

        PostGeneratePlayBack(data)
          .then((res) => {
            const { generateTaskId } = res;

            message.info(t(KEYS_VIDEO.GENERATE_VIDEO, { ns: "videoPlayback" }));

            generateTaskId && handelGetVideoPlayBackData(generateTaskId);
          })
          .catch(() => message.error("視頻導出失敗"));
      }
    }
  };

  const { run: handelGetVideoPlayBackUrlDebounceFn } = useDebounceFn(
    handelGetVideoPlayBackUrl,
    {
      wait: 300,
    }
  );

  const [isPlayBackCallBackData, setIsPlayBackCallBackData] =
    useState<boolean>(false);

  // 回調獲取導出視頻url

  const handelGetVideoPlayBackData = (id: string) => {
    if (isPlayBackCallBackData) return;

    id &&
      GetGenerateUrl(id)
        .then((res) => {
          const { generateUrl } = res;

          if (generateUrl) {
            handelDownloadUrl(generateUrl);
            setIsPlayBackCallBackData(true);

            return;
          }
        })
        .catch(() => {});

    setTimeout(() => {
      handelGetVideoPlayBackData(id);
    }, 5000);
  };

  // 下載獲取到的回放url

  const handelDownloadUrl = (url: string) => {
    const a = document.createElement("a");

    const videoUrl = url;

    fetch(videoUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = videoUrl.split("com/")[1];
        a.click();

        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error downloading video:", error));
  };

  const [palybackData, setPalyBlackData] = useState<{
    locationId: string;
    equipmentCode: string;
    startTime?: string;
    endTime?: string;
    monitorTypes: number[];
  }>({
    locationId: "string",
    equipmentCode: "string",
    startTime: "2024-03-28T10:07:04.871Z",
    endTime: "2024-03-28T10:07:04.871Z",
    monitorTypes: [0],
  });

  const recordDetailData = [
    {
      label: `${t(KEYS.DEVICE, { ns: "alertList" })}：`,
      value: record?.equipmentName ?? "----",
    },
    {
      label: `${t(KEYS.ALERT_TYPE, { ns: "alertList" })}：`,
      value: record?.monitorTypeName ?? "----",
    },
    {
      label: `${t(KEYS.ALERT_CONTENT, { ns: "alertList" })}：`,
      value:
        `${record?.equipmentName},${record?.monitorTypeName}(${record?.name})出現超過${record?.monitorDuration}秒` ??
        "----",
    },
    {
      label: `${t(KEYS.AREA_ADRESS, { ns: "alertList" })}：`,
      value: playDetailData?.areaAdress ?? "----",
    },
    {
      label: `${t(KEYS.CONTINUE_TIME, { ns: "alertList" })}：`,
      value:
        `${String(Math.round(record?.settingDuration / 60)).padStart(
          2,
          "0"
        )}:${String(record?.settingDuration % 60).padStart(2, "0")}` ?? "----",
    },
    {
      label: `${t(KEYS.START_TIME, { ns: "alertList" })}：`,
      value:
        dayjs(record?.occurrenceTime).format("YYYY-MM-DD HH:mm:ss") ?? "----",
    },
  ];

  const getEquipmentList = () => {
    if (warningId !== undefined) {
      GetRecordDetailApi({ RecordId: warningId })
        .then((res) => {
          if (res && res.record && res.regionAndArea) {
            const resData = {
              areaAdress: res.regionAndArea.regionAddress,
              locationId: res.regionAndArea.locationId,
              equipmentCode: res.record.equipmentCode,
              startTime: res.record.occurrenceTime,
              duration: res.record.duration,
              taskId: res.record.replayTaskId,
            };

            setWarningRecordDetail(res);

            setPlayDetailData(() => resData);

            const data = getGenerateParams(resData);

            PostPlaybackGenerateApi({
              ...data,
              monitorTypes: [res.record.monitorType],
            })
              .then(() => {
                setIsFirstGenerate(true);
                continueExecution.current = true;
              })
              .catch(() => {
                message.error("生成回放失敗");
              });
          }
        })
        .catch(() => {
          message.error("獲取當前數據失敗");
        });
    } else {
      message.error("無效數據");
    }
  };

  useEffect(() => {
    return () => {
      continueExecution.current = false;
    };
  }, []);

  /* 獲取生成請求的參數 */
  const getGenerateParams = (replayDetailDto: any) => {
    const data: IPostPlayBackGenerateRequest = {
      locationId: replayDetailDto.locationId ?? "",
      equipmentCode: replayDetailDto.equipmentCode ?? "",
      startTime: dayjs
        .utc(replayDetailDto.startTime)
        .format("YYYY_MM_DD_HH_mm_ss"),
      endTime: dayjs
        .utc(replayDetailDto.startTime)
        .add(replayDetailDto.duration ?? 0, "second")
        .format("YYYY_MM_DD_HH_mm_ss"),
      taskId: replayDetailDto.taskId ?? "",
    };

    return data;
  };

  function executeWithDelay() {
    if (warningId !== undefined) {
      if (!continueExecution.current) return;

      GetRecordDetailApi({ RecordId: warningId })
        .then((res) => {
          const record = res.record;

          if (record && record.playbackStatus === IPlayBackStatus.Success) {
            // setSuccessUrl(
            //   "https://video-builder.oss-cn-hongkong.aliyuncs.com/video/test-001.mp4"
            // );
            setSuccessUrl(record.replayUrl);
            setIsFirstGenerate(false);
            setIsShow(true);
            continueExecution.current = false;

            return;
          } else if (
            record &&
            record.playbackStatus === IPlayBackStatus.Failed
          ) {
            message.error("获取视频流失败");
            setIsError(true);
            setSuccessUrl("");
            setIsFirstGenerate(false);
            continueExecution.current = false;
            return;
          } else {
            const data = getGenerateParams(playDetailData);

            PostPlaybackGenerateApi(data);
          }
        })
        .catch(() => message.error("一直調用的接口失敗啦"));
    }

    // 等待5秒钟后再次执行
    setTimeout(() => {
      executeWithDelay(); // 递归调用自己
    }, 5000);
  }

  const handelGetWarningData = (data: any[]) => {
    const getTimeList = (data: any[], type: ICameraAiMonitorType) => {
      return data
        .filter((item) => item.monitorType === type)
        .map((item) => {
          const startTime = item.occurrenceTime;

          const endTime = dayjs(startTime)
            .set("seconds", dayjs(startTime).get("seconds") + item.duration)
            .toISOString();

          return { startTime, endTime };
        });
    };

    const peopleWarningLists = getTimeList(data, ICameraAiMonitorType.People);

    const vehiclesWarningLists = getTimeList(
      data,
      ICameraAiMonitorType.Vehicles
    );

    const abnormalVehiclesWarningLists = getTimeList(
      data,
      ICameraAiMonitorType.AbnormalVehicles
    );

    return {
      [ICameraAiMonitorType.AbnormalVehicles]: abnormalVehiclesWarningLists,
      [ICameraAiMonitorType.People]: peopleWarningLists,
      [ICameraAiMonitorType.Vehicles]: vehiclesWarningLists,
    };
  };

  const warningData = useMemo(() => {
    if (warningRecordDetail) {
      const warningDataList = handelGetWarningData([
        warningRecordDetail.record,
      ]);

      const data = {
        name: warningRecordDetail.record.name,
        type: warningRecordDetail.record.monitorType,
        content: warningRecordDetail.record.exceptionReason,
        startTime: warningRecordDetail.record.occurrenceTime,
        address: warningRecordDetail.regionAndArea.areaName,
        duration: String(warningRecordDetail.record.duration),
        warningDataList,
      };

      return data;
    } else {
      return {
        name: "",
        type: "",
        content: "",
        startTime: "",
        address: "",
        duration: "0",
        warningDataList: {
          [ICameraAiMonitorType.AbnormalVehicles]: [],
          [ICameraAiMonitorType.People]: [],
          [ICameraAiMonitorType.Vehicles]: [],
        },
      };
    }
  }, [warningRecordDetail]);

  useEffect(() => {
    getEquipmentList();
  }, []);

  useEffect(() => {
    if (isFirstGenerate) {
      executeWithDelay();
    }
  }, [isFirstGenerate]);

  return {
    t,
    recordDetailData,
    successUrl,
    isShow,
    isOpenExportPlaybackModal,
    setIsOpenExportPlaybackModal,
    handelGetVideoPlayBackUrlDebounceFn,
    setPalyBlackData,
    warningData,
    isError,
  };
};
