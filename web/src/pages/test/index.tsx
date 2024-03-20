import "rc-ruler/dist/index.css";

import { useEffect, useRef, useState } from "react";

export const Test = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const progressRef = useRef<HTMLDivElement>(null);

  const scaleRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<boolean>(false);

  const [isPlay, setIsPlay] = useState<boolean>(false);

  const [duration, setDuration] = useState<number | null>(null);

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

  const getWidth = (duration: number) => {
    return (
      Math.floor(Math.floor(duration) / 120) * 60 +
      (Math.floor(duration) % 120) * 0.5
    );
  };

  const updateProgressBar = (event: any) => {
    if (state && scaleRef.current && duration) {
      // 鼠标位置 不带滑动
      const clickX =
        event.clientX -
        scaleRef.current.offsetLeft +
        scaleRef.current.scrollLeft;

      // 点击位置位于进度条位置比例
      const clickPercent = clickX / getWidth(duration);

      if (videoRef.current) {
        videoRef.current.currentTime = clickPercent * duration;
        videoRef.current.pause();
      }
    }
  };

  const mouseUp = () => {
    setState(false);
    if (videoRef.current && isPlay) {
      videoRef.current.play();
      setIsPlay(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    const getVideoDuration = () => {
      setDuration(video?.duration ?? 0);
      console.log(video?.duration);
    };

    video?.addEventListener("canplay", getVideoDuration);

    return () => {
      video?.removeEventListener("canplay", getVideoDuration);
    };
  }, []);

  useEffect(() => {
    if (state) {
      document.addEventListener("mousemove", updateProgressBar);
      document.addEventListener("mouseup", mouseUp);

      return () => {
        document.removeEventListener("mousemove", updateProgressBar);
        document.removeEventListener("mouseup", mouseUp);
      };
    }
  }, [state]);

  function parseTime(value: number) {
    if (!value) return "";
    const interval = Math.floor(value);

    const minute = Math.floor(interval / 60)
      .toString()
      .padStart(2, "0");

    const second = (interval % 60).toString().padStart(2, "0");

    return `${minute}:${second}`;
  }

  useEffect(() => {
    if (duration && scaleRef.current) {
      // 视频长度在UI上的宽
      const videoWidth =
        Math.floor(Math.floor(duration) / 120) * 60 +
        (Math.floor(duration) % 120) * 0.5;

      // 进度条
      const progressDiv = document.createElement("div");

      progressDiv.style["position"] = "relative";
      progressDiv.style["height"] = "12px";
      // progressDiv.style["backgroundColor"] = "red";
      progressDiv.style["display"] = "flex";
      progressDiv.style.width = `${videoWidth}px`;

      data.forEach((item) => {
        const div = document.createElement("div");

        div.className = `h-full ${
          item.type === 0 ? "bg-blue-300 z-20" : "bg-yellow-300 z-10"
        } absolute rounded-lg`;

        if (scaleRef.current) {
          div.style.width = `${
            videoWidth * (item.second[1] / (duration ?? 0)) -
            videoWidth * (item.second[0] / (duration ?? 0))
          }px`;

          div.style.left = `${
            videoWidth * (item.second[0] / (duration ?? 0))
          }px`;

          progressDiv.appendChild(div);
        }
      });
      scaleRef.current.appendChild(progressDiv);

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

      div.style.backgroundColor = "yellow";

      scaleRef.current?.append(div);
    }
  }, [duration, data]);

  return (
    <div className="flex flex-col ">
      <video className="w-full h-[580px] object-cover" ref={videoRef} controls>
        <source src="/src/assets/meeting_01.mp4" />
      </video>
      {/* <div className="h-44">
        <div className="flex">
          <div className="w-4">11</div>
          <div
            className="h-12 bg-red-200 relative flex-1"
            ref={progressRef}
            onClick={(e) => {
              // e.pageX 带滑动偏移量
              // e.clientX 不考虑滑动
              if (progressRef.current && duration && videoRef.current) {
                console.log("click");
                videoRef.current.currentTime =
                  ((e.clientX - progressRef.current.offsetLeft) /
                    progressRef.current.offsetWidth) *
                  duration;
              }
            }}
            onMouseDown={() => {
              console.log("done");
              setState(true);
              videoRef.current && setIsPlay(!videoRef.current.paused);
            }}
          />
          <div className="w-4">11</div>
        </div> */}

      {/* <div
        className="h-12 relative overflow-x-auto bg-red-100"
        ref={progressRef}
        onClick={(e) => {
          // e.pageX 带滑动偏移量
          // e.clientX 不考虑滑动
          if (progressRef.current && duration && videoRef.current) {
            console.log("click");
            videoRef.current.currentTime =
              ((e.clientX - progressRef.current.offsetLeft) /
                progressRef.current.offsetWidth) *
              duration;
          }
        }}
        onMouseDown={() => {
          console.log("done");
          setState(true);
          videoRef.current && setIsPlay(!videoRef.current.paused);
        }}
      /> */}
      {/* <div className="w-[calc(100%-2px)] overflow-x-auto" ref={scaleRef} /> */}

      {/* <div className="w-[calc(100%-2px)] h-12 bg-blue-300" ref={boxRef} /> */}
      <div className="flex flex-row">
        <div className="w-8 h-8 bg-red-300">1</div>
        <div
          className="w-[calc(100%-4rem)] overflow-x-auto relative bg-red-500"
          ref={scaleRef}
          onMouseDown={() => {
            setState(true);
            videoRef.current && setIsPlay(!videoRef.current.paused);
          }}
          onClick={(e) => {
            if (scaleRef.current && duration && videoRef.current) {
              videoRef.current.currentTime =
                ((e.clientX -
                  scaleRef.current.offsetLeft +
                  e.currentTarget.scrollLeft) /
                  getWidth(duration)) *
                duration;
            }
          }}
        />
        <div className="w-8 h-8 bg-red-300">3</div>
      </div>
    </div>
  );
};
