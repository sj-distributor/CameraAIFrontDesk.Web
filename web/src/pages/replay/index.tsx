import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Popconfirm } from "antd";
import { createContext } from "react";
import { useOutlet } from "react-router-dom";

import { BreadcrumbComponent } from "@/components/breadcrumb";
import { RangePickerComponent } from "@/components/date-range-picker";

import { useAction } from "./hook";
import { IReplaySearchDataContext } from "./props";

import KEYS from "@/i18n/keys/video-playback";
import { WarningSelect } from "@/components/warning-select";

export const ReplaySearchDataContext = createContext<IReplaySearchDataContext>(
  null!
);

export const Replay = () => {
  const outlet = useOutlet();

  const {
    replayHeaderRef,
    location,
    timeDto,
    selectValues,
    keyWord,
    height,
    searchKeyWord,
    t,
    onTypeClick,
    setTimeDto,
    setKeyWord,
  } = useAction();

  return (
    <div className="w-full h-full box-border px-5 pt-5 pb-5 flex flex-col space-y-4">
      <div
        className="flex flex-wrap items-center justify-between"
        ref={replayHeaderRef}
      >
        <div>
          <BreadcrumbComponent />
          {location.pathname === "/replay/list" && (
            <div className="flex items-center flex-wrap space-x-4">
              <div>
                <span className="font-medium text-sm text-[#566172] select-none">
                  {t(KEYS.SELECT_DATE, {
                    ns: "videoPlayback",
                  })}
                </span>

                <RangePickerComponent
                  timeDto={timeDto}
                  setTimeDto={setTimeDto}
                />
              </div>

              <Popconfirm
                title=""
                icon={<></>}
                placement="bottom"
                description={WarningSelect}
                okText="保存"
                cancelText="取消"
              >
                <div className="flex justify-center items-center space-x-2">
                  <div className="font-medium text-sm text-[#566172]">
                    預警篩選：
                  </div>
                  <div className="text-[#2866F1] text-[1rem] cursor-pointer">
                    請選擇
                  </div>
                  <DownOutlined className="text-xs" />
                </div>
              </Popconfirm>

              {/* <CheckBoxComponent
                title={t(KEYS.ALERT_FILTER, {
                  ns: "videoPlayback",
                })}
                selectValues={selectValues}
                onClick={onTypeClick}
              /> */}
            </div>
          )}
        </div>
        {location.pathname === "/replay/list" && (
          <div className="flex flex-wrap">
            <Input
              placeholder={t(KEYS.ENTER_DEVICE_NAME, {
                ns: "videoPlayback",
              })}
              className="rounded-[3rem] text-base w-[12.5rem] h-12"
              suffix={<SearchOutlined />}
              value={keyWord}
              onChange={(e) => setKeyWord(e.target.value)}
            />
          </div>
        )}
      </div>

      <div
        className="shrink-0"
        style={{
          height: height + "px",
        }}
      >
        <ReplaySearchDataContext.Provider
          value={{
            searchKeyWord: searchKeyWord,
            timeDto: timeDto,
            selectValues: selectValues,
          }}
        >
          {outlet}
        </ReplaySearchDataContext.Provider>
      </div>
    </div>
  );
};
