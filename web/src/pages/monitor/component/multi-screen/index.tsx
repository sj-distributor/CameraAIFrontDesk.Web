// import { FliterWarningComponent } from "@/components/fliterWarning";
// import { SelectComponent } from "@/components/select";
// import { ScreenType } from "@/entity/screen-type";

import { useAction } from "./hook";

export const MultiScreen = () => {
  const {
    videoBodyRef,
    // layoutMode,
    // updateLayoutMode,
    // videoItemHeight,
    // videoLinkArr,
    // warning,
    // updateWarning,
    // videoRefs,
    onClick,
  } = useAction();

  return (
    <div className="w-full h-full bg-green-300 flex flex-col space-y-1">
      <div className="flex space-x-1">
        {/* 需要替换 */}
        {/* <FliterWarningComponent data={warning} updateData={updateWarning} /> */}
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
      <div className="flex-1 flex flex-col bg-red-600 overflow-y-auto no-scrollbar">
        <div
          //   ${
          //   layoutMode === ScreenType.FourScreen ? "grid-cols-2" : "grid-cols-3"
          // }
          className={`h-[calc(100%-44px)] overflow-y-auto no-scrollbar grid 
        
           gap-1`}
          ref={videoBodyRef}
        >
          {/* {videoLinkArr.map((item, index) => (
            <div
              className={`${item ? item : "bg-black"}`}
              style={{ height: videoItemHeight + "px" }}
              key={index}
            >
              {item && (
                <video
                  className="w-full h-full object-fill"
                  ref={videoRefs[index]}
                >
                  <source src="/src/assets/meeting_01.mp4 " />
                </video>
              )}
            </div>
          ))} */}
        </div>
        <div className="h-11 666">
          <div onClick={onClick}>click</div>
        </div>
      </div>
    </div>
  );
};
{
  /* grid grid-cols-3 overflow-y-auto no-scrollbar*/
}
{
  /* <div className="h-[calc(100%-24px)] overflow-y-auto no-scrollbar">
          {[
            { bg: "bg-red-300" },
            { bg: "bg-green-300" },
            { bg: "bg-blue-300" },
            { bg: "bg-pink-300" },
            { bg: "bg-slate-300" },
            { bg: "bg-stone-300" },
            { bg: "bg-teal-300" },
            { bg: "bg-cyan-300" },
            { bg: "bg-sky-300" },
            { bg: "bg-violet-300" },
            { bg: "bg-fuchsia-300" },
          ].map((item, index) => (
            <div className={`${item.bg} shrink-0 h-96`} key={index}>
              {index}
            </div>
          ))}
        </div> */
}
