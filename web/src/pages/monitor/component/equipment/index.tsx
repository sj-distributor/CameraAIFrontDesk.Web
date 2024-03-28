import { useEffect } from "react";

// import { FliterWarningComponent } from "@/components/fliterWarning";
// import { SelectComponent } from "@/components/select";
// import { VideoComponent } from "@/components/video";
// import { ScreenType } from "@/entity/screen-type";

// import { useAction } from "./hook";

export const Equipment = () => {
  // const { layoutMode, data, updateLayoutMode, updateData } = useAction();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function (stream) {
        console.log(stream);
        // 将视频流附加到video元素上
        // const videoElement = document.getElementById("videoElement");

        // videoElement.srcObject = stream;
      })
      .catch(function (error) {
        console.log("获取用户媒体设备失败:", error);
      });
  }, []);

  return (
    <div className="w-full h-full flex flex-col space-y-2 box-border bg-yellow-300">
      <div className="flex flex-wrap space-x-4 max-[500px]:space-x-0">
        {/* 需要替换 */}
        {/* <FliterWarningComponent data={data} updateData={updateData} /> */}
        {/* <SelectComponent
          title="分屏模式："
          value={layoutMode}
          onChange={updateLayoutMode}
          options={[
            {
              label: "四屏模式",
              value: ScreenType.FourScreen,
            },
            {
              label: "六屏模式",
              value: ScreenType.SixScreen,
            },
            {
              label: "九屏模式",
              value: ScreenType.NineScreen,
            },
          ]}
        /> */}
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {[
          { bg: "bg-red-300" },
          { bg: "bg-green-300" },
          { bg: "bg-blue-300" },
          { bg: "bg-pink-300" },
        ].map((item, index) => (
          <div className={` space-y-4 ${item.bg} h-96 shrink-0`} key={index}>
            {index}
          </div>
        ))}
      </div>

      {/* <VideoComponent screenNum={layoutMode} /> */}
    </div>
  );
};
