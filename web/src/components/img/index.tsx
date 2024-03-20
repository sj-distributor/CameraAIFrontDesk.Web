import { CssType, IImgProps } from "./props";

export const Img = (props: IImgProps) => {
  const { url, title, type, onClickFunction } = props;

  return (
    <div
      className="w-full h-full relative hover:cursor-pointer"
      onClick={onClickFunction}
    >
      <div
        className={`absolute py-1 px-3 border border-solid rounded-lg top-7 left-6 select-none ${
          type === CssType.Area
            ? "border-[#FAC15B] bg-[#FFF5E2] text-[#F49B45]"
            : "border-[#96F6F6] bg-[#E7FFFF] text-[#04B6B5]"
        } max-w-64 truncate`}
      >
        {title}
      </div>
      <img
        src={url}
        alt=""
        className="w-full h-full object-cover img-no-darg"
      />
    </div>
  );
};
