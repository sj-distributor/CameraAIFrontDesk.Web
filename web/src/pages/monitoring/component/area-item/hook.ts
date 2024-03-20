import { useEffect, useState } from "react";

import { ScreenType } from "@/entity/screen-type";
import { useAuth } from "@/hooks/use-auth";
import { GetRegionEquipmentList } from "@/services/api/monitoring";
import { IPageDto } from "@/services/dtos/default";
import {
  IRegionEquipmentItem,
  IRegionEquipmentListResponse,
} from "@/services/dtos/monitoring";

interface IDto extends IRegionEquipmentListResponse, IPageDto {
  loading: boolean;
  regionId: number | null;
  regionName: string | null;
  isFirstGet: boolean;
  isScorllDown: boolean;
  isEnd: boolean;
}

export const useAction = () => {
  const { location, navigate, parseQueryParams, parseQuery } = useAuth();

  const [layoutMode, setLayoutMode] = useState<ScreenType | null>(null);

  const [regionEquipmentDto, setRegionEquipmentDto] = useState<IDto>({
    PageIndex: 1,
    PageSize: 50,
    loading: false,
    count: 0,
    equipments: [],
    regionId: null,
    regionName: null,
    isFirstGet: false,
    isScorllDown: false,
    isEnd: false,
  });

  const updateLayoutMode = (value: any) => {
    setLayoutMode(value as ScreenType);

    const data = parseQueryParams<{ regionName: string }>();

    const arr = location.pathname.split("/").filter((item) => item !== "");

    navigate(
      `/monitoring/${arr[arr.length - 1]}/multi-screen?regionName=${
        data.regionName
      }&screen=${value}`
    );
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    if (target.scrollTop + target.clientHeight === target.scrollHeight) {
      if (
        regionEquipmentDto.PageIndex * regionEquipmentDto.PageSize <
        regionEquipmentDto.count
      ) {
        !regionEquipmentDto.isScorllDown &&
          updateRegionEquipmentDto(
            "PageIndex",
            regionEquipmentDto.PageIndex + 1
          );
      } else {
        !regionEquipmentDto.isScorllDown &&
          updateRegionEquipmentDto("isEnd", true);
      }
    }
  };

  const updateRegionEquipmentDto = (k: keyof IDto, v: any) => {
    setRegionEquipmentDto((prev) => ({
      ...prev,
      [k]: v,
    }));
  };

  const setData = (
    count: number,
    loading: boolean,
    equipments: IRegionEquipmentItem[],
    isFirstGet: boolean
  ) => {
    setTimeout(() => {
      updateRegionEquipmentDto("count", count);
      updateRegionEquipmentDto("equipments", equipments);

      !regionEquipmentDto.isFirstGet
        ? updateRegionEquipmentDto("loading", loading)
        : updateRegionEquipmentDto("isScorllDown", loading);

      updateRegionEquipmentDto("isFirstGet", isFirstGet);
    }, 300);
  };

  const onClickEquipmentItem = (equipmentCode: string) => {
    navigate(
      `/monitoring/${regionEquipmentDto.regionId}/${equipmentCode}?regionName=${regionEquipmentDto.regionName}`
    );
  };

  useEffect(() => {
    const data = parseQuery();

    const params = parseQueryParams<{ regionName: string }>();

    data.length >= 2 &&
      data[1] &&
      updateRegionEquipmentDto("regionId", Number(data[1]));
    params.regionName &&
      updateRegionEquipmentDto("regionName", params.regionName);
  }, []);

  useEffect(() => {
    if (regionEquipmentDto.regionId) {
      !regionEquipmentDto.isFirstGet
        ? updateRegionEquipmentDto("loading", true)
        : updateRegionEquipmentDto("isScorllDown", true);

      GetRegionEquipmentList({
        PageIndex: regionEquipmentDto.PageIndex,
        PageSize: regionEquipmentDto.PageSize,
        RegionId: regionEquipmentDto.regionId,
        // EquipmentType: "'摄像头",
      })
        .then((res) => {
          console.log(res);
          setData(
            res?.count ?? 0,
            false,
            [...regionEquipmentDto.equipments, ...(res?.equipments ?? [])],
            true
          );
        })
        .catch(() => {
          setData(0, false, [], true);
        });
    }
  }, [
    regionEquipmentDto.PageIndex,
    regionEquipmentDto.PageSize,
    regionEquipmentDto.regionId,
  ]);

  return {
    layoutMode,
    regionEquipmentDto,
    updateLayoutMode,
    onScroll,
    onClickEquipmentItem,
  };
};
