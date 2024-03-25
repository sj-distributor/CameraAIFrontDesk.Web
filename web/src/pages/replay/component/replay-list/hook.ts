import { useContext, useEffect, useState } from "react";

import { GetReplayList } from "@/services/api/replay";
import { IPageDto, IRecordRequest } from "@/services/dtos/default";
import { IReplayItem, IReplayResponse } from "@/services/dtos/replay";

import { ReplaySearchDataContext } from "../..";

interface IDto extends IPageDto, IReplayResponse {
  loading: boolean;
  isFirstGet: boolean;
  isScorllDown: boolean;
  isEnd: boolean;
}

export const useAction = () => {
  const { searchKeyWord, timeDto, selectValues } = useContext(
    ReplaySearchDataContext
  );

  const [replayDto, setReplayDto] = useState<IDto>({
    PageIndex: 1,
    PageSize: 20,
    count: 0,
    replays: [],
    loading: false,
    isFirstGet: false,
    isScorllDown: false,
    isEnd: false,
  });

  const onJumpDetail = (correlationId: string) => {
    // TODO: 跳转详情
  };

  const updateReplayDto = (key: keyof IDto, value: any) => {
    setReplayDto((prev) => ({ ...prev, [key]: value }));
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    if (target.scrollTop + target.clientHeight === target.scrollHeight) {
      if (replayDto.PageIndex * replayDto.PageSize < replayDto.count) {
        !replayDto.isScorllDown &&
          updateReplayDto("PageIndex", replayDto.PageIndex + 1);
      } else {
        !replayDto.isScorllDown && updateReplayDto("isEnd", true);
      }
    }
  };

  const getRequestPrams = () => {
    const data: IRecordRequest = {
      PageIndex: replayDto.PageIndex,
      PageSize: replayDto.PageSize,
    };

    if (timeDto.startTime && timeDto.endTime) {
      data.StartTime = timeDto.startTime as string;
      data.EndTime = timeDto.endTime as string;
    }

    if (selectValues.length > 0) {
      data.MonitorTypeIds = selectValues;
    }

    if (searchKeyWord) {
      data.EquipmentName = searchKeyWord;
    }

    return data;
  };

  const setData = (
    count: number,
    loading: boolean,
    replays: IReplayItem[],
    isFirstGet: boolean
  ) => {
    setTimeout(() => {
      updateReplayDto("count", count);
      updateReplayDto("replays", replays);

      !replayDto.isFirstGet
        ? updateReplayDto("loading", loading)
        : updateReplayDto("isScorllDown", loading);

      updateReplayDto("isFirstGet", isFirstGet);
    }, 300);
  };

  useEffect(() => {
    !replayDto.isFirstGet
      ? updateReplayDto("loading", true)
      : updateReplayDto("isScorllDown", true);

    const data = getRequestPrams();

    GetReplayList(data)
      .then((res) => {
        setData(
          res?.count ?? 0,
          false,
          [...replayDto.replays, ...(res?.replays ?? [])],
          true
        );
      })
      .catch(() => {
        setData(0, false, [], true);
      });
  }, [
    timeDto,
    replayDto.PageIndex,
    replayDto.PageSize,
    searchKeyWord,
    selectValues,
  ]);

  return { replayDto, onScroll, onJumpDetail };
};
