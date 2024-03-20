import { useUpdateEffect } from "ahooks";
import mpegtsJs from "mpegts.js";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { GetCameraList } from "@/services/api/home";
import { ICameraListResponse } from "@/services/dtos/home";

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

  useUpdateEffect(() => {
    if (videoRef.current && volume >= 0) {
      videoRef.current.volume = volume * 0.01;
    }
  }, [volume]);

  return {
    t,
    dropdownRef,
    videoRef,
    height,
    selectStatus,
    volume,
    cameraList,
    volumeSliderStatus,
    setVolumeSliderStatus,
    setVolume,
    setSelectStatus,
    videoFullScreen,
  };
};
