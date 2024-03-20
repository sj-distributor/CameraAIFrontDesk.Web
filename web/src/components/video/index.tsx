import { ScreenType } from "@/entity/screen-type";

import { IVideoProps } from "./props";

export const VideoComponent = (props: IVideoProps) => {
  const { screenNum } = props;

  const data = [1, 2, 3, 4];

  return (
    <div className="bg-red-300 flex flex-col h-full">
      <div
        className={`w-full h-full grid ${
          screenNum !== ScreenType.FourScreen ? "grid-cols-3" : "grid-cols-2"
        }  gap-1`}
      >
        {data.map((_, index) => (
          <div key={index} className="bg-blue-300 flex-1">
            <video
              className={`w-full bg-blue-300 h-full object-fill
              ${screenNum !== ScreenType.SixScreen && "aspect-[2/0.88]"}
              `}
            >
              <source src="/src/assets/meeting_01.mp4 " />
            </video>
          </div>
        ))}
        {/* <video className="w-full object-fill aspect-[2/0.925]">
          <source src="/src/assets/meeting_01.mp4" />
        </video>
        <video className="w-full object-fill aspect-[2/0.925]">
          <source src="/src/assets/meeting_01.mp4 " />
        </video>
        <video className="w-full object-fill aspect-[2/0.925]">
          <source src="/src/assets/meeting_01.mp4" />
        </video>
        <video className="w-full object-fill aspect-[2/0.925]">
          <source src="/src/assets/meeting_01.mp4" />
        </video>
        <video className="w-full object-fill aspect-[2/0.925]">
          <source src="/src/assets/meeting_01.mp4" />
        </video>
        <video className="w-full object-fill aspect-[2/0.925]">
          <source src="/src/assets/meeting_01.mp4" />
        </video>
        <video className="w-full object-fill aspect-[2/0.925]">
          <source src="/src/assets/meeting_01.mp4" />
        </video>
        <video className="w-full object-fill aspect-[2/0.925]">
          <source src="/src/assets/meeting_01.mp4" />
        </video>
        <video className="w-full object-fill aspect-[2/0.925]">
          <source src="/src/assets/meeting_01.mp4" />
        </video> */}
      </div>
      <div className="flex-1 bg-green-300">
        <div>2</div>
        <div>2</div>
      </div>
    </div>
  );
};
