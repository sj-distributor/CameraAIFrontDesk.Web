import "dayjs/locale/zh-cn";

import { Empty, Spin } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { Img } from "@/components/img";
import { CssType } from "@/components/img/props";
import { ICameraAiMonitorType } from "@/dtos/default";

import { useAction } from "./hook";

dayjs.extend(utc);

export const ReplayList = () => {
  const { replayDto, onScroll, onJumpDetail, showCircle, formatSeconds } =
    useAction();

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
                  <div key={index} className="select-none">
                    <div
                      className="bg-red-200 aspect-[4/2.25] w-full rounded-xl overflow-hidden flex flex-col"
                      onClick={() => {
                        onJumpDetail(item?.records[0]?.correlationId ?? "");
                      }}
                    >
                      <Img
                        url={"/src/assets/star.jpeg"}
                        title={
                          item.duration ? formatSeconds(item.duration) : ""
                        }
                        type={CssType.None}
                        onClickFunction={() => {}}
                      />
                    </div>
                    <div className="w-full">
                      <div className="text-lg w-full truncate">996</div>
                      <div className="flex flex-row items-center space-x-1">
                        <div className="space-x-1 flex w-9">
                          {showCircle(item.records, [
                            ICameraAiMonitorType.People,
                          ]) && (
                            <div className="w-4 h-4 rounded-full bg-[#2866F1]" />
                          )}
                          {showCircle(item.records, [
                            ICameraAiMonitorType.Vehicles,
                            ICameraAiMonitorType.AbnormalVehicles,
                          ]) && (
                            <div className="w-4 h-4 rounded-full bg-[#04B6B5]" />
                          )}
                        </div>
                        <div className="flex-1 truncate text-base">
                          {dayjs
                            .utc(item.occurenceTime)
                            .local()
                            .format("YYYY-MM-DD HH:mm:ss")}
                        </div>
                      </div>
                    </div>
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
