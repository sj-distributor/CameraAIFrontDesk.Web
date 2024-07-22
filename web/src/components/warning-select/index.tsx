import { ElementIcon, PeopleIcon, VehiclesIcon } from "@/icon/monitor";
import { DownOutlined } from "@ant-design/icons";
import { Checkbox, Switch } from "antd";
import { useState } from "react";

export const WarningSelect = () => {
  const [safeEquipmentList, setSafeEquipmentList] = useState<string[]>([
    "螢光帶",
    "手套",
    "腰帶",
    "安全鞋",
  ]);

  const [selectedSafeEquipment, setSelectedSafeEquipment] = useState<string[]>(
    []
  );

  return (
    <div className="w-[25rem] bg-white rounded-[.5rem] p-[1.3rem]">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-[2rem] h-[2rem] bg-[#2853E3] flex justify-center items-center rounded-[.5rem]">
              <PeopleIcon />
            </div>
            <span className="ml-[.5rem] text-[.88rem] text-[#18283C] font-medium">
              人員
            </span>
          </div>

          <Switch />
        </div>
        <div className="flex flex-col space-y-[.75rem] mt-[.63rem] ml-[2.63rem]">
          <Checkbox>徘徊檢測</Checkbox>
          <Checkbox>吸煙檢測</Checkbox>
          <Checkbox>打架檢測</Checkbox>
          <Checkbox
            indeterminate={
              selectedSafeEquipment.length > 0 &&
              selectedSafeEquipment.length < safeEquipmentList.length
            }
            checked={selectedSafeEquipment.length === safeEquipmentList.length}
            onChange={(e) =>
              setSelectedSafeEquipment(
                e.target.checked ? safeEquipmentList : []
              )
            }
          >
            安全配備檢測
            <DownOutlined
              style={{
                marginLeft: "0.5rem",
                width: "0.56rem",
                height: "0.34rem",
              }}
            />
          </Checkbox>
          <Checkbox.Group
            className="ml-[1.5rem]"
            options={safeEquipmentList}
            value={selectedSafeEquipment}
            onChange={(list) => setSelectedSafeEquipment(list)}
          />
        </div>
      </div>

      <div className="mt-[2.5rem]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-[2rem] h-[2rem] bg-[#34A46E] flex justify-center items-center rounded-[.5rem]">
              <VehiclesIcon />
            </div>
            <span className="ml-[.5rem] text-[.88rem] text-[#18283C] font-medium">
              車輛
            </span>
          </div>

          <Switch />
        </div>
        <Checkbox className="ml-[2.63rem] mt-[.63rem]">識別異常車輛</Checkbox>
      </div>

      <div className="mt-[2.5rem]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-[2rem] h-[2rem] bg-[#F48445] flex justify-center items-center rounded-[.5rem]">
              <ElementIcon />
            </div>
            <span className="ml-[.5rem] text-[.88rem] text-[#18283C] font-medium">
              物體
            </span>
          </div>

          <Switch />
        </div>
        <Checkbox className="ml-[2.63rem] mt-[.63rem]">動物入侵</Checkbox>
      </div>
    </div>
  );
};
