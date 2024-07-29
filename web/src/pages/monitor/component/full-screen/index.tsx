import { Popconfirm, Spin } from "antd";

import { ICameraAiMonitorType } from "@/dtos/default";
import { VideoPlayback } from "@/pages/components/video-playback";

import { useAction } from "./hook";
import { WarningSelect } from "@/components/warning-select";
import { DownOutlined } from "@ant-design/icons";
import { isEmpty } from "ramda";

export const FullScreen = () => {
  const {
    isShow,
    successUrl,
    errorFlv,
    pagePermission,
    isStopLoadingDto,
    warningSelectRef,
    lastSelectValues,
    lastCheckIndex,
    setErrorFlv,
    setLastSelectValues,
    setLastCheckIndex,
  } = useAction();

  return (
    <div className="w-full h-full flex flex-col">
      <div>
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
