import {
  DownOutlined,
  InfoCircleFilled,
  PlayCircleFilled,
} from "@ant-design/icons";
import { Slider, Tooltip } from "antd";
import EChartsReact from "echarts-for-react";
import React from "react";

import KEYS from "@/i18n/keys/home-page";

import cameraImg from "../../assets/camera.png";
import fullscreenImg from "../../assets/fullscreen.png";
import volumeImg from "../../assets/volume.png";
import { useAction } from "./hook";

export const Home = () => {
  const {
    t,
    height,
    volume,
    option,
    videoRef,
    cameraList,
    clickCamera,
    selectStatus,
    recordTop5Obj,
    volumeSliderStatus,
    equipmentCountList,
    videoDuration,
    isShow,
    errorFlv,
    videoPlayback,
    handleGetCameraStream,
    setVolume,
    setSelectStatus,
    videoFullScreen,
    setVolumeSliderStatus,
    errorMessage,
  } = useAction();

  return (
    <div className="w-full h-full overflow-auto no-scrollbar box-border p-1 md:p-3 space-y-4 flex flex-col">
      <div
        className="w-full flex-grow bg-white flex flex-col rounded-lg space-y-1 py-4 sm:px-6"
        id="video"
      >
        <div className="flex justify-between" id="video-title">
          <strong className="select-none text-xl">
            {t(KEYS.REALTIME_MONITORING, { ns: "home" })}
          </strong>
          <div className="w-44 flex space-x-1">
            <div className="flex items-center select-none space-x-0.5">
              <img src={cameraImg} alt="" className="w-4 h-4 object-cover" />
              <div className="text-[#566172] w-14 text-sm text-right">
                {t(KEYS.CAMERA, { ns: "home" })}:
              </div>
            </div>
            <div
              className="relative flex-1 flex select-none items-center"
              onMouseEnter={() => setSelectStatus(true)}
              onMouseLeave={() => setSelectStatus(false)}
            >
              <div className="w-[4.375rem] truncate cursor-pointer text-center">
                {clickCamera.equipmentName}
              </div>
              <DownOutlined className="cursor-pointer" />
              {selectStatus && (
                <div className="absolute z-50 -left-1/2 top-full w-32 h-52 bg-white rounded-lg p-2 space-y-2 overflow-y-auto no-scrollbar">
                  {cameraList.regionCameras.map((item, index) => (
                    <div key={index} className="space-y-0.5">
                      <span className="select-none text-sm">
                        {item.regionAddress}
                      </span>
                      <div className="space-y-1">
                        {item?.cameras.map((childItem, childIndex) => (
                          <div
                            key={childIndex}
                            className="hover:bg-[#EBF1FF] hover:text-[#2866F1] rounded-lg p-2 truncate select-none cursor-pointer"
                            onClick={() => {
                              handleGetCameraStream(
                                item.locationId,
                                item.id,
                                childItem.id,
                                childItem
                              );
                              setSelectStatus(false);
                            }}
                          >
                            {childItem.equipmentName}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {height && (
          <div
            className="w-full rounded-lg relative flex justify-center items-center"
            style={{ height: `${height}px` }}
          >
            {errorFlv ? (
              <div className="">{errorMessage}</div>
            ) : (
              <video
                id="homeVideo"
                className="w-full h-full object-fill"
                ref={videoRef}
              />
            )}
            {!isShow && (
              <div className="w-full h-full bg-black bg-opacity-100 absolute top-0 flex items-center justify-center">
                <span className="select-none text-white">等待連接攝像頭</span>
              </div>
            )}
            {isShow && !errorFlv && (
              <div className="w-[calc(100%-8rem)] box-border h-12 absolute top-[85%] mx-16 rounded-[48px] bg-[#0F0F0F] bg-opacity-60 px-4 flex items-center">
                <PlayCircleFilled
                  className="text-white text-[2rem] cursor-pointer"
                  onClick={() => {
                    videoPlayback();
                  }}
                />
                <div className="text-white text-base px-2 select-none flex-1">
                  {videoDuration}
                </div>

                <div
                  className="mx-2 relative"
                  onMouseOver={() => setVolumeSliderStatus(true)}
                  onMouseLeave={() => setVolumeSliderStatus(false)}
                >
                  {volumeSliderStatus && (
                    <div className="absolute w-3/4 h-40 left-[12.5%] -top-40 pt-10 flex flex-col items-center">
                      <div className="flex-1 pb-4 pt-2 flex justify-center bg-[#363636] rounded-lg">
                        <Slider
                          vertical
                          value={volume}
                          onChange={(value) => setVolume(value)}
                          tooltip={{
                            open: false,
                          }}
                        />
                      </div>
                      <div className="w-0 h-0 border-[6px] border-[#363636] border-b-transparent border-r-transparent border-l-transparent" />
                    </div>
                  )}

                  <img
                    src={volumeImg}
                    alt=""
                    className="w-8 h-8 cursor-pointer img-no-darg select-none"
                  />
                </div>

                <img
                  src={fullscreenImg}
                  alt=""
                  className="w-8 h-8 cursor-pointer img-no-darg select-none"
                  onClick={videoFullScreen}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className="block space-y-2 xl:flex xl:space-x-4 xl:space-y-0"
        id="box"
      >
        <div className="flex-grow w-[100%] bg-white flex flex-col xl:max-w-[50%] sm:px-6 py-4 rounded-lg">
          <div className="flex items-center">
            <strong className="text-xl select-none">
              {t(KEYS.TODAY_ALERT, { ns: "home" })} TOP 5
            </strong>
            <Tooltip
              title="本平臺提供全球服務，統一按照太平洋時間（PST）進行統計和紀錄"
              color="#6F6F6F"
            >
              <InfoCircleFilled
                style={{
                  fontSize: "1.25rem",
                  marginLeft: "1rem",
                  color: "#6F6F6F",
                }}
              />
            </Tooltip>
          </div>

          <div className="w-full md:flex md:max-h-[15rem]">
            <div id="echart-main" className="w-full md:w-3/4 overflow-hidden">
              <EChartsReact
                option={option}
                style={{ height: "275px", width: "100%" }}
              />
            </div>
            <div className="flex-1 box-border px-2 flex justify-center space-x-8 m-auto pt-2 md:block md:pt-0 md:px-2 md:space-y-4 md:space-x-0">
              <div className="bg-[#FAFAFB] flex flex-col items-center justify-center h-24 rounded-lg px-4 md:px-0 select-none">
                <span className="w-full px-1 text-wrap text-center">
                  {t(KEYS.MONTHLY_ALERT_COUNT, { ns: "home" })}
                </span>
                <strong className="text-[#2866F1] text-xl">
                  {recordTop5Obj.thisMouthRecordCount}
                </strong>
              </div>
              <div className="bg-[#FAFAFB] flex flex-col items-center justify-center h-24 rounded-lg px-4 md:px-0 select-none">
                <span className="w-full px-1 text-wrap text-center">
                  {t(KEYS.DAILY_ALERT_COUNT, { ns: "home" })}
                </span>
                <strong className="text-[#2866F1] text-xl">
                  {recordTop5Obj.todayRecordCount}
                </strong>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow w-[100%] xl:max-w-[50%] bg-white sm:px-6 py-4 space-y-2 rounded-lg flex flex-col select-none">
          <div className="text-xl font-bold">
            {t(KEYS.DEVICE_SITUATION, { ns: "home" })}
          </div>
          <div className="w-full h-[14rem] md:max-h-[14rem] box-border flex flex-col">
            <div className="grid grid-cols-4">
              {[
                t(KEYS.DEVICE_TYPE, { ns: "home" }),
                t(KEYS.TOTAL_COUNT, { ns: "home" }),
                t(KEYS.ONLINE, { ns: "home" }),
                t(KEYS.OFFLINE, { ns: "home" }),
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-[#F7FAFC] box-border py-2 pl-2 border-y border-solid"
                >
                  <div
                    className={`${
                      index !== 3 &&
                      "border-r-[.125rem] border-solid border-[#E9EDF2]"
                    } text-sm font-bold py-2`}
                  >
                    {item}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full flex-1 overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-4">
                {equipmentCountList.map((item, index) => (
                  <React.Fragment key={index}>
                    <div className="text-lg pl-4 py-4 truncate border-solid border-b-[.0625rem]">
                      {item?.equipmentTypeName}
                    </div>
                    <div className="text-lg pl-4 py-4 truncate border-solid border-b-[.0625rem]">
                      {item?.total}
                    </div>
                    <div className="text-lg pl-4 py-4 truncate border-solid border-b-[.0625rem]">
                      {item?.online}
                    </div>
                    <div className="text-lg pl-4 py-4 truncate border-solid border-b-[.0625rem]">
                      {(item?.total ?? 0) - (item?.online ?? 0)}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
