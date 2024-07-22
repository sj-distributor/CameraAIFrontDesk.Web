import { Button, Popconfirm, Spin } from "antd";

import { ICameraAiMonitorType } from "@/dtos/default";
import { VideoPlayback } from "@/pages/components/video-playback";

import { useAction } from "./hook";
import { WarningSelect } from "@/components/warning-select";

export const FullScreen = () => {
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
          title=""
          icon={<></>}
          placement="bottomLeft"
          description={WarningSelect}
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
