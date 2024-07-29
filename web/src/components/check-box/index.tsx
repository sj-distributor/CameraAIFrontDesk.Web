import { DownOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";

import KEYS from "@/i18n/keys/alert-list";

import { useAction } from "./hook";
import { ICheckBoxComponentProps } from "./props";
import { ICameraAiMonitorType } from "@/dtos/default";

export const CheckBoxComponent = (props: ICheckBoxComponentProps) => {
  const { title, selectValues, monitorSummary = false, onClick } = props;

  const {
    t,
    wrapperRef,
    isOpen,
    checkTypeList,
    toggleDropdown,
    animalList,
    selectAnimal,
    costumeList,
    selectCostume,
    setSelectCostume,
    setSelectAnimal,
  } = useAction(monitorSummary);

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
            {selectValues.length > 0
              ? t(KEYS.SELECTED, { ns: "alertList" })
              : t(KEYS.PLEASE_SELECT, { ns: "alertList" })}
          </span>
          <DownOutlined className="text-xs" />
        </div>
        {isOpen && (
          <div className="absolute max-h-60 overflow-auto bg-white mt-1 p-2 rounded-lg box-content w-[13.5rem] space-y-1 -left-[50%] z-50">
            {checkTypeList.map((item, index) => (
              <div
                key={index}
                className={`py-2 hover:bg-[#EBF1FF] space-x-2 cursor-pointer text-sm px-4 rounded-lg ${
                  selectValues.findIndex((option) => item.value === option) !==
                  -1
                    ? "bg-[#EBF1FF] text-[#2866F1]"
                    : "bg-white text-black"
                }`}
                onClick={() => {
                  !(
                    item.value === ICameraAiMonitorType.Animal ||
                    item.value === ICameraAiMonitorType.Costume
                  ) && onClick(item.value);
                }}
              >
                <Checkbox
                  checked={
                    selectValues.findIndex(
                      (option) => option === item.value
                    ) !== -1 ||
                    (item.value === ICameraAiMonitorType.Animal &&
                      selectAnimal.length === animalList.length) ||
                    (item.value === ICameraAiMonitorType.Costume &&
                      selectCostume.length === costumeList.length)
                  }
                  indeterminate={
                    (item.value === ICameraAiMonitorType.Animal &&
                      selectAnimal.length > 0 &&
                      selectAnimal.length < animalList.length) ||
                    (item.value === ICameraAiMonitorType.Costume &&
                      selectCostume.length > 0 &&
                      selectCostume.length < costumeList.length)
                  }
                  onChange={(e) => {
                    if (item.value === ICameraAiMonitorType.Animal) {
                      onClick(item.value);

                      setSelectAnimal(
                        e.target.checked
                          ? animalList.map((item) => item.value)
                          : []
                      );
                    }

                    if (item.value === ICameraAiMonitorType.Costume) {
                      onClick(item.value);

                      setSelectCostume(
                        e.target.checked
                          ? costumeList.map((item) => item.value)
                          : []
                      );
                    }
                  }}
                />
                <span className="select-none">{item.label}</span>

                {item.value === ICameraAiMonitorType.Animal && (
                  <Checkbox.Group
                    className="mt-4"
                    options={animalList}
                    value={selectAnimal}
                    onChange={(list) => {
                      setSelectAnimal(list);

                      onClick(ICameraAiMonitorType.Animal, list);
                    }}
                  />
                )}

                {item.value === ICameraAiMonitorType.Costume && (
                  <Checkbox.Group
                    className="mt-4"
                    options={costumeList}
                    value={selectCostume}
                    onChange={(list) => {
                      setSelectCostume(list);

                      onClick(ICameraAiMonitorType.Costume, list);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
