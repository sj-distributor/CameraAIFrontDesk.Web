import Empty from "antd/es/empty";
import Spin from "antd/es/spin";

import { Img } from "@/components/img";
import { CssType } from "@/components/img/props";

import { useAction } from "./hook";

export const AreaList = () => {
  const { regionDto, clickAreaItem, onScroll } = useAction();

  return (
    <>
      {!regionDto.isFirstGet && regionDto.loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <>
          {regionDto.regionCameras.length > 0 ? (
            <div
              className="flex flex-col h-full w-full overflow-y-auto no-scrollbar"
              onScroll={onScroll}
            >
              <div className="grid auto-grid1 md:auto-grid gap-8">
                {regionDto.regionCameras.map((item, index) => (
                  <div
                    className="aspect-[4/2.25] w-full rounded-xl overflow-hidden"
                    key={index}
                  >
                    <Img
                      url={item?.cameras[0]?.previewImg}
                      title={item.regionAddress}
                      type={CssType.Area}
                      onClickFunction={() =>
                        clickAreaItem(item.id, item.regionAddress)
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center text-[#8B98AD] text-base font-bold h-6 w-full">
                <p>
                  {regionDto.isScorllDown && "正在拉取数据..."}
                  {regionDto.isEnd && "已经到底了"}
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
    </>
  );
};
