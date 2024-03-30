import { Button, Checkbox, Popconfirm, Spin } from "antd";
import { useEffect } from "react";

import { useAction as checkBoxUseAction } from "@/components/check-box/hook";
import { ICameraAiMonitorType } from "@/dtos/default";
import { VideoPlayback } from "@/pages/components/video-playback";

import { useAction } from "./hook";

export const FullScreen = () => {
  const { typeList } = checkBoxUseAction();

  const {
    // new
    onTypeClick,
    onSave,
    endSelectValues,
  } = useAction();

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
    // <div className="w-full h-full bg-red-300 flex flex-col">
    //   {/* <video id="videoElement" controls />
    //   <div
    //     onClick={() => {
    //       if (flvjs.isSupported()) {
    //         const video = document.getElementById(
    //           "videoElement"
    //         ) as HTMLMediaElement;

    //         const flvPlayer = flvjs.createPlayer({
    //           type: "flv",
    //           url: "http://172.16.147.131:8080/camera/1.flv",
    //         });

    //         if (video) {
    //           flvPlayer.attachMediaElement(video);
    //           flvPlayer.load();
    //           flvPlayer.play();
    //         }
    //       }
    //     }}
    //   >
    //     1312313
    //   </div> */}
    //   <div
    //     className="w-full relative overflow-visible"
    //     style={{
    //       minHeight: `calc(100% - ${66}px)`,
    //     }}
    //   >
    //     <video className="w-full h-full object-cover" ref={videoRef}>
    //       <source src={"/src/assets/meeting_01.mp4"} />
    //     </video>
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
    //             setIsExport((prev) => !prev);
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
    //       onClick={(e) => {
    //         const classNames = (e.target as HTMLDivElement).className.split(
    //           " "
    //         );

    //         if (scaleRef.current && duration && videoRef.current && !isExport) {
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
    //         // onClick={() => skipTime(5)}
    //         onClick={() => {
    //           if (flvjs.isSupported()) {
    //             const flvPlayer = flvjs.createPlayer({
    //               type: "flv",
    //               url: "rtmp://172.16.147.131:1935/stream/example",
    //             });

    //             if (videoRef.current) {
    //               flvPlayer.attachMediaElement(videoRef.current);
    //               flvPlayer.load();
    //               flvPlayer.play();
    //             }
    //             // console.log(flvPlayer);
    //           }
    //         }}
    //       />
    //     </div>
    //   </div>
    // </div>
    <div className="w-full h-full flex flex-col">
      <div>
        <Popconfirm
          title="預警篩選"
          description={
            <div>
              {typeList.map((item, index) => (
                <div
                  key={index}
                  className={`py-2 hover:bg-[#EBF1FF] space-x-2 cursor-pointer text-sm px-4 rounded-lg ${
                    endSelectValues.findIndex(
                      (option) => item.value === option
                    ) !== -1
                      ? "bg-[#EBF1FF] text-[#2866F1]"
                      : "bg-white text-black"
                  }`}
                  onClick={() => onTypeClick(item.value)}
                >
                  <Checkbox
                    checked={
                      endSelectValues.findIndex(
                        (option) => option === item.value
                      ) !== -1
                    }
                  />
                  <span className="select-none">{item.label}</span>
                </div>
              ))}
            </div>
          }
          placement="bottom"
          onConfirm={() => {
            onSave(true);
          }}
          onCancel={() => {
            onSave(false);
          }}
          okText="保存"
          cancelText="取消"
        >
          <Button>預警篩選</Button>
        </Popconfirm>
      </div>
      <div className="flex-1 w-full h-[calc(100%-22px)] flex flex-col">
        {false ? (
          <div className="mt-[15%]">
            <Spin tip="直播連結中..." size="small">
              <div className="content" />
            </Spin>
          </div>
        ) : (
          <VideoPlayback
            isLive={true}
            warningDetails={{
              name: "",
              type: "",
              content: "",
              startTime: "2024-10-10",
              address: "",
              duration: "0",
              warningDataList: {
                [ICameraAiMonitorType.AbnormalVehicles]: [],
                [ICameraAiMonitorType.People]: [],
                [ICameraAiMonitorType.Vehicles]: [],
              },
            }}
            videoUrl={"http://47.254.86.185:8080/live/1.flv"}
          />
        )}
      </div>
    </div>
  );
};
