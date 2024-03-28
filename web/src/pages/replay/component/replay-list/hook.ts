import { clone } from "ramda";
import { useContext, useEffect, useState } from "react";

import { IPageDto, IRecordRequest } from "@/dtos/default";
import { IReplayItem, IReplayRecordItem, IReplayResponse } from "@/dtos/replay";
import { useAuth } from "@/hooks/use-auth";
import { GetReplayList } from "@/services/replay";

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

  const { navigate } = useAuth();

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

  const [lastTimeSearchData, setLastTimeSearchData] =
    useState<IRecordRequest | null>(null);

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
      data.MonitorTypes = selectValues;
    }

    if (searchKeyWord) {
      data.EquipmentName = searchKeyWord;
    }

    if (lastTimeSearchData) {
      const isClearPage = areRecordRequestsDifferent(data, lastTimeSearchData);

      if (isClearPage) {
        data.PageIndex = 1;
      }
    }

    return data;
  };

  const areRecordRequestsDifferent = (
    request1: IRecordRequest,
    request2: IRecordRequest
  ) => {
    // 检查每个属性是否相同

    return (
      request1.EquipmentName !== request2.EquipmentName ||
      !arraysAreEqual(request1.EquipmentCodes, request2.EquipmentCodes) ||
      !arraysAreEqual(request1.MonitorTypes, request2.MonitorTypes) ||
      request1.EndTime !== request2.EndTime ||
      request1.StartTime !== request2.StartTime ||
      request1.Status !== request2.Status
    );
  };

  // 辅助函数，用于比较两个数组是否相等
  const arraysAreEqual = (
    array1?: (number | string)[],
    array2?: (number | string)[]
  ) => {
    if (!array1 || !array2 || array1.length !== array2.length) {
      return false; // 長度不同或其中一個數組為 null 或 undefined，直接返回 false
    }

    // 檢查每個元素是否相同
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false; // 元素不同，返回 false
      }
    }

    return true; // 所有元素相同，返回 true
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

    setLastTimeSearchData(clone(data));

    GetReplayList(data)
      .then((res) => {
        setData(
          res?.count ?? 0,
          false,
          data.PageIndex === 1
            ? res?.replays ?? []
            : [...replayDto.replays, ...(res?.replays ?? [])],
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

  useEffect(() => {
    console.log(replayDto.replays);
  }, [replayDto.replays]);

  return { replayDto, onScroll, onJumpDetail, showCircle, formatSeconds };
};
