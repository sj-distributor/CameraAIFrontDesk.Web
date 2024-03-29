import "@/antd.css";

import { DownOutlined } from "@ant-design/icons";

import { useAction } from "./hook";
import { ISelectProps } from "./props";

export const SelectComponent = (props: ISelectProps) => {
  const { title, value, onClick } = props;

  const { isOpen, wrapperRef, options, toggleDropdown, selectValueText } =
    useAction();

  return (
    <div className="flex items-center">
      <span className="font-medium text-sm text-[#566172] select-none">
        {title}
      </span>
      <div ref={wrapperRef} className="relative">
        <div
          className="cursor-pointer flex items-center space-x-1 relative"
          onClick={toggleDropdown}
        >
          <span className="select-none w-14 px-1 truncate text-center text-[#2866F1] text-[1rem]">
            {selectValueText(value)}
          </span>
          <DownOutlined className="text-xs" />
        </div>
        {isOpen && (
          <div className="absolute max-h-60 overflow-auto bg-white mt-1 p-2 rounded-lg box-content w-32 space-y-1 -left-[50%] z-50">
            {options.map((option, index) => (
              <div
                key={index}
                className={`py-2 hover:bg-[#EBF1FF] cursor-pointer text-sm px-4 rounded-lg ${
                  option.value === value
                    ? "bg-[#EBF1FF] text-[#2866F1]"
                    : "bg-white text-black"
                }`}
                onClick={() => {
                  onClick(option.value);
                  toggleDropdown();
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
