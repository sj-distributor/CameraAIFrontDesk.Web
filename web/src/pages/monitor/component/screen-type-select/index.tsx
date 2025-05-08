import { DownOutlined, SearchOutlined } from "@ant-design/icons";

import { ScreenType } from "@/entity/screen-type";

import { useAction } from "./hook";
import { Input } from "antd";
import { IRegionEquipmentListResponse } from "@/dtos/monitor";
import { IPageDto } from "@/dtos/default";

interface IDto extends IRegionEquipmentListResponse, IPageDto {
  loading: boolean;
  regionId: number | null;
  regionName: string | null;
  isFirstGet: boolean;
  isScorllDown: boolean;
  isEnd: boolean;
  Keyword?: string;
}

interface IProps {
  layoutMode: ScreenType | null;
  regionEquipmentDto: IDto;
  updateLayoutMode: (value: ScreenType | null) => void;
  updateRegionEquipmentDto: (k: keyof IDto, v: any) => void;
}

export const ScreenTypeSelect = (data: IProps) => {
  const {
    layoutMode,
    regionEquipmentDto,
    updateLayoutMode,
    updateRegionEquipmentDto,
  } = data;

  const { options, isShowOption, wrapperRef, optionsLabel, setIsShowOption } =
    useAction();

  return (
    <div
      className="flex items-center my-[1rem] relative w-full"
      ref={wrapperRef}
    >
      <span className="font-medium text-sm text-[#566172] select-none">
        分屏模式：
      </span>
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setIsShowOption(!isShowOption)}
      >
        <div className="select-none w-auto px-1 truncate text-center text-[#2866F1]">
          {layoutMode === null ? "請選擇" : optionsLabel[layoutMode]}
        </div>
        <DownOutlined className="text-xs" />
      </div>
      {isShowOption && (
        <div className="absolute max-h-60 overflow-auto bg-white rounded-lg box-content w-32 top-8 left-8 flex flex-col justify-center z-50">
          {options.map((item, index) => {
            return (
              <div
                key={index}
                className={`text-center py-3 hover:bg-[#EBF1FF] cursor-pointer text-sm px-4 rounded-lg ${
                  item.value === layoutMode
                    ? "bg-[#EBF1FF] text-[#2866F1]"
                    : "bg-white text-black"
                }`}
                onClick={() => {
                  updateLayoutMode(item.value);
                  setIsShowOption(!isShowOption);
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      )}

      <Input
        placeholder="搜索设备名称"
        className="rounded-[3rem] text-base w-[12.5rem] h-12 ml-auto"
        suffix={<SearchOutlined style={{ color: "#566172" }} />}
        value={regionEquipmentDto.Keyword}
        onChange={(e) => updateRegionEquipmentDto("Keyword", e.target.value)}
      />
    </div>
  );
};
