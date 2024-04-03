import { Button, Checkbox, Popconfirm, Spin } from "antd";

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
    isShow,
    successUrl,
    errorFlv,
    isReturnErrorStatus,
    setErrorFlv,
    pagePermission,
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
        {!isReturnErrorStatus &&
          (!isShow ? (
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
          ))}
      </div>
    </div>
  );
};
