import { useUpdateEffect } from "ahooks";
import * as echarts from "echarts";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import {
  GetCameraList,
  GetEquipmentOnlineList,
  GetRecordTop5CountList,
} from "@/services/api/home";
import {
  ICameraListResponse,
  IEquipmentOnlineCountItem,
  IRecordTop5CountListResponse,
} from "@/services/dtos/home";

type EChartsOption = echarts.EChartsOption;

export const useAction = () => {
  const { t } = useAuth();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const [height, setHeight] = useState<number | null>(null);

  const [selectStatus, setSelectStatus] = useState<boolean>(false);

  const [volumeSliderStatus, setVolumeSliderStatus] = useState<boolean>(false);

  const [loadFlag, setloadFlag] = useState<number>(0);

  // 默认选第一个，需要做一下处理
  const [videoSelectValue, setVideoSelectValue] = useState<string>("");

  // ICameraListResponse
  const [cameraList, setCameraList] = useState<ICameraListResponse[]>([]);

  const [equipmentCountList, setEquipmentCountList] = useState<
    IEquipmentOnlineCountItem[]
  >([]);

  const [recordTop5Obj, setRecordTop5Obj] =
    useState<IRecordTop5CountListResponse>({
      thisMouthRecordCount: 0,
      todayRecordCount: 0,
      topCount: [],
    });

  const [volume, setVolume] = useState<number>(50);

  const videoFullScreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  const getHeight = () => {
    const videoTitle = document.getElementById("video-title")?.clientHeight;

    const header = document.getElementById("header")?.offsetHeight;

    const box = document.getElementById("box")?.clientHeight;

    if (box && videoTitle && header) {
      // window.innerHeight - header - 32(py-4) - 16(space-y-4) - box - 32(py-4) - videoTitle - 4(space-y-1)

      setHeight(
        window.innerHeight - header - 32 - 16 - box - 32 - videoTitle - 4 >= 492
          ? window.innerHeight - header - 32 - 16 - box - 32 - videoTitle - 4
          : 492
      );
    }
  };

  useUpdateEffect(() => {
    if (videoSelectValue) {
      console.log(videoSelectValue);
      // flv連接
    }
  }, [videoSelectValue]);

  useEffect(() => {
    getHeight();
    window.addEventListener("resize", getHeight);

    return window.removeEventListener("reset", getHeight);
  }, []);

  const fetchData = async () => {
    try {
      GetCameraList()
        .then((res) => {
          console.log(1);
          setCameraList(res ?? []);
        })
        .catch(() => {
          console.log(2);

          setCameraList([]);
        })
        .finally(() => {
          setTimeout(() => {
            console.log(3);

            setloadFlag((prev) => ++prev);
          }, 5000);
        });
    } catch (error) {
      console.error("Error fetching data:", (error as Error).message);
    }
  };

  useEffect(() => {
    // 连续请求
    // fetchData();
    // console.log(loadFlag, cameraList, "loadflag");
  }, [loadFlag]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectStatus(false);
      }
    };

    // 添加事件监听器
    window.addEventListener("click", handleClickOutside);

    // 在组件销毁时清除事件监听器
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    GetEquipmentOnlineList()
      .then((res) => {
        if (res) setEquipmentCountList(res ?? []);
      })
      .catch(() => {
        setEquipmentCountList([]);
      });

    GetRecordTop5CountList()
      .then((res) => {
        if (res) {
          setRecordTop5Obj({
            thisMouthRecordCount: res?.thisMouthRecordCount ?? 0,
            todayRecordCount: res?.todayRecordCount ?? 0,
            topCount: res?.topCount ?? [],
          });
        }
      })
      .catch(() => {
        setRecordTop5Obj({
          thisMouthRecordCount: 0,
          todayRecordCount: 0,
          topCount: [],
        });
      });
  }, []);

  useUpdateEffect(() => {
    if (videoRef.current && volume >= 0) {
      videoRef.current.volume = volume * 0.01;
    }
  }, [volume]);

  const option: EChartsOption = useMemo(() => {
    const nameList = recordTop5Obj.topCount.map((item) => item.monitorTypeName);

    const countList = recordTop5Obj.topCount.map(
      (item) => item.monitorRecordCount
    );

    const data = [
      {
        value: 0,
        itemStyle: {
          color: "#ACF1F0",
          opacity: 0.6,
        },
        emphasis: {
          itemStyle: {
            color: "#ACF1F0",
            opacity: 1,
          },
        },
      },
      {
        value: 0,
        itemStyle: {
          color: "#FFD599",
          opacity: 0.6,
        },
        emphasis: {
          itemStyle: {
            color: "#FFD599",
            opacity: 1,
          },
        },
      },
      {
        value: 0,
        itemStyle: {
          color: "#FFB1AC",
          opacity: 0.6,
        },
        emphasis: {
          itemStyle: {
            color: "#FFB1AC",
            opacity: 1,
          },
        },
      },
      {
        value: 0,
        itemStyle: {
          color: "#A8C5DA",
          opacity: 0.6,
        },
        emphasis: {
          itemStyle: {
            color: "#A8C5DA",
            opacity: 1,
          },
        },
      },
      {
        value: 0,
        itemStyle: {
          color: "#95A4FC",
          opacity: 0.6,
        },
        emphasis: {
          itemStyle: {
            color: "#95A4FC",
            opacity: 1,
          },
        },
      },
    ];

    const seriesData: any[] = [];

    countList.map((outItem, outIndex) => {
      data.map((inItem, inIndex) => {
        if (outIndex === inIndex) {
          seriesData.push({
            ...inItem,
            value: outItem,
          });
        }
      });
    });

    return {
      yAxis: {
        type: "value",
      },
      xAxis: {
        type: "category",
        data: nameList,
      },
      tooltip: {
        show: true,
        trigger: "item",
        position: function (point, params: any) {
          return [
            params.name === nameList[nameList.length - 1]
              ? point[0] - 130
              : point[0] + 10,
            point[1] > 140 ? point[1] - 40 : point[1] + 20,
          ];
        },
        confine: true,
      },
      series: [
        {
          data: seriesData,
          type: "bar",
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
          },
          label: {
            show: true,
            position: "top",
            color: "#2866F1",
          },
        },
      ],
    };

    // return {
    //   xAxis: {
    //     type: "category",
    //     data: ["XXX", "XXX", "XXX", "XXX", "XXXXX"],
    //   },
    //   yAxis: {
    //     type: "value",
    //   },
    //   tooltip: {
    //     show: true,
    //     trigger: "item",
    //     position: function (point, params: any) {
    //       return [
    //         params.name === "XXXXX" ? point[0] - 130 : point[0] + 10,
    //         point[1] > 140 ? point[1] - 40 : point[1] + 20,
    //       ];
    //     },
    //     confine: true,
    //   },
    //   series: [
    //     {
    //       data: [
    //         {
    //           value: 600,
    //           itemStyle: {
    //             color: "#ACF1F0",
    //             opacity: 0.6,
    //           },
    //           emphasis: {
    //             itemStyle: {
    //               color: "#ACF1F0",
    //               opacity: 1,
    //             },
    //           },
    //         },
    //         {
    //           value: 120,
    //           itemStyle: {
    //             color: "#FFD599",
    //             opacity: 0.6,
    //           },
    //           emphasis: {
    //             itemStyle: {
    //               color: "#FFD599",
    //               opacity: 1,
    //             },
    //           },
    //         },
    //         {
    //           value: 150,
    //           itemStyle: {
    //             color: "#FFB1AC",
    //             opacity: 0.6,
    //           },
    //           emphasis: {
    //             itemStyle: {
    //               color: "#FFB1AC",
    //               opacity: 1,
    //             },
    //           },
    //         },
    //         {
    //           value: 60,
    //           itemStyle: {
    //             color: "#A8C5DA",
    //             opacity: 0.6,
    //           },
    //           emphasis: {
    //             itemStyle: {
    //               color: "#A8C5DA",
    //               opacity: 1,
    //             },
    //           },
    //         },
    //         {
    //           value: 30,
    //           itemStyle: {
    //             color: "#95A4FC",
    //             opacity: 0.6,
    //           },
    //           emphasis: {
    //             itemStyle: {
    //               color: "#95A4FC",
    //               opacity: 1,
    //             },
    //           },
    //         },
    //       ],
    //       type: "bar",
    //       itemStyle: {
    //         borderRadius: [5, 5, 0, 0],
    //       },
    //       label: {
    //         show: true,
    //         position: "top",
    //         color: "#2866F1",
    //       },
    //     },
    //   ],
    // };
  }, [recordTop5Obj.topCount]);

  return {
    t,
    dropdownRef,
    videoRef,
    height,
    selectStatus,
    volume,
    cameraList,
    recordTop5Obj,
    volumeSliderStatus,
    equipmentCountList,
    option,
    setVolumeSliderStatus,
    setVolume,
    setSelectStatus,
    videoFullScreen,
  };
};
