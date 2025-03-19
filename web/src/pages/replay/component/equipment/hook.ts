import { useDebounceFn, useUpdateEffect } from "ahooks";
import dayjs from "dayjs";
import { clone } from "ramda";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAction as checkBoxUseAction } from "@/components/check-box/hook";
import { ICameraAiMonitorType } from "@/dtos/default";
import {
  IPlayBackGenerateRequest,
  IPlayBackStatus,
  IReplayDetailResponse,
  IReplayRecordItem,
} from "@/dtos/replay";
import { useAuth } from "@/hooks/use-auth";
import {
  GetGenerateUrl,
  GetReplayDetail,
  PostGeneratePlayBack,
  PostPlayBackGenerate,
} from "@/services/replay";
import { getErrorMessage } from "@/utils/error-message";

export const useAction = () => {
  const { location, message, pagePermission, currentTeam } = useAuth();

  const { typeList } = checkBoxUseAction();

  // new
  const [correlationId, setCorrelationId] = useState("");

  const [isError, setIsError] = useState<boolean>(false);

  const [replayDetailDto, setReplayDto] = useState<IReplayDetailResponse>({
    equipment: null,
    totalRecord: null,
    records: [],
  });

  const [selectValues, setSelectValues] = useState<number[] | null>(null);

  const [options, setOptions] = useState<
    {
      label: string;
      value: ICameraAiMonitorType;
    }[]
  >([]);

  const [endSelectValues, setEndSelectValues] = useState<number[]>([]);

  const [isStopLoadingDto, setIsStopLoadingDto] = useState<{
    isStopLoading: boolean;
    message: string;
  }>({
    isStopLoading: false,
    message: "",
  });

  useUpdateEffect(() => {
    setEndSelectValues(selectValues ?? []);
  }, [selectValues]);

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
      if (!isFirstGenerate && !continueExecution.current && isSuccess) {
        const data = getGenerateParams(replayDetailDto);

        // 调用生成回放
        PostPlayBackGenerate(data)
          .then(() => {
            setSelectValues(endSelectValues);
            setIsFirstGenerate(true);
            setIsSuccess(false);
            setSuccessUrl("");
            continueExecution.current = true;
          })
          .catch((error) => {
            message.error(getErrorMessage(error ?? "生成回放失败,请重试"));

            setIsStopLoadingDto(() => ({
              isStopLoading: true,
              message: getErrorMessage(error ?? "生成回放失败,请重试"),
            }));
          });
      } else {
        message.info("在生成視頻，請視頻生成完再更換預警篩選條件");
        setEndSelectValues(selectValues ?? []);
      }
    } else {
      setEndSelectValues(selectValues ?? []);
    }
  };

  // 获取correlationId
  useEffect(() => {
    const correlationId =
      location?.state?.correlationId ??
      location?.pathname.split("/").filter((item) => item !== "")[1];

    if (correlationId) setCorrelationId(correlationId);
  }, []);

  // 获取回放详情接口
  useEffect(() => {
    if (correlationId) {
      GetReplayDetail({ CorrelationId: correlationId })
        .then((res) => {
          setReplayDto({
            equipment: res?.equipment ?? null,
            totalRecord: res?.totalRecord ?? null,
            records: res?.records ?? [],
          });
        })
        .catch((error) => {
          message.error(getErrorMessage(error ?? "获回放詳情數據失敗"));

          setIsStopLoadingDto(() => ({
            isStopLoading: true,
            message: getErrorMessage(error ?? "获回放詳情數據失敗"),
          }));

          setReplayDto({
            equipment: null,
            totalRecord: null,
            records: [],
          });
        });
    }
  }, [correlationId]);

  const [isFirstGenerate, setIsFirstGenerate] = useState<boolean>(false);

  // 获取生成请求的参数
  const getGenerateParams = (replayDetailDto: IReplayDetailResponse) => {
    const data: IPlayBackGenerateRequest = {
      teamId: currentTeam.id,
      locationId: replayDetailDto?.equipment?.locationId ?? "",
      equipmentId: String(replayDetailDto?.equipment?.id) ?? "",
      equipmentCode: replayDetailDto?.equipment?.equipmentCode ?? "",
      startTime: dayjs
        .utc(replayDetailDto?.totalRecord?.occurrenceTime)
        .format("YYYY_MM_DD_HH_mm_ss"),
      endTime: dayjs
        .utc(replayDetailDto?.totalRecord?.occurrenceTime)
        .add(replayDetailDto?.totalRecord?.duration ?? 0, "second")
        .format("YYYY_MM_DD_HH_mm_ss"),
      monitorTypes: selectValues
        ? endSelectValues
        : Array.from(
            new Set(replayDetailDto.records.map((item) => item.monitorType))
          ),
      taskId: replayDetailDto?.totalRecord?.replayTaskId ?? "",
    };

    return data;
  };

  const handelGetWarningData = (data: IReplayRecordItem[]) => {
    const getTimeList = (
      data: IReplayRecordItem[],
      type: ICameraAiMonitorType
    ) => {
      return data
        .filter((item) => item.monitorType === type)
        .map((item) => {
          const startTime = item.occurrenceTime;

          const endTime = dayjs(startTime)
            .set(
              "seconds",
              dayjs(startTime).get("seconds") + item.monitorDuration
            )
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

    const animalWarningLists = getTimeList(data, ICameraAiMonitorType.Animal);

    return {
      [ICameraAiMonitorType.AbnormalVehicles]: abnormalVehiclesWarningLists,
      [ICameraAiMonitorType.People]: peopleWarningLists,
      [ICameraAiMonitorType.Vehicles]: vehiclesWarningLists,
      [ICameraAiMonitorType.Animal]: animalWarningLists,
    };
  };

  useEffect(() => {
    if (
      replayDetailDto.equipment &&
      replayDetailDto.totalRecord &&
      replayDetailDto.records &&
      !isFirstGenerate
    ) {
      // 生成参数
      const data = getGenerateParams(replayDetailDto);

      const recordStatusArray = Array.from(
        new Set(replayDetailDto.records.map((item) => item.monitorType))
      );

      const filteredTypes = typeList.filter((item) =>
        recordStatusArray.includes(item.value)
      );

      // 获取options值
      setOptions(filteredTypes);

      setSelectValues(
        Array.from(
          new Set(replayDetailDto.records.map((item) => item.monitorType))
        )
      );

      // 调用生成回放;
      PostPlayBackGenerate(data)
        .then(() => {
          setIsFirstGenerate(true);
        })
        .catch((error) => {
          message.error(getErrorMessage(error ?? "生成回放失败"));

          setIsStopLoadingDto(() => ({
            isStopLoading: true,
            message: getErrorMessage(error ?? "生成回放失败,请重试"),
          }));
        });
    }
  }, [replayDetailDto]);

  const warningData = useMemo(() => {
    if (
      replayDetailDto &&
      replayDetailDto.equipment &&
      replayDetailDto.totalRecord &&
      replayDetailDto.records.length
    ) {
      const warningDataList = handelGetWarningData(replayDetailDto.records);

      const data = {
        name: replayDetailDto.equipment.equipmentName,
        type: replayDetailDto.equipment.equipmentTypeName,
        content: "",
        startTime: replayDetailDto.totalRecord.occurrenceTime,
        address: replayDetailDto.equipment.areaName,
        duration: String(replayDetailDto.totalRecord.duration),
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
          [ICameraAiMonitorType.Animal]: [],
        },
      };
    }
  }, [replayDetailDto]);

  const [successUrl, setSuccessUrl] = useState<string>("");

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const continueExecution = useRef<boolean>(true);

  const [isOpenExportPlaybackModal, setIsOpenExportPlaybackModal] =
    useState<boolean>(false);

  useEffect(() => {
    if (isFirstGenerate) {
      executeWithDelay();
    }
  }, [isFirstGenerate]);

  function executeWithDelay() {
    if (!continueExecution.current) return;

    GetReplayDetail({ CorrelationId: correlationId })
      .then((res) => {
        const totalRecord = res.totalRecord;

        if (
          totalRecord &&
          totalRecord.playbackStatus === IPlayBackStatus.Success
        ) {
          setSuccessUrl(totalRecord.replayUrl);
          setIsSuccess(true);
          setIsFirstGenerate(false);
          // setSuccessUrl(
          //   "https://video-builder.oss-cn-hongkong.aliyuncs.com/video/test-001.mp4"
          // );
          continueExecution.current = false;

          return;
        } else if (
          totalRecord &&
          totalRecord.playbackStatus === IPlayBackStatus.Failed
        ) {
          getErrorMessage(totalRecord?.errorMessage ?? "获取视频流失败");

          setIsStopLoadingDto(() => ({
            isStopLoading: true,
            message: getErrorMessage(
              totalRecord?.errorMessage ?? "获取视频流失败"
            ),
          }));

          setIsError(true);
          setSuccessUrl("");
          setIsFirstGenerate(false);
          continueExecution.current = false;

          return;
        }
      })
      .catch((error) => {
        message.error(getErrorMessage(error ?? "獲取視頻錯誤，請稍候重試"));
        setIsStopLoadingDto(() => ({
          isStopLoading: true,
          message: getErrorMessage(error ?? "獲取視頻錯誤，請稍候重試"),
        }));
        setIsError(true);
        setSuccessUrl("");
        setIsFirstGenerate(false);
        continueExecution.current = false;
      })
      .finally(() => {
        setTimeout(() => {
          executeWithDelay(); // 递归调用自己
        }, 5000);
      });
  }

  // 導出視頻接口邏輯
  const handelGetVideoPlayBackUrl = () => {
    {
      const {
        equipmentId,
        equipmentCode,
        monitorTypes,
        locationId,
        startTime,
      } = getGenerateParams(replayDetailDto);

      if (palyBackDate.endTime && palyBackDate.startTime) {
        const startDate = dayjs(startTime);

        const duration = replayDetailDto?.totalRecord?.duration ?? 0;

        const endDate = startDate.set(
          "seconds",
          startDate.get("seconds") + duration
        );

        if (
          dayjs(palyBackDate.startTime) < startDate ||
          dayjs(palyBackDate.startTime) > endDate ||
          dayjs(palyBackDate.endTime) > endDate ||
          dayjs(palyBackDate.endTime) < startDate
        ) {
          message.info(
            `請選擇從${startDate.format(
              "YYYY-MM-DDTHH:mm:ss"
            )}到${endDate.format("YYYY-MM-DDTHH:mm:ss")}內的時間`
          );
        }

        const data = {
          equipmentId,
          equipmentCode,
          monitorTypes,
          locationId,
          startTime: dayjs
            .utc(palyBackDate.startTime)
            .format("YYYY_MM_DD_HH_mm_ss"),
          endTime: dayjs
            .utc(palyBackDate.endTime)
            .format("YYYY_MM_DD_HH_mm_ss"),
        };

        PostGeneratePlayBack(data)
          .then((res) => {
            const { generateTaskId } = res;

            message.info("視頻正在生成中，生成成功自動為您下載，請稍等");

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

  const isPlayBackCallBackData = useRef<boolean>(true);

  // 回調獲取導出視頻url

  const handelGetVideoPlayBackData = (id: string) => {
    if (!isPlayBackCallBackData.current) return;

    id &&
      GetGenerateUrl(id)
        .then((res) => {
          const { generateUrl } = res;

          if (generateUrl) {
            handelDownloadUrl(generateUrl);
            isPlayBackCallBackData.current = false;

            return;
          }
        })
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            handelGetVideoPlayBackData(id);
          }, 5000);
        });
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

  const isShow = useMemo(() => {
    return !continueExecution.current && !isFirstGenerate && isSuccess;
  }, [continueExecution, isFirstGenerate, isSuccess]);

  useEffect(() => {
    return () => {
      continueExecution.current = false;
      isPlayBackCallBackData.current = false;
    };
  }, []);

  const [palyBackDate, setPalyBlackDate] = useState<{
    startTime?: string;
    endTime?: string;
  }>({
    startTime: "2024-03-28T10:07:04.871Z",
    endTime: "2024-03-28T10:07:04.871Z",
  });

  return {
    // new
    replayDetailDto,
    selectValues,
    onTypeClick,
    options,
    successUrl,
    isSuccess,
    endSelectValues,
    onSave,
    isShow,
    getGenerateParams,
    handelGetVideoPlayBackUrlDebounceFn,
    setPalyBlackDate,
    isOpenExportPlaybackModal,
    setIsOpenExportPlaybackModal,
    warningData,
    isError,
    pagePermission,
    isStopLoadingDto,
  };
};
