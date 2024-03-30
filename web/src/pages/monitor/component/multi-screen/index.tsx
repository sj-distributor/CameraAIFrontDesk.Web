// import { FliterWarningComponent } from "@/components/fliterWarning";
import { DownOutlined } from "@ant-design/icons";
import { Checkbox, Popconfirm, message } from "antd";

import { ScreenType } from "@/entity/screen-type";

import { ScreenTypeSelect } from "../screen-type-select";
import { useAction } from "./hook";

export const MultiScreen = () => {
  const {
    videoBodyRef,
    layoutMode,
    updateLayoutMode,
    videoItemHeight,
    videoRefs,
    endSelectValues,
    onTypeClick,
    typeList,
    onSave,
    numberaa,
    navigateToFullScreem,
    errorEquipmentId,
  } = useAction();

  return (
    <div className="w-full h-full flex flex-col space-y-1">
      <div className="flex space-x-1">
        <div className="flex items-center mr-4">
          <div className="font-medium text-sm text-[#566172] select-none">
            預警篩選：
          </div>
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
            <div className="select-none w-auto px-1 truncate text-center text-[#2866F1] cursor-pointer">
              {endSelectValues.length ? "已選擇" : "請選擇"}
              <DownOutlined className="text-xs ml-2" />
            </div>
          </Popconfirm>
        </div>

        <ScreenTypeSelect
          layoutMode={layoutMode}
          updateLayoutMode={updateLayoutMode}
        />
      </div>
      <div className="flex-1 flex flex-col bg-white overflow-y-auto no-scrollbar">
        <div
          className={`h-[calc(100%-44px)] overflow-y-auto no-scrollbar grid ${
            layoutMode === ScreenType.FourScreen ? "grid-cols-2" : "grid-cols-3"
          } gap-1`}
          ref={videoBodyRef}
        >
          {Array.from({ length: numberaa }, (_, index) => index + 1).map(
            (item, index) => (
              <div
                className={`${
                  item && "bg-black"
                } rounded-md flex justify-center items-center`}
                style={{ height: videoItemHeight + "px" }}
                key={index}
              >
                {errorEquipmentId.includes(index) ? (
                  <div className="text-white">当前视频出现问题，无法播放</div>
                ) : (
                  <video
                    id={`video${index}`}
                    ref={videoRefs[index]}
                    className="w-full h-full object-fill rounded-lg"
                    onClick={() => {
                      const videoElement = videoRefs[index].current;

                      const hasSrcAttribute =
                        videoElement?.getAttribute("src") !== null;
                      if (
                        hasSrcAttribute &&
                        !errorEquipmentId.includes(index)
                      ) {
                        navigateToFullScreem(index);
                      }
                    }}
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
