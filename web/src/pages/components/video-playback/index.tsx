import { Popconfirm, Popover, Spin } from "antd";
import dayjs from "dayjs";
import Mpegts from "mpegts.js";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  A11y,
  FreeMode,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

import { ICameraAiMonitorType } from "@/dtos/default";
import { useAuth } from "@/hooks/use-auth";
import KEYS from "@/i18n/keys/video-playback";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  GoIcon,
  PalyIcon,
  SuspendIcon,
} from "./icon";
import { ElementIcon, PeopleIcon, VehiclesIcon } from "@/icon/monitor";

export type Speed = 0.5 | 1 | 1.25 | 1.5 | 2;

export enum WarningTypes {
  Car,
  Man,
  Element,
}

export const VideoPlayback = (props: {
  isLive: boolean;
  warningDetails: {
    name: string;
    type: string;
    content: string;
    startTime: string;
    address: string;
    duration: string;
    warningDataList: {
      [ICameraAiMonitorType.AbnormalVehicles]: {
        startTime: string;
        endTime: string;
      }[];
      [ICameraAiMonitorType.People]: {
        startTime: string;
        endTime: string;
      }[];
      [ICameraAiMonitorType.Vehicles]: {
        startTime: string;
        endTime: string;
      }[];
      [ICameraAiMonitorType.Animal]: {
        startTime: string;
        endTime: string;
      }[];
    };
  };
  videoUrl: string;
  errorFlv?: boolean;
  setIsOpenExportPlaybackModal?: Dispatch<SetStateAction<boolean>>;
  setErrorFlv?: Dispatch<SetStateAction<boolean>>;
  canExportVideo?: boolean;
}) => {
  const {
    warningDetails,
    videoUrl,
    isLive,
    errorFlv,
    canExportVideo,
    setIsOpenExportPlaybackModal,
    setErrorFlv,
  } = props;

  const videoRef = useRef<HTMLVideoElement>(null!);

  const swiperRef = useRef<SwiperRef>(null!);

  const [isPalyVideo, setIsPalyVideo] = useState<boolean>(false);

  // const [videoDuration, setVideoDuration] = useState<number>(0);

  const [isOpenSpeedList, setIsOpenSpeedList] = useState<boolean>(false);

  // const [videoSpeed, setVideoSpeed] = useState<Speed>(1);

  const mpegtsPlayerPlayer = useRef<Mpegts.Player | null>(null);

  const [timeAxisList, setTimeAxisList] = useState<
    {
      timeList: string[][];
    }[]
  >();

  const { t } = useAuth();

  const handleSetPalyVideo = (duration?: number) => {
    if (videoRef?.current) {
      if (duration) {
        videoRef.current.currentTime = duration;

        videoRef.current.play();

        setIsPalyVideo(true);

        return;
      }

      !videoRef.current.paused
        ? videoRef.current.pause()
        : videoRef.current.play();

      setIsPalyVideo(!videoRef.current.paused);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpenSpeedList(newOpen);
  };

  // 进度条
  const WarnDataVisualizer = (props: {
    warnData: {
      startTime: string;
      endTime: string;
    }[];
    type: WarningTypes;
    index: number;
  }) => {
    const { warnData, type } = props;

    let visualizer = "";

    switch (type) {
      case WarningTypes.Car:
        visualizer = "#34A46E";
        break;

      case WarningTypes.Man:
        visualizer = "#2853E3";
        break;

      case WarningTypes.Element:
        visualizer = "#F48445";
        break;
    }

    return (
      <>
        {warnData.map((item, index) => {
          const perMinuteWidth = swiperRef.current.swiper.width / 40;

          const left =
            (dayjs(item.startTime).diff(
              dayjs(warningDetails.startTime).add(index * 40, "minute"),
              "minute"
            ) *
              perMinuteWidth) /
            16;

          const width =
            (dayjs(item.endTime).diff(dayjs(item.startTime), "minute") *
              perMinuteWidth) /
            16;

          const ProgressTips = () => {
            const iconProps = {
              className:
                "w-[2rem] h-[2rem] flex justify-center items-center rounded-[.5rem]",
              icon: <PeopleIcon />,
              bgColor: "",
            };

            switch (type) {
              case WarningTypes.Man:
                iconProps.icon = <PeopleIcon />;
                iconProps.bgColor = "bg-[#2853E3]";
                break;

              case WarningTypes.Car:
                iconProps.icon = <VehiclesIcon />;
                iconProps.bgColor = "bg-[#34A46E]";
                break;

              case WarningTypes.Element:
                iconProps.icon = <ElementIcon />;
                iconProps.bgColor = "bg-[#F48445]";
                break;
            }

            return (
              <div className={`${iconProps.className} ${iconProps.bgColor}`}>
                {iconProps.icon}
              </div>
            );
          };

          return (
            <Popconfirm
              key={index}
              title=""
              arrow={false}
              trigger="hover"
              description={<ProgressTips />}
              icon={""}
              okButtonProps={{ style: { display: "none" } }}
              cancelButtonProps={{ style: { display: "none" } }}
            >
              <div
                style={{
                  left: `${left}rem`,
                  width: `${width}rem`,
                  backgroundColor: visualizer,
                }}
                className="rounded-[2.875rem] absolute h-4"
              />
            </Popconfirm>
          );
        })}
      </>
    );
  };

  useEffect(() => {
    if (videoUrl && isLive) {
      if (Mpegts.isSupported()) {
        const videoElement = videoRef.current;

        const player = Mpegts.createPlayer(
          {
            type: "flv",
            isLive: true,
            url: videoUrl,
            cors: true,
          },
          {
            enableWorker: true, // 启用分离的线程进行转换（如果不想看到控制台频繁报错把它设置为false，官方的回答是这个属性还不稳定，所以要测试实时视频流的话设置为true控制台经常报错）
            enableStashBuffer: false, // 关闭IO隐藏缓冲区（如果需要最小延迟，则设置为false，此项设置针对直播视频流）
            stashInitialSize: 128, // 减少首帧等待时长（针对实时视频流）
            lazyLoad: false, // 关闭懒加载模式（针对实时视频流）
            lazyLoadMaxDuration: 0.2, // 懒加载的最大时长。单位：秒。建议针对直播：调整为200毫秒
            deferLoadAfterSourceOpen: false, // 在MediaSource sourceopen事件触发后加载。在Chrome上，在后台打开的标签页可能不会触发sourceopen事件，除非切换到该标签页。
            liveBufferLatencyChasing: true, // 追踪内部缓冲区导致的实时流延迟
            liveBufferLatencyMaxLatency: 1.5, // HTMLMediaElement 中可接受的最大缓冲区延迟（以秒为单位）之前使用flv.js发现延时严重，还有延时累加的问题，而mpegts.js对此做了优化，不需要我们自己设置快进追帧了
            liveBufferLatencyMinRemain: 0.3, // HTMLMediaElement 中可接受的最小缓冲区延迟（以秒为单位）
          }
        );

        mpegtsPlayerPlayer.current = player;
        if (videoElement) {
          player.attachMediaElement(videoElement! as HTMLMediaElement);
          player.load();
          player.play();

          player.on(Mpegts.Events.ERROR, () => {
            isLive && setErrorFlv && setErrorFlv(true);
          });

          const handleTimeUpdate = () => {
            if (videoRef.current?.currentTime) {
              const min = Math.round(videoRef.current?.currentTime);

              const minutes = Math.floor(min / 60);

              const remainingSeconds = min % 60;

              const paddedMinutes = String(minutes).padStart(2, "0");

              const paddedSeconds = String(remainingSeconds).padStart(2, "0");

              console.log(`${paddedMinutes}:${paddedSeconds}`);

              // setVideoDuration(`${paddedMinutes}:${paddedSeconds}`);
            }

            // return `${paddedMinutes}:${paddedSeconds}`;
          };

          videoElement.addEventListener("timeupdate", handleTimeUpdate);

          return () => {
            // videoElement.removeEventListener(
            //   "loadedmetadata",
            //   handleLoadedMetadata
            // );
            videoElement.removeEventListener("timeupdate", handleTimeUpdate);
          };
        }
      }
    }

    return () => {
      mpegtsPlayerPlayer?.current?.pause();
      mpegtsPlayerPlayer?.current?.unload();
      mpegtsPlayerPlayer?.current?.detachMediaElement();
      mpegtsPlayerPlayer?.current?.destroy();
    };
  }, [videoUrl]);

  useEffect(() => {
    if (warningDetails.startTime && warningDetails.duration) {
      const duration = isNaN(Number(warningDetails.duration))
        ? 86000
        : Number(warningDetails.duration);

      // setVideoDuration(duration);

      let initialTime = dayjs(warningDetails.startTime)
        .subtract(120, "second")
        .utc();

      const arr = Array.from({ length: Math.ceil(duration / 3000) }).map(() => {
        const timeList = Array.from({ length: 5 }).map(() => {
          const innerTimeList = Array.from({ length: 5 }).map(() => {
            initialTime = initialTime.add(120, "second").utc();

            return initialTime.toISOString();
          });

          return innerTimeList;
        });

        return { timeList };
      });

      setTimeAxisList(arr);
    }
  }, [warningDetails]);

  useEffect(() => {
    timeAxisList && mpegtsPlayerPlayer.current?.play();
  }, [timeAxisList]);

  return (
    <>
      <div className="bg-white h-[calc(100%-130px)] rounded-lg mt-4 relative">
        {!timeAxisList && !errorFlv && (
          <Spin
            tip={
              isLive
                ? t(KEYS.LOADING, { ns: "videoPlayback" })
                : t(KEYS.CONNECTING, { ns: "videoPlayback" })
            }
            size="small"
          >
            <div className="content" />
          </Spin>
        )}

        {errorFlv ? (
          <div className="absolute top-[40%] left-[45%]">
            当前视频出现问题，无法播放
          </div>
        ) : (
          <video
            ref={videoRef}
            onEnded={() => setIsPalyVideo(false)}
            className="w-full h-full object-fill"
            src={isLive ? "" : videoUrl}
          />
        )}

        <div
          className={`bg-[#1f1f3970] h-[4.5rem] absolute bottom-0 w-full flex items-center px-[1.5rem] py-[0.625rem] ${
            isLive ? "justify-center" : "justify-between"
          }`}
        >
          {!isLive && (
            <div
              className="cursor-pointer"
              onClick={() => {
                handleSetPalyVideo();
              }}
            >
              {isPalyVideo ? <SuspendIcon /> : <PalyIcon />}
            </div>
          )}
          <div className="flex font-semibold text-white items-center">
            <span style={{ userSelect: "none" }}>
              {dayjs(warningDetails.startTime).format("dddd HH:mm:ss A")}
            </span>
            <div
              className={`cursor-pointer flex rounded ml-[1.5rem] items-center px-2 text-white border border-white border-solid ${
                isLive ? "bg-[#FF706C]" : ""
              }`}
            >
              {isLive ? (
                <span className="inline-flex w-4 h-4 rounded-full bg-white mr-2" />
              ) : (
                <GoIcon />
              )}
              <span className={`text-[1.125rem] ${isLive ? "text-white" : ""}`}>
                {isLive ? "LIVE" : "Live"}
              </span>
            </div>
          </div>
          {!isLive && (
            <div className="flex text-white font-semibold">
              {canExportVideo && (
                <div
                  className="mr-[1.5rem] cursor-pointer"
                  onClick={() => {
                    setIsOpenExportPlaybackModal &&
                      setIsOpenExportPlaybackModal(true);
                  }}
                >
                  {t(KEYS.EXPORT_VIDEO, { ns: "videoPlayback" })}
                </div>
              )}

              <Popover
                content={[0.5, 1, 1.25, 1.5, 2].map((item) => {
                  return (
                    <div
                      key={item}
                      className="hover:bg-[#ccc] cursor-pointer py-1 px-4 rounded text-center"
                      onClick={() => {
                        videoRef?.current &&
                          (videoRef.current.playbackRate = item);
                        // setVideoSpeed(item as Speed);

                        setIsOpenSpeedList(false);
                      }}
                    >
                      {item}x
                    </div>
                  );
                })}
                trigger="click"
                open={isOpenSpeedList}
                arrow={false}
                onOpenChange={handleOpenChange}
              >
                <div className="cursor-pointer text-white">
                  {t(KEYS.DOUBLE_SPEED, { ns: "videoPlayback" })}
                </div>
              </Popover>
            </div>
          )}
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Scrollbar, FreeMode, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        ref={swiperRef}
        scrollbar={{ draggable: true, hide: true }}
        freeMode={true}
        className="w-full h-24 bg-white rounded-lg relative px-[2.5rem] mt-4"
      >
        <div
          onClick={() => {
            swiperRef.current && swiperRef.current.swiper.slidePrev();
          }}
          className="absolute cursor-pointer top-[1.5rem] z-[99] left-1 transform -translate-y-1/2 text-2xl"
        >
          <ArrowLeftIcon />
        </div>
        {timeAxisList?.map((item, index) => {
          const currentStartTime = dayjs(warningDetails.startTime)
            .add(index + 1 * 40, "minute")
            .utc();

          const currentCarData = warningDetails.warningDataList[
            ICameraAiMonitorType.Vehicles
          ].filter((item) => dayjs(item.startTime) < currentStartTime);

          const currentManData = warningDetails.warningDataList[
            ICameraAiMonitorType.People
          ].filter((item) => dayjs(item.startTime) < currentStartTime);

          const currentElementData = warningDetails.warningDataList[
            ICameraAiMonitorType.Animal
          ].filter((item) => dayjs(item.startTime) < currentStartTime);

          return (
            <SwiperSlide key={index} className="w-full h-24">
              <div key={index} className="w-full h-full min-w-full">
                <div className="flex flex-col h-full justify-between">
                  <div className="w-full h-full flex mt-4">
                    <div className="w-full h-[1.125rem]">
                      <WarnDataVisualizer
                        warnData={currentCarData}
                        index={index}
                        type={WarningTypes.Car}
                      />
                      <WarnDataVisualizer
                        warnData={currentManData}
                        index={index}
                        type={WarningTypes.Man}
                      />
                      <WarnDataVisualizer
                        warnData={currentElementData}
                        index={index}
                        type={WarningTypes.Element}
                      />
                    </div>
                  </div>
                  <div className="w-full flex">
                    {item.timeList.map((item, i) => {
                      const startTime = dayjs(warningDetails.startTime).utc();

                      const endTime = startTime
                        .add(Number(warningDetails.duration ?? 0), "second")
                        .add(5, "minute");

                      return endTime < dayjs(item[0]).utc() ? (
                        <div className="w-1/4 flex flex-col" key={i} />
                      ) : (
                        <div className="w-1/4 flex flex-col" key={i}>
                          <div className="flex items-end">
                            {item.map((time, index) => {
                              const duration = dayjs(time)
                                .utc()
                                .diff(startTime, "second");

                              const endTime = startTime
                                .add(
                                  Number(warningDetails.duration ?? 0),
                                  "second"
                                )
                                .add(2, "second");

                              const endTimeIndex = item.findIndex(
                                (item) => dayjs(item) > endTime
                              );

                              const node = (
                                <div
                                  key={index}
                                  className={`w-1/5 h-max relative`}
                                >
                                  <div className="text-start text-[#5F6279] font-semibold text-[0.875rem] text-nowrap absolute top-[-16px]">
                                    {index === 0 || index === 4
                                      ? dayjs(time).format("hh:mm A")
                                      : ""}
                                  </div>
                                  <div
                                    className={`relative h-2 w-px bg-[#ccc] ${
                                      index === 0 || index === 4
                                        ? "h-3"
                                        : "h-2 "
                                    }`}
                                  />
                                  <span
                                    className="absolute cursor-pointer w-2 h-2 top-1 left-[-4px]"
                                    onClick={() => {
                                      handleSetPalyVideo(duration);
                                    }}
                                  />
                                </div>
                              );

                              return endTimeIndex ? (
                                index <= endTimeIndex ? (
                                  node
                                ) : (
                                  <div
                                    key={index}
                                    className={`w-1/5 h-max relative`}
                                  />
                                )
                              ) : (
                                node
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
        <div
          onClick={() => {
            swiperRef.current && swiperRef.current.swiper.slideNext();
          }}
          className="absolute cursor-pointer z-[99] top-[1.5rem] right-1 transform -translate-y-1/2 text-2xl"
        >
          <ArrowRightIcon />
        </div>
      </Swiper>
    </>
  );
};
