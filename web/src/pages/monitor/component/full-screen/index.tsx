import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import flvjs from "flv.js";
import { useEffect, useMemo } from "react";

import { useAction } from "./hook";

export const FullScreen = () => {
  const {
    videoRef,
    scaleRef,
    exportRef,
    progressBoxRef,
    isExport,
    duration,
    speedBoxDto,
    videoSecond,
    skipTime,
    setSpeedBoxDto,
    changeSpeed,
    setIsExport,
    getWidth,
    setLeft,
    setRight,
  } = useAction();

  const progress = useMemo(() => {
    let videoWidth: number;

    if (duration) {
      videoWidth =
        Math.floor(Math.floor(duration) / 120) * 60 +
          (Math.floor(duration) % 120) * 0.5 ?? 0;

      return (
        <div
          className="relative h-[20px] flex canClick box-border my-[6px] z-10"
          style={{
            width: `${videoWidth}px`,
          }}
        >
          {videoSecond.map((item, index) => (
            <div
              key={index}
              className={`h-full ${
                item.type === 0 ? "bg-[#2853E3] z-20" : "bg-[#34A46E] z-10"
              } absolute canClick rounded-[46px]`}
              style={{
                width: `${
                  videoWidth * (item.second[1] / (duration ?? 0)) -
                  videoWidth * (item.second[0] / (duration ?? 0))
                }px`,
                left: `${videoWidth * (item.second[0] / (duration ?? 0))}px`,
              }}
            />
          ))}
          {isExport && (
            <div className="flex h-5 w-12 absolute z-30" ref={exportRef}>
              <div
                className="w-[1px] bg-[#F49B45] cursor-pointer relative"
                onMouseDown={(event) => {
                  setLeft(true);
                  event.preventDefault();
                }}
              >
                <div className="absolute w-1 h-1 rounded-full -top-[2px] -left-full bg-[#F49B45]" />
                <div className="absolute w-1 h-1 rounded-full -bottom-[2px] -left-full bg-[#F49B45]" />
              </div>
              <div className="bg-[#FDD38C] bg-opacity-80 grow" />
              <div
                className="w-[1px] bg-[#F49B45] cursor-pointer relative"
                onMouseDown={(event) => {
                  setRight(true);
                  event.preventDefault();
                }}
              >
                <div className="absolute w-1 h-1 rounded-full -top-[2px] -left-full bg-[#F49B45]" />
                <div className="absolute w-1 h-1 rounded-full -bottom-[2px] -left-full  bg-[#F49B45]" />
              </div>
            </div>
          )}
        </div>
      );
    }

    return <></>;
  }, [videoSecond, duration, isExport]);

  const scale = useMemo(() => {
    if (duration) {
      const num = Math.floor(Math.floor(duration) / 120);

      const remainder = Math.floor(duration) % 120;

      return (
        <div className="max-h-[12px] flex items-end">
          {Array.from({ length: num }).map((_, index) => (
            <div
              key={index}
              className={`w-[60px] ${
                index % 5 === 0 ? "h-[12px]" : "h-[5px]"
              } box-border shrink-0 border-l border-[#8B98AD] border-solid`}
            />
          ))}
          {remainder !== 0 ? (
            <div
              className={`${
                num % 5 === 0 ? "h-[12px]" : "h-[5px]"
              } box-border border-l border-r border-[#8B98AD] shrink-0 border-solid`}
              style={{
                width: `${remainder * 0.5}px`,
                clipPath:
                  num % 5 === 0
                    ? "polygon(0 0, 100% 50%, 100% 100%, 0 100%)"
                    : undefined,
              }}
            />
          ) : (
            <div
              className={`${
                num % 5 === 0 ? "h-[12px]" : "h-[5px]"
              } border-l border-solid border-[#8B98AD]`}
            />
          )}
        </div>
      );
    }

    return <></>;
  }, [duration]);

  useEffect(() => {
    // if (flvjs.isSupported()) {
    //   const video = document.getElementById("videoElement") as HTMLMediaElement;
    //   const flvPlayer = flvjs.createPlayer({
    //     type: "flv",
    //     url: "http://172.16.147.131:8080/camera/1.flv",
    //   });
    //   if (videoRef.current) {
    //     flvPlayer.attachMediaElement(videoRef.current);
    //     flvPlayer.play();
    //   }
    //   // console.log(flvPlayer);
    // }
  }, []);

  return (
    <div className="w-full h-full bg-red-300 flex flex-col">
      {/* <video id="videoElement" controls />
      <div
        onClick={() => {
          if (flvjs.isSupported()) {
            const video = document.getElementById(
              "videoElement"
            ) as HTMLMediaElement;

            const flvPlayer = flvjs.createPlayer({
              type: "flv",
              url: "http://172.16.147.131:8080/camera/1.flv",
            });

            if (video) {
              flvPlayer.attachMediaElement(video);
              flvPlayer.load();
              flvPlayer.play();
            }
          }
        }}
      >
        1312313
      </div> */}
      <div
        className="w-full relative overflow-visible"
        style={{
          minHeight: `calc(100% - ${66}px)`,
        }}
      >
        <video className="w-full h-full object-cover" ref={videoRef}>
          <source src={"/src/assets/meeting_01.mp4"} />
        </video>
        <div className="absolute top-6 left-6 text-white select-none">
          2023-08-29 17:36:41
        </div>
        <div className="w-full h-16 absolute bottom-0 bg-red-300 bg-opacity-60 flex items-center box-border px-6 justify-between">
          <img
            src="/src/assets/play.png"
            alt="暫時不可見"
            className="w-8 h-8 object-cover cursor-pointer select-none img-no-darg"
            onClick={() =>
              videoRef.current?.paused
                ? videoRef.current?.play()
                : videoRef.current?.pause()
            }
          />
          <div className=" flex select-none items-center space-x-6 text-white">
            <span className="font-mono font-bold">Today,3:04:41 pm</span>
            <div
              className="rounded-[4px] border border-white px-2 py-1 flex space-x-1 cursor-pointer"
              onClick={() => console.log(1)}
            >
              <ArrowRightOutlined />
              <span>LIVE</span>
            </div>
          </div>
          <div className="space-x-6 flex select-none text-white">
            <div
              className="cursor-pointer font-bold"
              onClick={() => {
                setIsExport((prev) => !prev);
              }}
            >
              導出
            </div>
            <div
              className="cursor-pointer font-bold relative"
              onClick={() => {
                !speedBoxDto.status &&
                  setSpeedBoxDto((prev) => ({ ...prev, status: true }));
              }}
            >
              倍速
              {speedBoxDto.status && (
                <div className="absolute -top-60 bg-white p-2 rounded-lg w-20 space-y-1 z-[9999] -left-[80%]">
                  {[
                    { label: "0.5x", value: 0.5 },
                    { label: "1x", value: 1 },
                    { label: "1.25x", value: 1.25 },
                    { label: "1.5x", value: 1.5 },
                    { label: "2x", value: 2 },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`py-2 hover:bg-[#EBF1FF] cursor-pointer text-sm px-4 rounded-lg ${
                        item.value === speedBoxDto.speed
                          ? "bg-[#EBF1FF] text-[#2866F1]"
                          : "bg-white text-black"
                      }`}
                      onClick={() => changeSpeed(item.value)}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex flex-row rounded-lg bg-white shrink-0"
        ref={progressBoxRef}
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <LeftOutlined
            className="text-xl font-bold text-[#566172]"
            onClick={() => skipTime(-5)}
          />
        </div>
        <div
          className="w-[calc(100%-4rem)] flex flex-col justify-between overflow-x-auto"
          ref={scaleRef}
          onClick={(e) => {
            const classNames = (e.target as HTMLDivElement).className.split(
              " "
            );

            if (scaleRef.current && duration && videoRef.current && !isExport) {
              if (
                ((e.clientX -
                  scaleRef.current.offsetLeft +
                  e.currentTarget.scrollLeft) /
                  getWidth(duration)) *
                  duration >
                  duration ||
                !classNames.includes("canClick")
              ) {
                return;
              }

              videoRef.current.currentTime =
                ((e.clientX -
                  scaleRef.current.offsetLeft +
                  e.currentTarget.scrollLeft) /
                  getWidth(duration)) *
                duration;
            }
          }}
        >
          {progress}
          {scale}
        </div>
        <div className="w-8 h-8 flex items-center justify-center">
          <RightOutlined
            className="text-xl font-bold text-[#566172]"
            // onClick={() => skipTime(5)}
            onClick={() => {
              if (flvjs.isSupported()) {
                const flvPlayer = flvjs.createPlayer({
                  type: "flv",
                  url: "rtmp://172.16.147.131:1935/stream/example",
                });

                if (videoRef.current) {
                  flvPlayer.attachMediaElement(videoRef.current);
                  flvPlayer.load();
                  flvPlayer.play();
                }
                // console.log(flvPlayer);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
