import { Empty, Spin } from "antd";

import { Img } from "@/components/img";
import { CssType } from "@/components/img/props";

import { useAction } from "./hook";

export const ReplayList = () => {
  const { replayDto, onScroll, onJumpDetail } = useAction();

  return (
    <>
      {!replayDto.isFirstGet && replayDto.loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <>
          {replayDto.replays.length > 0 ? (
            <div
              className="flex flex-col h-full w-full overflow-y-auto no-scrollbar"
              onScroll={onScroll}
            >
              <div className="grid auto-grid1 md:auto-grid gap-8">
                {replayDto.replays.map((item, index) => (
                  <div
                    className="bg-red-200 aspect-[4/2.25] w-full rounded-xl overflow-hidden"
                    key={index}
                  >
                    <Img
                      url={"/src/assets/star.jpeg"}
                      title={
                        item.duration
                          ? `${String(Math.round(item.duration / 60)).padStart(
                              2,
                              "0"
                            )}:${String(item.duration % 60).padStart(2, "0")}`
                          : ""
                      }
                      type={CssType.None}
                      onClickFunction={() => {
                        console.log(1);
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center text-[#8B98AD] text-base font-bold h-6 w-full">
                <p>
                  {replayDto.isScorllDown && "正在拉取数据..."}
                  {replayDto.isEnd && "已经到底了"}
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
