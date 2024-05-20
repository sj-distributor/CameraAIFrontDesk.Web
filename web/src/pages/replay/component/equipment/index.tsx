import { WarningFilled } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Modal, Popconfirm, Spin } from "antd";
import dayjs from "dayjs";

import { VideoPlayback } from "../../../components/video-playback";
import { useAction } from "./hook";

const { RangePicker } = DatePicker;

export const Equipment = () => {
  const {
    // new
    onTypeClick,
    options,
    successUrl,
    endSelectValues,
    onSave,
    handelGetVideoPlayBackUrlDebounceFn,
    setPalyBlackDate,
    isOpenExportPlaybackModal,
    setIsOpenExportPlaybackModal,
    warningData,
    isError,
    pagePermission,
    isStopLoadingDto,
  } = useAction();

  return (
    <div className="w-full h-full flex-col flex">
      <div>
        {/* <Popconfirm
          title="預警篩選"
          description={
            <div>
              {options.map((item, index) => (
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
        </Popconfirm> */}
        {/* <CheckBoxComponent
          title="預警篩選："
          selectValues={selectValues ?? []}
          onClick={onTypeClick}
          options={options}
        /> */}

        <Popconfirm
          title="預警篩選"
          description={
            <div>
              {options.map((item, index) => (
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

      <Modal
        title={
          <div>
            <WarningFilled className="text-[#ED940F] pr-[.625rem]" />
            確認導出視頻？
          </div>
        }
        open={isOpenExportPlaybackModal}
        onCancel={() => setIsOpenExportPlaybackModal(false)}
        footer={
          <div className="w-full box-border px-4 space-x-2 pt-5 border-t-[1px] border-[#E9EDF2]">
            <button
              className="bg-[#E6EAF4] text-[#8B98AD] rounded-[56px] w-[4.25rem] h-[2.125rem] select-none"
              onClick={() => setIsOpenExportPlaybackModal(false)}
            >
              取消
            </button>
            <button
              className="bg-[#2866F1] text-white rounded-[56px] w-[4.25rem] h-[2.125rem] select-none"
              onClick={() => {
                setIsOpenExportPlaybackModal(false);
                handelGetVideoPlayBackUrlDebounceFn();
              }}
            >
              确认
            </button>
          </div>
        }
        width={660}
      >
        <div className="text-center py-4 h-[5rem] flex justify-center items-center mt-[1.5rem]">
          <div className="font-medium text-[1rem] text-[#566172] select-none self-center">
            選擇導出日期時間範圍：
          </div>
          <RangePicker
            showTime={{ format: "HH:mm:ss" }}
            format="YYYY-MM-DD HH:mm:ss"
            size="large"
            className="exportModelRangePicker"
            minDate={dayjs(warningData.startTime)}
            maxDate={dayjs(warningData.startTime).set(
              "seconds",
              dayjs(warningData.startTime).get("seconds") +
                Number(warningData.duration)
            )}
            bordered={false}
            onChange={(dates) => {
              setPalyBlackDate((prev) => ({
                ...prev,
                startTime:
                  dates && dates?.length >= 1
                    ? dates[0]
                      ? dates[0].toISOString()
                      : undefined
                    : undefined,
                endTime:
                  dates && dates?.length >= 2
                    ? dates[1]
                      ? dates[1].toISOString()
                      : undefined
                    : undefined,
              }));
            }}
          />
        </div>
      </Modal>

      <div className="flex-1 w-full h-[calc(100%-22px)] flex flex-col">
        {!isStopLoadingDto.isStopLoading ? (
          !isError &&
          (!successUrl ? (
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
              canExportVideo={pagePermission.canExportPlaybackVideo}
            />
          ))
        ) : (
          <div className="flex justify-center mt-[15%]">
            {isStopLoadingDto.message}
          </div>"https://video-builder.oss-cn-hongkong.aliyuncs.com/video/test-001.mp4"
        )}
      </div>
    </div>
  );
};
