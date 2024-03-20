import { DownOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";

import { useAction } from "./hook";
import { ICheckBoxComponentProps } from "./props";

export const CheckBoxComponent = (props: ICheckBoxComponentProps) => {
  const { title, selectValues, onClick } = props;

  const { wrapperRef, isOpen, typeList, toggleDropdown } = useAction();

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
          <span className="select-none w-14 px-1 truncate text-center text-[#2866F1]">
            {selectValues.length > 0 ? "已選擇" : "請選擇"}
          </span>
          <DownOutlined className="text-xs" />
        </div>
        {isOpen && (
          <div className="absolute max-h-60 overflow-auto bg-white mt-1 p-2 rounded-lg box-content w-32 space-y-1 -left-[50%] z-50">
            {typeList.map((item, index) => (
              <div
                key={index}
                className={`py-2 hover:bg-[#EBF1FF] space-x-2 cursor-pointer text-sm px-4 rounded-lg ${
                  selectValues.findIndex(
                    (option) => item.id === Number(option)
                  ) !== -1
                    ? "bg-[#EBF1FF] text-[#2866F1]"
                    : "bg-white text-black"
                }`}
                onClick={() => onClick(item.id)}
              >
                <Checkbox
                  checked={
                    selectValues.findIndex(
                      (option) => Number(option) === item.id
                    ) !== -1
                  }
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
