import { useEffect, useRef, useState } from "react";

export const useAction = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const scaleRef = useRef<HTMLDivElement>(null);

  const progressBoxRef = useRef<HTMLDivElement>(null);

  const exportRef = useRef<HTMLDivElement>(null);

  const [duration, setDuration] = useState<number | null>(null);

  const [left, setLeft] = useState<boolean>(false);

  const [right, setRight] = useState<boolean>(false);

  const [speedBoxDto, setSpeedBoxDto] = useState<{
    status: boolean;
    speed: number;
  }>({
    status: false,
    speed: 1,
  });

  const videoSecond = [
    { second: [60, 200], type: 0 },
    { second: [5, 45], type: 1 },
    { second: [180, 990], type: 1 },
  ];

  const [isExport, setIsExport] = useState<boolean>(false);

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setSpeedBoxDto({
        status: false,
        speed,
      });
    }
  };

  const skipTime = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

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

  return {
    videoRef,
    scaleRef,
    exportRef,
    progressBoxRef,
    duration,
    isExport,
    speedBoxDto,
    videoSecond,
    setSpeedBoxDto,
    changeSpeed,
    skipTime,
    getWidth,
    setIsExport,
    setLeft,
    setRight,
  };
};
