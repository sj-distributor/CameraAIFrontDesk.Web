import {
  ArrowRightOutlined,
  ExclamationCircleFilled,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";

import { CheckBoxComponent } from "@/components/check-box";

import { useAction } from "./hook";

export const Equipment = () => {
  const {
    videoRef,
    scaleRef,
    duration,
    progressBoxRef,
    speedBoxDto,
    getWidth,
    setIsPlay,
    setState,
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
  } = useAction();

  const [b, setB] = useState<boolean>(false);

  const [exportDto, setExportDto] = useState({
    divStatus: false,
    modalStatus: false,
  });

  const [left, setLeft] = useState<boolean>(false);

  const [right, setRight] = useState<boolean>(false);

  const exportRef = useRef<HTMLDivElement>(null);

  const updateProgressBar = (e: MouseEvent) => {
    if (exportRef.current && scaleRef.current) {
      const container = exportRef.current.parentElement;

      if (container) {
        // 新增宽度
        const width =
          e.clientX +
          scaleRef.current.scrollLeft -
          exportRef.current.offsetLeft -
          exportRef.current.offsetWidth -
          container.offsetLeft;

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

        exportRef.current.style.width =
          (exportRef.current.offsetWidth + width < 5
            ? 5
            : exportRef.current.offsetWidth + width >=
              scaleRef.current.offsetWidth -
                exportRef.current.offsetLeft +
                scaleRef.current.scrollLeft
            ? scaleRef.current.offsetWidth -
              exportRef.current.offsetLeft +
              scaleRef.current.scrollLeft
            : exportRef.current.offsetWidth + width) + "px";
      }
    }
  };

  const mouseUp = (direction: "left" | "right") => {
    direction === "right" ? setRight(false) : setLeft(false);
  };

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

  const updateProgressBarLeft = (e: MouseEvent) => {
    if (exportRef.current && scaleRef.current) {
      const container = exportRef.current.parentElement;

      if (container) {
        const newLeft = e.clientX - container.offsetLeft;

        // 超出当前可视宽度时，默认最宽为可视宽度
        // exportRef.current.style.left =
        //   (newLeft < 0
        //     ? 0
        //     : newLeft >= container.offsetWidth - exportRef.current.offsetWidth
        //     ? container.offsetWidth - exportRef.current.offsetWidth
        //     : newLeft) + "px";

        exportRef.current.style.left =
          (newLeft <= 0
            ? 0
            : newLeft >=
              scaleRef.current.offsetWidth - exportRef.current.offsetWidth
            ? scaleRef.current.offsetWidth - exportRef.current.offsetWidth
            : newLeft) + "px";

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

  const [da, setDa] = useState<
    {
      second: number[];
      type: number;
    }[]
  >([
    { second: [60, 200], type: 0 },
    { second: [5, 45], type: 1 },
    { second: [180, 990], type: 1 },
  ]);

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
          {da.map((item, index) => (
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
          {b && (
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
  }, [da, duration, b]);

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

  return (
    // <div className="w-full h-full flex-col flex space-y-1">
    //   <div
    //     className="w-full relative overflow-visible"
    //     style={{
    //       minHeight: `calc(100% - ${66}px)`,
    //     }}
    //   >
    //     <video className="w-full h-full object-cover" ref={videoRef}>
    //       <source src="/src/assets/long_meeting.mp4" />
    //     </video>
    //     {/* bg-[#0F0F0F] */}
    //     <div className="absolute top-6 left-6 text-white select-none">
    //       2023-08-29 17:36:41
    //     </div>
    //     <div className="w-full h-16 absolute bottom-0 bg-red-300 bg-opacity-60 flex items-center box-border px-6 justify-between">
    //       <img
    //         src="/src/assets/play.png"
    //         alt="暫時不可見"
    //         className="w-8 h-8 object-cover cursor-pointer select-none img-no-darg"
    //         onClick={() =>
    //           videoRef.current?.paused
    //             ? videoRef.current?.play()
    //             : videoRef.current?.pause()
    //         }
    //       />
    //       <div className=" flex select-none items-center space-x-6 text-white">
    //         <span className="font-mono font-bold">Today,3:04:41 pm</span>
    //         <div
    //           className="rounded-[4px] border border-white px-2 py-1 flex space-x-1 cursor-pointer"
    //           onClick={() => console.log(1)}
    //         >
    //           <ArrowRightOutlined />
    //           <span>LIVE</span>
    //         </div>
    //       </div>
    //       <div className="space-x-6 flex select-none text-white">
    //         <div
    //           className="cursor-pointer font-bold"
    //           onClick={() => {
    //             setB((prev) => !prev);
    //           }}
    //         >
    //           導出
    //         </div>
    //         <div
    //           className="cursor-pointer font-bold relative"
    //           onClick={() => {
    //             !speedBoxDto.status &&
    //               setSpeedBoxDto((prev) => ({ ...prev, status: true }));
    //           }}
    //         >
    //           倍速
    //           {speedBoxDto.status && (
    //             <div className="absolute -top-60 bg-white p-2 rounded-lg w-20 space-y-1 z-[9999] -left-[80%]">
    //               {[
    //                 { label: "0.5x", value: 0.5 },
    //                 { label: "1x", value: 1 },
    //                 { label: "1.25x", value: 1.25 },
    //                 { label: "1.5x", value: 1.5 },
    //                 { label: "2x", value: 2 },
    //               ].map((item, index) => (
    //                 <div
    //                   key={index}
    //                   className={`py-2 hover:bg-[#EBF1FF] cursor-pointer text-sm px-4 rounded-lg ${
    //                     item.value === speedBoxDto.speed
    //                       ? "bg-[#EBF1FF] text-[#2866F1]"
    //                       : "bg-white text-black"
    //                   }`}
    //                   onClick={() => changeSpeed(item.value)}
    //                 >
    //                   {item.label}
    //                 </div>
    //               ))}
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <div
    //     className="flex flex-row rounded-lg bg-white shrink-0"
    //     ref={progressBoxRef}
    //   >
    //     <div className="w-8 h-8 flex items-center justify-center">
    //       <LeftOutlined
    //         className="text-xl font-bold text-[#566172]"
    //         onClick={() => skipTime(-5)}
    //       />
    //     </div>
    //     <div
    //       className="w-[calc(100%-4rem)] flex flex-col justify-between overflow-x-auto"
    //       ref={scaleRef}
    //       onMouseDown={() => {
    //         setState(true);
    //         videoRef.current && setIsPlay(!videoRef.current.paused);
    //       }}
    //       onClick={(e) => {
    //         const classNames = (e.target as HTMLDivElement).className.split(
    //           " "
    //         );

    //         if (scaleRef.current && duration && videoRef.current && !b) {
    //           if (
    //             ((e.clientX -
    //               scaleRef.current.offsetLeft +
    //               e.currentTarget.scrollLeft) /
    //               getWidth(duration)) *
    //               duration >
    //               duration ||
    //             !classNames.includes("canClick")
    //           ) {
    //             return;
    //           }

    //           videoRef.current.currentTime =
    //             ((e.clientX -
    //               scaleRef.current.offsetLeft +
    //               e.currentTarget.scrollLeft) /
    //               getWidth(duration)) *
    //             duration;
    //         }
    //       }}
    //     >
    //       {progress}
    //       {scale}
    //     </div>
    //     <div className="w-8 h-8 flex items-center justify-center">
    //       <RightOutlined
    //         className="text-xl font-bold text-[#566172]"
    //         onClick={() => skipTime(5)}
    //       />
    //     </div>
    //   </div>

    //   <Modal
    //     open={false}
    //     footer={null}
    //     maskClosable={false}
    //     centered={true}
    //     destroyOnClose={true}
    //     closeIcon={false}
    //     width={350}
    //   >
    //     <div className="space-y-4">
    //       <div className="flex space-x-2">
    //         <ExclamationCircleFilled className=" text-2xl text-[#f39a4f]" />
    //         <span className="font-bold text-base select-none">
    //           確認導出視頻？
    //         </span>
    //       </div>
    //       <div className="space-x-2 flex justify-end">
    //         <button
    //           className=" w-16 h-9 bg-[#E6EAF4] rounded-[56px] select-none text-[#8B98AD]"
    //           onClick={() => console.log("取消")}
    //         >
    //           取消
    //         </button>
    //         <button
    //           className=" w-16 h-9 bg-[#2866F1] rounded-[56px] select-none text-[#FFFFFF]"
    //           onClick={() => console.log("确认")}
    //         >
    //           确认
    //         </button>
    //       </div>
    //     </div>
    //   </Modal>

    //   {/* <div
    //     className="flex flex-row rounded-lg bg-white shrink-0"
    //     ref={progressBoxRef}
    //   >
    //     <div className="w-8 h-8 flex items-center justify-center">
    //       <LeftOutlined
    //         className="text-xl font-bold text-[#566172]"
    //         onClick={() => skipTime(-5)}
    //       />
    //     </div>
    //     <div className="w-[calc(100%-4rem)] flex flex-col justify-between overflow-x-auto z-20 relative">
    //       {progress}
    //       {scale}
    //     </div>
    //     <div className="w-8 h-8 flex items-center justify-center">
    //       <RightOutlined
    //         className="text-xl font-bold text-[#566172]"
    //         onClick={() => skipTime(5)}
    //       />
    //     </div>
    //   </div> */}
    // </div>

    <div className="w-full h-full flex-col flex bg-red-300">
      <div>
        <CheckBoxComponent
          title="預警篩選："
          selectValues={selectValues}
          onClick={onTypeClick}
          options={options}
        />
      </div>
      <div className="flex-1 bg-green-300 w-full h-[calc(100%-22px)]">
        {!isSuccess ? (
          <div>暂未获取视频</div>
        ) : (
          <div className="w-full h-full bg-pink-300">
            <video
              className="w-full h-[calc(100%-40px)] object-contain"
              ref={videoRef}
            >
              <source src={successUrl} />
            </video>
            <div className="h-10 bg-red-300">996</div>
          </div>
        )}
      </div>
    </div>
  );
};
