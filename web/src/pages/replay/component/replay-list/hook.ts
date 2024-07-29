import { clone } from "ramda";
import { useContext, useEffect, useState } from "react";

import { IPageDto, IRecordRequest } from "@/dtos/default";
import { IReplayRecordItem, IReplayResponse } from "@/dtos/replay";
import { useAuth } from "@/hooks/use-auth";
import { GetReplayList } from "@/services/replay";

import { ReplaySearchDataContext } from "../..";

interface IDto extends IPageDto, IReplayResponse {
  scrollLoading: boolean;
  switchLoading: boolean;
  isEnd: boolean;
}

export const useAction = () => {
  const { searchKeyWord, timeDto, selectValues } = useContext(
    ReplaySearchDataContext
  );

  const { navigate } = useAuth();

  const [replayDto, setReplayDto] = useState<IDto>({
    PageIndex: 1,
    PageSize: 10,
    count: 0,
    replays: [],
    scrollLoading: false,
    switchLoading: false,
    isEnd: false,
  });

  const onJumpDetail = (correlationId: string) => {
    // TODO: 跳转详情
    navigate("/replay/" + correlationId, {
      state: {
        correlationId,
      },
    });
  };

  const formatSeconds = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    const paddedMinutes = String(minutes).padStart(2, "0");

    const paddedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${paddedMinutes}:${paddedSeconds}`;
  };

  const showCircle = (records: IReplayRecordItem[], type: number[]) => {
    return records.some((item) => type.includes(item.monitorType));
  };

  const updateReplayDto = (key: keyof IDto, value: any) => {
    setReplayDto((prev) => ({ ...prev, [key]: value }));
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
      data.MonitorTypes = selectValues;
    }

    if (searchKeyWord) {
      data.EquipmentName = searchKeyWord;
    }

    return data;
  };

  const [lastSearchData, setLastSearchData] = useState<IRecordRequest | null>(
    null
  );

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    if (target.scrollTop + target.clientHeight === target.scrollHeight) {
      if (replayDto.PageIndex * replayDto.PageSize < replayDto.count) {
        updateReplayDto("PageIndex", replayDto.PageIndex + 1);
      } else {
        updateReplayDto("isEnd", true);
      }
    }
  };

  useEffect(() => {
    const data = getRequestPrams();

    let loadingState = 0;

    if (lastSearchData === null) {
      updateReplayDto("switchLoading", true);

      loadingState = 1;
    } else {
      if (
        lastSearchData?.EquipmentName !== data?.EquipmentName ||
        lastSearchData?.MonitorTypes !== data?.MonitorTypes ||
        lastSearchData?.StartTime !== data?.StartTime ||
        lastSearchData?.EndTime !== data?.EndTime
      ) {
        updateReplayDto("switchLoading", true);
        data.PageIndex = 1;

        loadingState = 1;
      } else if (
        lastSearchData.PageIndex !== data.PageIndex ||
        lastSearchData.PageSize !== data.PageSize
      ) {
        updateReplayDto("scrollLoading", true);

        loadingState = 2;
      }
    }

    GetReplayList(data)
      .then((res) => {
        const newData = clone(data);

        setLastSearchData(newData);

        updateReplayDto("count", res?.count ?? 0);
        updateReplayDto(
          "replays",
          data.PageIndex === 1
            ? res?.replays ?? []
            : [...replayDto.replays, ...(res?.replays ?? [])]
        );
      })
      .catch(() => {
        updateReplayDto("count", 0);
        updateReplayDto("replays", []);
      })
      .finally(() => {
        switch (loadingState) {
          case 1:
            updateReplayDto("switchLoading", false);
            break;
          case 2:
            updateReplayDto("scrollLoading", false);
            break;
        }
      });
  }, [
    timeDto,
    replayDto.PageIndex,
    replayDto.PageSize,
    searchKeyWord,
    selectValues,
  ]);

  return {
    replayDto,
    onScroll,
    onJumpDetail,
    showCircle,
    formatSeconds,
  };
};
