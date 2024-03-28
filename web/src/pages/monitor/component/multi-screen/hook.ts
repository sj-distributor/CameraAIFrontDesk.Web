import { useEffect, useRef, useState } from "react";

// import { ScreenType } from "@/entity/screen-type";

export const useAction = () => {
  const videoBodyRef = useRef<HTMLDivElement>(null);

  const [videoBodyWidth, setVideoBodyWidth] = useState<number | null>(null);

  // const [layoutMode, setLayoutMode] = useState<any>(null);

  // const [videoItemHeight, setVideoItemHeight] = useState<number | null>(null);

  // const data = [
  //   "bg-yellow-300",
  //   "bg-orange-300",
  //   "bg-pink-300",
  //   "bg-red-300",
  //   "bg-amber-300",
  //   "bg-purple-300",
  //   "bg-indigo-300",
  //   "bg-sky-300",
  // ];

  const [warning, setWarning] = useState<string[]>([]);

  const updateWarning = (value: string[]) => {
    setWarning(value);
  };

  // const updateLayoutMode = (value: any) => {
  // setLayoutMode(value as ScreenType);
  // };

  const getVideoBodyheight = () => {
    if (videoBodyRef.current) {
      setVideoBodyWidth(videoBodyRef.current.clientHeight ?? 0);
    }
  };

  // const videoLinkArr = useMemo(() => {
  // switch (layoutMode) {
  //   case ScreenType.FourScreen:
  //     while (data.length < 4) {
  //       data.push("");
  //     }
  //     return data.slice(0, 4);
  //   case ScreenType.SixScreen:
  //     while (data.length < 6) {
  //       data.push("");
  //     }
  //     return data.slice(0, 6);
  //   case ScreenType.NineScreen:
  //     while (data.length < 9) {
  //       data.push("");
  //     }
  //     return data;
  //   default:
  //     return [];
  // }
  // }, [data, layoutMode]);

  // const videoRefs = useMemo(() => {
  //   return Array.from({ length: videoLinkArr.length }, () =>
  //     React.createRef<HTMLVideoElement>()
  //   );
  // }, [videoLinkArr]);

  useEffect(() => {
    getVideoBodyheight();

    window.addEventListener("resize", getVideoBodyheight);

    return window.removeEventListener("resize", getVideoBodyheight);
  }, []);

  // useEffect(() => {
  //   if (videoBodyWidth !== null && layoutMode !== null) {
  // switch (layoutMode) {
  //   case ScreenType.FourScreen:
  //   case ScreenType.SixScreen:
  //     setVideoItemHeight((videoBodyWidth - 4) / 2);
  //     break;
  //   case ScreenType.NineScreen:
  //     setVideoItemHeight((videoBodyWidth - 8) / 3);
  //     break;
  // }
  //   }
  // }, [videoBodyWidth, layoutMode]);

  const onClick = () => {
    // videoRefs.forEach((item) => {
    //   item.current?.paused ? item.current?.play() : item.current?.pause();
    // });
  };

  return {
    videoBodyRef,
    // layoutMode,
    warning,
    updateWarning,
    // updateLayoutMode,
    videoBodyWidth,
    // videoItemHeight,
    // videoLinkArr,
    // videoRefs,
    onClick,
  };
};
