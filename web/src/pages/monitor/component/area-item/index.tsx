import Empty from "antd/es/empty";
import Spin from "antd/es/spin";

import { Img } from "@/components/img";
import { CssType } from "@/components/img/props";

import { ScreenTypeSelect } from "../screen-type-select";
import { useAction } from "./hook";

export const AreaItem = () => {
  const {
    layoutMode,
    regionEquipmentDto,
    updateLayoutMode,
    onScroll,
    onClickEquipmentItem,
  } = useAction();

  return (
    <div className="flex-1 flex flex-col space-y-1 h-full w-full">
      <ScreenTypeSelect
        layoutMode={layoutMode}
        updateLayoutMode={updateLayoutMode}
      />

      {!regionEquipmentDto.isFirstGet && regionEquipmentDto.loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <>
          {regionEquipmentDto.equipments.length > 0 ? (
            <div
              className="flex flex-col h-full w-full overflow-y-auto no-scrollbar"
              onScroll={onScroll}
            >
              <div className="grid auto-grid1 md:auto-grid gap-8">
                {regionEquipmentDto?.equipments.map((item, index) => (
                  <div
                    className="bg-red-200 aspect-[4/2.25] w-full rounded-xl overflow-hidden"
                    key={index}
                  >
                    <Img
                      url={item.previewImg}
                      title={item.equipmentName}
                      type={CssType.Equipment}
                      onClickFunction={() => onClickEquipmentItem(item.id)}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center text-[#8B98AD] text-base font-bold h-6 w-full">
                <p>
                  {regionEquipmentDto.isScorllDown && "正在拉取数据..."}
                  {regionEquipmentDto.isEnd && "已经到底了"}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          )}
        </>
      )}

      {/* <div className="flex-1 overflow-y-auto no-scrollbar grid auto-grid1 bg-pink-300 md:bg-green-300 md:auto-grid gap-8">
        {regionEquipmentDto?.equipments.map((item, index) => (
          <div
            className="bg-red-200 aspect-[4/2.25] w-full rounded-xl overflow-hidden"
            key={index}
          >
            <Img
              url="/src/assets/star.jpeg"
              title={item.equipmentName}
              type={CssType.Equipment}
              regionid={11}
              regionName={"556"}
              onClickFunction={() => console.log(111)}
            />
          </div>
        ))}
      </div> */}
    </div>
  );
};
