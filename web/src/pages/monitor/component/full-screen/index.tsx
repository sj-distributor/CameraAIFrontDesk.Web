import { Button, Checkbox, Popconfirm, Spin } from "antd";

import { useAction as checkBoxUseAction } from "@/components/check-box/hook";
import { ICameraAiMonitorType } from "@/dtos/default";
import { VideoPlayback } from "@/pages/components/video-playback";

import { useAction } from "./hook";
import { clone } from "ramda";

export const FullScreen = () => {
  const { typeList, animalList } = checkBoxUseAction();

  const {
    // new
    onTypeClick,
    onSave,
    endSelectValues,
    isShow,
    successUrl,
    errorFlv,
    setErrorFlv,
    pagePermission,
    isStopLoadingDto,
  } = useAction();

  return (
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
                  onClick={() => {
                    if (item.value === ICameraAiMonitorType.Animal) {
                      // 已经有勾选Animal检测后
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
                        // 没有勾选过Animal
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
        {!isStopLoadingDto.isStopLoading ? (
          !isShow ? (
            <div className="mt-[15%]">
              <Spin tip="直播連結中..." size="small">
                <div className="content" />
              </Spin>
            </div>
          ) : (
            !!successUrl && (
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
                videoUrl={successUrl}
                errorFlv={errorFlv}
                setErrorFlv={setErrorFlv}
                canExportVideo={pagePermission.canExportRealtimeVideo}
              />
            )
          )
        ) : (
          <div className="flex justify-center mt-[15%]">
            {isStopLoadingDto.message}
          </div>
        )}
      </div>
    </div>
  );
};
