import { useEffect, useState } from "react";

import { IPageDto } from "@/dtos/default";
import { IRegionItem, IRegionListResponse } from "@/dtos/monitor";
import { useAuth } from "@/hooks/use-auth";
import { GetRegionList } from "@/services/monitor";
import { message } from "antd";

interface IDto extends IRegionListResponse, IPageDto {
  loading: boolean;
  isFirstGet: boolean;
  isScorllDown: boolean;
  isEnd: boolean;
}

export const useAction = () => {
  const { navigate, currentTeam } = useAuth();

  const [regionDto, setRegionDto] = useState<IDto>({
    PageIndex: 1,
    PageSize: 10,
    count: 0,
    regionCameras: [],
    loading: false,
    isFirstGet: false,
    isScorllDown: false,
    isEnd: false,
  });

  const clickAreaItem = (regionId: number, regionName: string) => {
    navigate(`/monitor/${regionId}?regionName=${regionName}`);
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    if (target.scrollTop + target.clientHeight === target.scrollHeight) {
      if (regionDto.PageIndex * regionDto.PageSize < regionDto.count) {
        !regionDto.isScorllDown &&
          updateRegionDto("PageIndex", regionDto.PageIndex + 1);
      } else {
        !regionDto.isScorllDown && updateRegionDto("isEnd", true);
      }
    }
  };

  const updateRegionDto = (k: keyof IDto, v: any) => {
    setRegionDto((prev) => ({
      ...prev,
      [k]: v,
    }));
  };

  const setData = (
    count: number,
    loading: boolean,
    regions: IRegionItem[],
    isFirstGet: boolean
  ) => {
    setTimeout(() => {
      updateRegionDto("count", count);
      updateRegionDto("regionCameras", regions);

      !regionDto.isFirstGet
        ? updateRegionDto("loading", loading)
        : updateRegionDto("isScorllDown", loading);

      updateRegionDto("isFirstGet", isFirstGet);
    }, 300);
  };

  useEffect(() => {
    if (!currentTeam.id) {
      message.error("TeamId not found！");
      return;
    }

    !regionDto.isFirstGet
      ? updateRegionDto("loading", true)
      : updateRegionDto("isScorllDown", true);

    GetRegionList({
      PageIndex: regionDto.PageIndex,
      PageSize: regionDto.PageSize,
      TeamId: currentTeam.id,
    })
      .then((res) => {
        setData(
          res?.count ?? 0,
          false,
          [...regionDto.regionCameras, ...(res?.regionCameras ?? [])],
          true
        );
      })
      .catch(() => {
        setData(0, false, [], true);
      });
  }, [regionDto.PageIndex, regionDto.PageSize]);

  return { regionDto, clickAreaItem, onScroll };
};
