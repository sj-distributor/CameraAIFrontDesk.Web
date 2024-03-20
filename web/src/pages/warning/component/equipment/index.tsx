import { MouseEventHandler, useEffect, useMemo, useRef, useState } from "react";

export const Equipment = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const progressBoxRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef<HTMLDivElement>(null);

  const [videoSize, setVideoSize] = useState<number | null>(null);

  useEffect(() => {
    const handleCanPlay = () => {
      if (videoRef.current) {
        const duration = Math.floor(videoRef.current?.duration);

        setVideoSize(duration);
      }
    };

    const currentVideoRef = videoRef.current;

    currentVideoRef?.addEventListener("canplay", () => {
      handleCanPlay();
    });

    return () => {
      if (currentVideoRef) {
        currentVideoRef.removeEventListener("canplay", handleCanPlay);
      }
    };
  }, []);

  // 点击视频进度条
  const change: MouseEventHandler<HTMLDivElement> = (e) => {
    if (progressBoxRef.current) {
      console.log(56);
      const percent =
        (e.clientX - progressBoxRef.current.offsetLeft) /
        progressBoxRef.current.offsetWidth;

      if (progressRef.current) {
        console.log(222);
        progressRef.current.style.width = `${
          e.clientX - progressBoxRef.current.offsetLeft
        }px`;
      }

      if (videoRef.current) {
        console.log(111);
        videoRef.current.currentTime = percent * videoRef.current.duration;
        videoRef.current.play();
      }
    }
  };

  // 播放/暂停
  const changeStatus = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  // 改变视频速度
  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // 时分
  function parseTime(value: number) {
    if (!value) return "";
    const interval = Math.floor(value);

    const minute = Math.floor(interval / 60)
      .toString()
      .padStart(2, "0");

    const second = (interval % 60).toString().padStart(2, "0");

    return `${minute}:${second}`;
  }

  const getHeight = () => {
    const camera = document.getElementById("camera");

    if (camera) {
      console.log(camera.clientHeight);
    }
  };

  const [state, setState] = useState<boolean>(false);

  const Com = ({ second }: { second: number[] }) => {
    const hei = useMemo(() => {
      if (progressBoxRef.current && videoSize) {
        return [
          progressBoxRef.current.offsetWidth * (second[0] / videoSize),
          progressBoxRef.current.offsetWidth * (second[1] / videoSize) -
            progressBoxRef.current.offsetWidth * (second[0] / videoSize),
        ];
      }

      return [0, 0];
    }, [second, progressBoxRef.current?.offsetWidth, videoSize]);

    // useEffect(() => {
    //   if (progressBoxRef.current && videoSize) {
    //     console.log(
    //       progressBoxRef.current.offsetWidth * (second[1] / videoSize) -
    //         progressBoxRef.current.offsetWidth * (second[0] / videoSize)
    //     );
    //   }
    // }, [second, progressBoxRef.current?.offsetWidth, videoSize]);

    return (
      <div
        className=" h-full bg-yellow-300 rounded-lg absolute opacity-5"
        style={{ width: `${hei[1]}px`, left: `${hei[0]}px` }}
      />
    );
  };

  const updateProgressBar = (event: any) => {
    if (state) {
      if (progressBoxRef.current) {
        const progressBarWidth = progressBoxRef.current.offsetWidth;

        const clickX =
          event.clientX - progressBoxRef.current.getBoundingClientRect().left;

        const clickPercent = clickX / progressBarWidth;

        if (progressRef.current) {
          // console.log(clickX, "clickX");
          progressRef.current.style.width = `${clickX > 0 ? clickX : 0}px`;
        }

        if (videoRef.current) {
          // console.log(
          //   videoRef.current.currentTime,
          //   "videoRef.current.currentTime",
          //   (60 / videoRef.current.duration) *
          //     progressBoxRef.current.offsetWidth
          // );

          const newTime = clickPercent * videoRef.current.duration;

          videoRef.current.currentTime = newTime;
        }
      }
    }
  };

  const stopDragging = () => {
    setState(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  useEffect(() => {
    if (state) {
      document.addEventListener("mousemove", updateProgressBar);
      document.addEventListener("mouseup", stopDragging);

      return () => {
        document.removeEventListener("mousemove", updateProgressBar);
        document.removeEventListener("mouseup", stopDragging);
      };
    }
  }, [state]);

  return (
    <div className="w-full h-full bg-red-300 flex flex-col space-y-2">
      <div className="bg-white w-full rounded-lg box-border px-6 py-6 space-y-4 select-none">
        <div className="flex flex-wrap text-base space-x-8">
          <div className="flex space-x-3 min-w-80 bg-red-300">
            <span className="text-[#8B98AD]">設備名稱</span>
            <span className="text-[#18283C]">攝像頭001</span>
          </div>
          <div className="flex space-x-3 min-w-80 bg-red-300">
            <span className="text-[#8B98AD]">預警類型</span>
            <span className="text-[#18283C]">識別人員</span>
          </div>
          <div className="flex space-x-3 min-w-80 bg-red-300">
            <span className="text-[#8B98AD]">預警內容</span>
            <span className="text-[#18283C]">
              攝像頭001，識別人員出現超過10秒
            </span>
          </div>
        </div>
        <div className="flex flex-wrap text-base space-x-8">
          <div className="flex space-x-3 min-w-80 bg-red-300">
            <span className="text-[#8B98AD]">區域地址</span>
            <span className="text-[#18283C]">廣東省中山市東區16號</span>
          </div>
          <div className="flex space-x-3 min-w-80 bg-red-300">
            <span className="text-[#8B98AD]">持續時間</span>
            <span className="text-[#18283C]">1m10s</span>
          </div>
          <div className="flex space-x-3 min-w-80 bg-red-300">
            <span className="text-[#8B98AD]">開始時間</span>
            <span className="text-[#18283C]">2023-08-29 19:05:12</span>
          </div>
        </div>
      </div>
      <div className="w-full h-full bg-green-300 min-h-[660px]" id="camera">
        <video
          className="w-full h-[580px] object-cover"
          ref={videoRef}
          controls
        >
          <source src="/src/assets/meeting_01.mp4" />
        </video>

        <div className="ctrl-box">
          <div
            className="progress-box w-full h-5 bg-red-400 flex items-center rounded-lg relative"
            onClick={change}
            ref={progressBoxRef}
            onMouseDown={(e) => {
              setState(true);

              if (progressBoxRef.current) {
                const left = e.pageX - progressBoxRef.current.offsetLeft;

                if (progressRef.current) {
                  progressRef.current.style.width = `${left}px`;
                }
              }
            }}
          >
            <div
              className="progress h-2 bg-blue-300 w-0 absolute"
              ref={progressRef}
            />
            <div className="absolute select-none h-full w-full">
              <Com second={[60, 180]} />
            </div>
          </div>
          <div className="play-btn select-none" onClick={change}>
            切换
          </div>

          <div className="play-btn select-none" onClick={changeStatus}>
            播放/暂停
          </div>

          <div className="progress-time select-none">00:00/00:00</div>
        </div>
      </div>
    </div>
  );
};
