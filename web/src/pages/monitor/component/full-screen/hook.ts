import { useUpdateEffect } from "ahooks";
import { clone } from "ramda";
import { useEffect, useMemo, useRef, useState } from "react";

import { ICameraAiMonitorType } from "@/dtos/default";
import {
  IMonitorDetailResponse,
  IRealtimeGenerateRequest,
} from "@/dtos/monitor";
import { IPlayBackStatus } from "@/dtos/replay";
import { useAuth } from "@/hooks/use-auth";
import { PostStopRealtime } from "@/services/stop-media";
import { GetMonitorDetail, PostRealtimeGenerate } from "@/services/monitor";

export const useAction = () => {
  const { location, message, pagePermission } = useAuth();

  const [paramsDto, setParamsDto] = useState<{
    regionId: string;
    equipmentId: string;
  }>();

  const [isGenerate, setIsGenerate] = useState<boolean>(false);

  const [errorFlv, setErrorFlv] = useState<boolean>(false);

  const [isStopLoadingDto, setIsStopLoadingDto] = useState<{
    isStopLoading: boolean;
    message: string;
  }>({
    isStopLoading: false,
    message: "",
  });

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
      if (!monitorDetail && isGetMonitorDetail) {
        message.error("获取攝像頭失败，请退出当前页面重试");

        return;
      }

      if (!isGenerate && !continueExecution.current && isSuccess) {
        const data = getGenerateParams(monitorDetail!);

        // 调用生成回放
        PostRealtimeGenerate(data)
          .then(() => {
            console.log("生成回放成功");
            setSelectValues(endSelectValues);
            setIsGenerate(true);
            setIsSuccess(false);
            setErrorFlv(false);
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

  const [isGetMonitorDetail, setIsGetMonitorDetail] = useState<boolean>(false);

  useEffect(() => {
    if (paramsDto?.equipmentId) {
      GetMonitorDetail({
        EquipmentId: Number(paramsDto?.equipmentId),
      })
        .then((res) => {
          setMonitorDetail(res ?? null);
          setIsGetMonitorDetail(true);
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
          equipmentId: monitorDetail?.id ?? 0,
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
          setErrorFlv(false);
          console.log("生成实时成功");
        })
        .catch(() => {
          message.error("生成實時失败");

          setIsStopLoadingDto(() => ({
            isStopLoading: true,
            message: "生成實時失败",
          }));
        });
    } else if (isGetMonitorDetail && !monitorDetail) {
      message.error("获取攝像頭失败，请退出当前页面重试");

      setIsStopLoadingDto(() => ({
        isStopLoading: true,
        message: "获取攝像頭失败，请退出当前页面重试",
      }));
    }
  }, [monitorDetail, isGetMonitorDetail]);

  useEffect(() => {
    if (isGenerate) {
      executeWithDelay();
    }
  }, [isGenerate]);

  function executeWithDelay() {
    if (!continueExecution.current) return;

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
            message.error("获取视频流失败");

            setIsStopLoadingDto(() => ({
              isStopLoading: true,
              message: "获取视频流失败",
            }));

            setIsSuccess(false);
            setIsGenerate(false);
            setSuccessUrl("");
            continueExecution.current = false;

            return;
          }
        }
      })
      .catch(() => {
        message.error("獲取視頻流錯誤，請稍候重試");

        setIsStopLoadingDto(() => ({
          isStopLoading: true,
          message: "獲取視頻流錯誤，請稍候重試",
        }));
        setIsSuccess(false);
        setIsGenerate(false);
        setSuccessUrl("");
        continueExecution.current = false;

        return;
      })
      .finally(() => {
        // 等待1秒钟后再次执行
        setTimeout(() => {
          executeWithDelay(); // 递归调用自己
        }, 5000);
      });
  }

  useEffect(() => {
    const params = location.pathname.split("/").filter((item) => item !== "");

    const regionId = params[1],
      equipmentId = params[2] ?? location.state?.equipmentId;

    setParamsDto({
      equipmentId,
      regionId,
    });

    const cleanup = () => {
      monitorDetailRef.current?.locationId &&
        monitorDetailRef.current?.equipmentCode &&
        equipmentId &&
        PostStopRealtime({
          stopList: [
            {
              locationId: monitorDetailRef.current?.locationId,
              equipmentCode: monitorDetailRef.current?.equipmentCode,
              equipmentId: Number(equipmentId),
            },
          ],
        });
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      continueExecution.current = false;

      window.removeEventListener("beforeunload", cleanup);

      cleanup();
    };
  }, []);

  const isShow = useMemo(() => {
    return !continueExecution.current && !isGenerate && isSuccess;
  }, [continueExecution, isGenerate, isSuccess]);

  return {
    onTypeClick,
    onSave,
    successUrl,
    isShow,
    endSelectValues,
    setIsOpenExportPlaybackModal,
    isOpenExportPlaybackModal,
    errorFlv,
    setErrorFlv,
    pagePermission,
    isStopLoadingDto,
  };
};
