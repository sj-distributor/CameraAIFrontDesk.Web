import { useEffect, useRef, useState } from "react";

export const useAction = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const scaleRef = useRef<HTMLDivElement>(null);

  const progressBoxRef = useRef<HTMLDivElement>(null);

  const [duration, setDuration] = useState<number | null>(null);

  const [state, setState] = useState<boolean>(false);

  const [isPlay, setIsPlay] = useState<boolean>(false);

  const [data, setData] = useState<
    {
      second: number[];
      type: number;
    }[]
  >([
    { second: [60, 200], type: 0 },
    { second: [5, 45], type: 1 },
    { second: [180, 990], type: 1 },
  ]);

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

  return {
    videoRef,
    scaleRef,
    duration,
    progressBoxRef,
    speedBoxDto,
    setIsPlay,
    setState,
    getWidth,
    skipTime,
    changeSpeed,
    setSpeedBoxDto,
  };
};
