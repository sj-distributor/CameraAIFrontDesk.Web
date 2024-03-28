import dayjs from "dayjs";
import { clone } from "ramda";
import { useEffect, useRef, useState } from "react";

import { ICameraAiMonitorType } from "@/dtos/default";
import {
  IPlayBackGenerateRequest,
  IPlayBackStatus,
  IReplayDetailResponse,
} from "@/dtos/replay";
import { useAuth } from "@/hooks/use-auth";
import { GetReplayDetail, PostPlayBackGenerate } from "@/services/replay";
import { typeList } from "@/components/check-box/hook";

export const useAction = () => {
  const { location, message } = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);

  const scaleRef = useRef<HTMLDivElement>(null);

  const progressBoxRef = useRef<HTMLDivElement>(null);

  const [duration, setDuration] = useState<number | null>(null);

  // const [state, setState] = useState<boolean>(false);

  // const [isPlay, setIsPlay] = useState<boolean>(false);

  const data = [
    { second: [60, 200], type: 0 },
    { second: [5, 45], type: 1 },
    { second: [180, 990], type: 1 },
  ];

  const [speedBoxDto, setSpeedBoxDto] = useState<{
    status: boolean;
    speed: number;
  }>({
    status: false,
    speed: 1,
  });

  const getWidth = (duration: number) => {
    return (
      Math.floor(Math.floor(duration) / 120) * 60 +
      (Math.floor(duration) % 120) * 0.5
    );
  };

  // const updateProgressBar = (event: any) => {
  //   if (state && scaleRef.current && duration) {
  //     // 鼠标位置 不带滑动
  //     const clickX =
  //       event.clientX -
  //       scaleRef.current.offsetLeft +
  //       scaleRef.current.scrollLeft;

  //     // 点击位置位于进度条位置比例
  //     const clickPercent = clickX / getWidth(duration);

  //     if (videoRef.current && clickPercent * duration <= duration) {
  //       videoRef.current.currentTime = clickPercent * duration;
  //       videoRef.current.pause();
  //     }
  //   }
  // };

  // const mouseUp = () => {
  //   setState(false);
  //   if (videoRef.current && isPlay) {
  //     videoRef.current.play();
  //     setIsPlay(false);
  //   }
  // };

  const skipTime = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setSpeedBoxDto({
        status: false,
        speed,
      });
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
    if (duration && scaleRef.current && progressBoxRef.current) {
      // 视频长度在UI上的宽
      const videoWidth =
        Math.floor(Math.floor(duration) / 120) * 60 +
        (Math.floor(duration) % 120) * 0.5;

      // 进度条
      const progressDiv = document.createElement("div");

      progressDiv.style["position"] = "relative";
      progressDiv.style["height"] = "32px";
      progressDiv.style["backgroundColor"] = "green";
      progressDiv.style["display"] = "flex";
      progressDiv.style.width = `${videoWidth}px`;
      progressDiv.style.margin = "6px 0";
      progressDiv.className = "canClick";

      data.forEach((item) => {
        const div = document.createElement("div");

        div.className = `h-full ${
          item.type === 0 ? "bg-blue-300 z-20" : "bg-yellow-300 z-10"
        } absolute canClick`;

        div.style["borderRadius"] = "46px";

        div.style.width = `${
          videoWidth * (item.second[1] / (duration ?? 0)) -
          videoWidth * (item.second[0] / (duration ?? 0))
        }px`;

        div.style.left = `${videoWidth * (item.second[0] / (duration ?? 0))}px`;

        progressDiv.appendChild(div);
      });
      // scaleRef.current.appendChild(progressDiv);

      // 刻度条
      // 2分钟 60px 1分钟 30px
      const div = document.createElement("div");

      div.style["display"] = "inline-flex";
      div.style["alignItems"] = "flex-end";

      for (let i = 0; i < Math.floor(Math.floor(duration) / 120); i++) {
        const secondMinDiv = document.createElement("div");

        secondMinDiv.style.width = "60px";
        secondMinDiv.style["height"] = i % 5 === 0 ? "12px" : "5px";

        secondMinDiv.style["boxSizing"] = "border-box";
        secondMinDiv.style["borderLeft"] = "1px solid #8B98AD";
        secondMinDiv.style["flexShrink"] = "0";

        div.appendChild(secondMinDiv);
      }
      if (Math.floor(duration) % 120 !== 0) {
        const remainderDiv = document.createElement("div");

        remainderDiv.style["width"] = `${(Math.floor(duration) % 120) * 0.5}px`;
        remainderDiv.style["height"] =
          Math.floor(Math.floor(duration) / 120) % 5 === 0 ? "12px" : "5px";

        remainderDiv.style["boxSizing"] = "border-box";

        remainderDiv.style["borderLeft"] = "1px solid #8B98AD";
        remainderDiv.style["borderRight"] = "1px solid #8B98AD";
        remainderDiv.style["flexShrink"] = "0";

        if (Math.floor(Math.floor(duration) / 120) % 5 === 0) {
          remainderDiv.style["clipPath"] =
            "polygon(0 0, 100% 50%, 100% 100%, 0 100%)";
        }

        div.appendChild(remainderDiv);
      } else {
        const remainderDiv = document.createElement("div");

        remainderDiv.style["height"] =
          Math.floor(Math.floor(duration) / 120) % 5 === 0 ? "12px" : "5px";
        remainderDiv.style["borderLeft"] = "1px solid #8B98AD";
        div.appendChild(remainderDiv);
      }

      // div.style.backgroundColor = "yellow";

      // scaleRef.current?.append(div);
    }
  }, [duration, data]);

  // new

  const [correlationId, setCorrelationId] = useState("");

  // const [isFirst, setIsFirst] = useState<boolean>(false);

  const [replayDetailDto, setReplayDto] = useState<IReplayDetailResponse>({
    equipment: null,
    totalRecord: null,
    records: [],
  });

  const [selectValues, setSelectValues] = useState<number[]>([]);

  const [options, setOptions] = useState<
    {
      label: string;
      value: ICameraAiMonitorType;
    }[]
  >([]);

  const onTypeClick = (id: number) => {
    isSuccess
      ? setSelectValues((prev) => {
          let newData = clone(prev);

          const isExist = newData.findIndex((item) => item === id) !== -1;

          if (isExist) newData = newData.filter((item) => item !== id);
          else newData.push(id);

          return newData;
        })
      : message.info("在生成視頻，請視頻生成完再更換預警篩選條件");
  };

  useEffect(() => {
    const correlationId =
      location?.state?.correlationId ??
      location?.pathname.split("/").filter((item) => item !== "")[1];

    if (correlationId) setCorrelationId(correlationId);
  }, []);

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
        .catch(() => {
          setReplayDto({
            equipment: null,
            totalRecord: null,
            records: [],
          });
        });
    }
  }, [correlationId]);

  // const [isFirstLoad, setIsFirstLoad] = useState<boolean>(false);

  const [isFirstGenerate, setIsFirstGenerate] = useState<boolean>(false);

  useEffect(() => {
    console.log(replayDetailDto);
    if (
      replayDetailDto.equipment &&
      replayDetailDto.totalRecord &&
      replayDetailDto.records &&
      !isFirstGenerate
    ) {
      // 生成参数
      const data: IPlayBackGenerateRequest = {
        locationId: replayDetailDto.equipment.locationId,
        equipmentCode: replayDetailDto.equipment.equipmentCode,
        startTime: dayjs
          .utc(replayDetailDto.totalRecord.occurrenceTime)
          .format("YYYY-MM-DDTHH:mm:ssZ"),
        endTime: dayjs
          .utc(replayDetailDto.totalRecord.occurrenceTime)
          .add(replayDetailDto.totalRecord.duration, "second")
          .format("YYYY-MM-DDTHH:mm:ssZ"),
        monitorTypes: Array.from(
          new Set(replayDetailDto.records.map((item) => item.monitorType))
        ),
        taskId: replayDetailDto.totalRecord.replayTaskId ?? "",
      };

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

      // 调用生成回放
      PostPlayBackGenerate(data)
        .then(() => {
          console.log("生成回放成功");
          setIsFirstGenerate(true);
        })
        .catch(() => {
          message.error("生成回放失败");
        });
    }
    // if (replayDetailDto.totalRecord) {
    //   console.log(
    //     dayjs
    //       .utc(replayDetailDto.totalRecord.occurrenceTime)
    //       .add(replayDetailDto.totalRecord.duration, "second")
    //       .toISOString(),
    //     replayDetailDto.totalRecord.occurrenceTime
    //   );
    // }
    // const recordStatusSet = Array.from(
    //   new Set(replayDetailDto.records.map((item) => item.recordStatus))
    // );

    // console.log(recordStatusSet);
  }, [replayDetailDto]);

  const [successUrl, setSuccessUrl] = useState<string>("");

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  let continueExecution = true;

  let i = 0;

  useEffect(() => {
    if (isFirstGenerate) {
      executeWithDelay();
    }
  }, [isFirstGenerate]);

  function executeWithDelay() {
    if (!continueExecution) return;

    console.log("Method executed");

    GetReplayDetail({ CorrelationId: correlationId })
      .then((res) => {
        const totalRecord = res.totalRecord;

        i++;
        console.log(res, "一直调用----");

        if (
          (totalRecord &&
            totalRecord.playbackStatus === IPlayBackStatus.Success) ||
          i === 4
        ) {
          // setSuccessUrl(totalRecord.replayUrl);
          setIsSuccess(true);
          setSuccessUrl(
            "https://video-builder.oss-cn-hongkong.aliyuncs.com/video/test-001.mp4"
          );
          continueExecution = false;

          return;
        }
      })
      .catch(() => {});

    // 等待1秒钟后再次执行
    setTimeout(() => {
      executeWithDelay(); // 递归调用自己
    }, 5000);
  }

  return {
    videoRef,
    scaleRef,
    duration,
    progressBoxRef,
    speedBoxDto,
    // setIsPlay,
    // setState,
    getWidth,
    skipTime,
    changeSpeed,
    setSpeedBoxDto,

    // new
    replayDetailDto,
    selectValues,
    onTypeClick,
    options,
    successUrl,
    isSuccess,
  };
};
