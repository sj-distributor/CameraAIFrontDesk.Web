import { Popconfirm, Select } from "antd";

import { useAction } from "./hook";
import { DownOutlined } from "@ant-design/icons";
import { WarningSelect } from "@/components/warning-select";
import { isEmpty } from "ramda";

export const MultiScreen = () => {
  const {
    numberDto,
    returnErrorIndexs,
    errorFlvIndexs,
    videoItemHeight,
    videoBodyRef,
    ScreenCountEnum,
    warningSelectRef,
    lastSelectValues,
    lastCheckIndex,
    setNumberDto,
    navigateToFullScreem,
    setLastSelectValues,
    setLastCheckIndex,
  } = useAction();

  return (
    <div className="w-full h-full flex flex-col space-y-1">
      <div className="flex items-center mr-4">
        <Popconfirm
          title=""
          icon={<></>}
          placement="bottom"
          description={<WarningSelect ref={warningSelectRef} />}
          okText="保存"
          cancelText="取消"
          onConfirm={() => {
            setLastSelectValues(warningSelectRef.current.selectValues);
            setLastCheckIndex(warningSelectRef.current.checkIndex);
          }}
          onOpenChange={(open) => {
            if (open) {
              warningSelectRef.current.setSelectValues(lastSelectValues);
              warningSelectRef.current.setCheckIndex(lastCheckIndex);
            }
          }}
        >
          <div className="flex items-center w-[10rem]">
            <div className="font-medium text-sm text-[#566172]">預警篩選：</div>
            <div className="text-[#2866F1] text-[1rem] cursor-pointer">
              {isEmpty(lastSelectValues) ? "請選擇" : "已選擇"}
            </div>
            <DownOutlined className="text-xs" />
          </div>
        </Popconfirm>
        {/* <Popconfirm
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
                  onClick={() => {
                    if (item.value === ICameraAiMonitorType.Animal) {
                      if (
                        endSelectValues.includes(ICameraAiMonitorType.Animal)
                      ) {
                        const data = endSelectValues.filter(
                          (item) =>
                            ![
                              ICameraAiMonitorType.Animal,
                              ICameraAiMonitorType.Cat,
                              ICameraAiMonitorType.Bird,
                              ICameraAiMonitorType.Dog,
                            ].includes(item)
                        );

                        onTypeClick(data, true);
                      } else {
                        let checkValues = [
                          ICameraAiMonitorType.Animal,
                          ICameraAiMonitorType.Cat,
                          ICameraAiMonitorType.Bird,
                          ICameraAiMonitorType.Dog,
                        ];

                        // 检查是否所有值都存在于 endSelectValues 中
                        let shouldAddValues = checkValues.some(
                          (value) => !endSelectValues.includes(value)
                        );

                        // 如果有缺失的值，则添加到 endSelectValues 中
                        if (shouldAddValues) {
                          const data = clone(endSelectValues);

                          data.push(
                            ...checkValues.filter(
                              (value) => !endSelectValues.includes(value)
                            )
                          );

                          onTypeClick(data, true);
                        }
                      }
                    } else {
                      onTypeClick(item.value);
                    }
                  }}
                >
                  <Checkbox
                    checked={
                      item.value === ICameraAiMonitorType.Animal
                        ? [
                            ICameraAiMonitorType.Animal,
                            ICameraAiMonitorType.Cat,
                            ICameraAiMonitorType.Bird,
                            ICameraAiMonitorType.Dog,
                          ].every((item) => endSelectValues.includes(item))
                        : endSelectValues.findIndex(
                            (option) => option === item.value
                          ) !== -1
                    }
                    indeterminate={
                      item.value === ICameraAiMonitorType.Animal
                        ? [
                            ICameraAiMonitorType.Animal,
                            ICameraAiMonitorType.Cat,
                            ICameraAiMonitorType.Bird,
                            ICameraAiMonitorType.Dog,
                          ].every((item) => endSelectValues.includes(item))
                          ? false
                          : [
                              ICameraAiMonitorType.Animal,
                              ICameraAiMonitorType.Cat,
                              ICameraAiMonitorType.Bird,
                              ICameraAiMonitorType.Dog,
                            ].some((item) => endSelectValues.includes(item))
                        : false
                    }
                  />
                  <span className="select-none">{item.label}</span>
                </div>
              ))}
              <div className="flex">
                {animalList.map((item, index) => (
                  <div
                    key={index}
                    className={`py-2 hover:bg-[#EBF1FF] space-x-2 cursor-pointer text-sm px-4 rounded-lg ${
                      endSelectValues.findIndex(
                        (option) => item.value === option
                      ) !== -1
                        ? "bg-[#EBF1FF] text-[#2866F1]"
                        : "bg-white text-black"
                    }`}
                    onClick={() => {
                      const data = animalList.map((item) => item.value);

                      if (endSelectValues.includes(item.value)) {
                        const fliterData = data.filter((i) => item.value !== i);

                        const haveCheck = fliterData.some((item) =>
                          endSelectValues.includes(item)
                        );

                        if (haveCheck) {
                          onTypeClick(item.value);
                        } else {
                          onTypeClick([
                            ICameraAiMonitorType.Animal,
                            item.value,
                          ]);
                        }
                      } else {
                        // 增加
                        if (
                          endSelectValues.includes(ICameraAiMonitorType.Animal)
                        ) {
                          onTypeClick(item.value);
                        } else {
                          onTypeClick([
                            ICameraAiMonitorType.Animal,
                            item.value,
                          ]);
                        }
                      }
                    }}
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
            </div>
          }
          placement="bottom"
          // description={WarningSelect}
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
        </Popconfirm> */}

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
