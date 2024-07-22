import { Checkbox, Popconfirm, Select } from "antd";

import { useAction } from "./hook";
import { DownOutlined } from "@ant-design/icons";
import { WarningSelect } from "@/components/warning-select";

export const MultiScreen = () => {
  const {
    numberDto,
    returnErrorIndexs,
    errorFlvIndexs,
    videoItemHeight,
    videoBodyRef,
    typeList,
    endSelectValues,
    ScreenCountEnum,
    getEquipmentList,
    onTypeClick,
    setNumberDto,
    navigateToFullScreem,
  } = useAction();

  return (
    <div className="w-full h-full flex flex-col space-y-1">
      <div className="flex items-center mr-4">
        <Popconfirm
          title=""
          icon={<></>}
          placement="bottom"
          description={WarningSelect}
          okText="保存"
          cancelText="取消"
        >
          <div className="flex justify-center items-center space-x-2">
            <div className="font-medium text-sm text-[#566172]">預警篩選：</div>
            <div className="text-[#2866F1] text-[1rem] cursor-pointer">
              請選擇
            </div>
            <DownOutlined className="text-xs" />
          </div>
        </Popconfirm>

        <div className="font-medium text-sm text-[#566172] select-none ml-10">
          分屏模式：
        </div>

        <Select
          className="multiSelect"
          value={numberDto.number}
          style={{ width: 120 }}
          onChange={(value) => {
            setNumberDto((prev) => ({ ...prev, number: value }));
          }}
          options={[
            { value: 4, label: "四屏模式" },
            { value: 6, label: "六屏模式" },
            { value: 9, label: "九屏模式" },
          ]}
        />
      </div>

      <div className="flex-1 flex flex-col bg-white overflow-y-auto no-scrollbar">
        <div
          className={`h-[calc(100%)] overflow-y-auto no-scrollbar grid ${
            numberDto.number === ScreenCountEnum.FOUR
              ? "grid-cols-2"
              : "grid-cols-3"
          } gap-1`}
          ref={videoBodyRef}
        >
          {Array.from({ length: numberDto.number }, (_, index) => index).map(
            (index) => {
              const isReturnErrorIndex = returnErrorIndexs.includes(index);

              const isErrorFlvIndex = errorFlvIndexs.includes(index);

              return (
                <div
                  key={index}
                  className={`${"bg-black"} rounded-md flex justify-center items-center`}
                  style={{ height: videoItemHeight + "px" }}
                >
                  {isReturnErrorIndex ? (
                    <div key={index} className="text-white">
                      获取视频流失败
                    </div>
                  ) : isErrorFlvIndex ? (
                    <div key={index} className="text-white">
                      当前视频出现问题，无法播放
                    </div>
                  ) : (
                    <video
                      id={`video${index}`}
                      className="w-full h-full object-fill rounded-lg"
                      onClick={() => {
                        const videoElement = document.getElementById(
                          `video${index}`
                        );

                        const hasSrcAttribute =
                          videoElement?.getAttribute("src") !== null;

                        if (hasSrcAttribute) {
                          navigateToFullScreem(index);
                        }
                      }}
                    />
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};
