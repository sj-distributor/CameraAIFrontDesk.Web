import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { GetRegionList } from "@/services/api/monitoring";
import { IPageDto } from "@/services/dtos/default";
import { IRegionItem, IRegionListResponse } from "@/services/dtos/monitoring";

interface IDto extends IRegionListResponse, IPageDto {
  loading: boolean;
  isFirstGet: boolean;
  isScorllDown: boolean;
  isEnd: boolean;
}

export const useAction = () => {
  const { navigate } = useAuth();

  const [regionDto, setRegionDto] = useState<IDto>({
    PageIndex: 1,
    PageSize: 10,
    count: 0,
    regions: [],
    loading: false,
    isFirstGet: false,
    isScorllDown: false,
    isEnd: false,
  });

  const clickAreaItem = (regionId: number, regionName: string) => {
    navigate(`/monitoring/${regionId}?regionName=${regionName}`);
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
      updateRegionDto("regions", regions);

      !regionDto.isFirstGet
        ? updateRegionDto("loading", loading)
        : updateRegionDto("isScorllDown", loading);

      updateRegionDto("isFirstGet", isFirstGet);
    }, 300);
  };

  useEffect(() => {
    !regionDto.isFirstGet
      ? updateRegionDto("loading", true)
      : updateRegionDto("isScorllDown", true);

    GetRegionList({
      PageIndex: regionDto.PageIndex,
      PageSize: regionDto.PageSize,
    })
      .then((res) => {
        setData(
          res?.count ?? 0,
          false,
          [...regionDto.regions, ...(res?.regions ?? [])],
          true
        );
      })
      .catch(() => {
        setData(0, false, [], true);
      });
  }, [regionDto.PageIndex, regionDto.PageSize]);

  return { regionDto, clickAreaItem, onScroll };
};
