import { WarningFilled } from "@ant-design/icons";
import { DatePicker, Modal, Spin } from "antd";

import KEYS_VIDEO from "@/i18n/keys/video-playback";
import { VideoPlayback } from "@/pages/components/video-playback";

import { useAction } from "./hook";

const { RangePicker } = DatePicker;

export const Equipment = () => {
  const {
    t,
    recordDetailData,
    successUrl,
    isShow,
    isOpenExportPlaybackModal,
    setIsOpenExportPlaybackModal,
    handelGetVideoPlayBackUrl,
    setPalyBlackData,
    warningData,
  } = useAction();

  return (
    <>
      <div className="w-full flex flex-col">
        <div className="grid grid-cols-3 gap-4 rounded-lg overflow-y-auto w-full p-6 bg-white h-[7rem]">
          {recordDetailData.map((item, index) => {
            return (
              <div key={index}>
                <span className="text-[#8B98AD]">{item.label}</span>
                <span>{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        title={
          <div>
            <WarningFilled className="text-[#ED940F] pr-[.625rem]" />
            {t(KEYS_VIDEO.CONFIRM_EXPORTING_VIDEO, { ns: "videoPlayback" })}
          </div>
        }
        open={isOpenExportPlaybackModal}
        onCancel={() => setIsOpenExportPlaybackModal(false)}
        footer={
          <div className="w-full box-border px-4 space-x-2 pt-5 border-t-[.0625rem] border-[#E9EDF2]">
            <button
              className="bg-[#E6EAF4] text-[#8B98AD] rounded-[3.5rem] w-[4.25rem] h-[2.125rem] select-none"
              onClick={() => setIsOpenExportPlaybackModal(false)}
            >
              {t(KEYS_VIDEO.CANCEL, { ns: "videoPlayback" })}
            </button>
            <button
              className="bg-[#2866F1] text-white rounded-[3.5rem] w-[4.25rem] h-[2.125rem] select-none"
              onClick={() => {
                setIsOpenExportPlaybackModal(false);
                handelGetVideoPlayBackUrl();
              }}
            >
              {t(KEYS_VIDEO.CONFIRM, { ns: "videoPlayback" })}
            </button>
          </div>
        }
        width={660}
      >
        <div className="text-center py-4 h-[5rem] flex justify-center items-center mt-[1.5rem]">
          <div className="font-medium text-[1rem] text-[#566172] select-none self-center">
            {t(KEYS_VIDEO.EXPORT_DATE, { ns: "videoPlayback" })}
          </div>
          <RangePicker
            showTime={{ format: "HH:mm:ss" }}
            format="YYYY-MM-DD HH:mm:ss"
            size="large"
            className="exportModelRangePicker"
            bordered={false}
            onChange={(dates) => {
              setPalyBlackData((prev) => ({
                ...prev,
                startTime:
                  dates?.length >= 1
                    ? dates[0]
                      ? dates[0].toISOString()
                      : undefined
                    : undefined,
                endTime:
                  dates?.length >= 2
                    ? dates[1]
                      ? dates[1].toISOString()
                      : undefined
                    : undefined,
              }));
            }}
          />
        </div>
      </Modal>

      <div className="h-[calc(100%-7.5rem)] rounded-lg mt-4 flex flex-col">
        {!isShow ? (
          <div className="mt-[15%]">
            <Spin tip="視頻加載中..." size="small">
              <div className="content" />
            </Spin>
          </div>
        ) : (
          <VideoPlayback
            isLive={false}
            warningDetails={warningData}
            videoUrl={successUrl}
            setIsOpenExportPlaybackModal={setIsOpenExportPlaybackModal}
          />
        )}
      </div>
    </>
  );
};
