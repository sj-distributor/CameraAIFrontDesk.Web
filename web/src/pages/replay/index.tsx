import { SearchOutlined } from "@ant-design/icons";
import { DatePicker, Input, TimeRangePickerProps } from "antd";
import dayjs from "dayjs";
import { useOutlet } from "react-router-dom";

import { BreadcrumbComponent } from "@/components/breadcrumb";
// import { FliterWarningComponent } from "@/components/fliterWarning";
import { SelectComponent } from "@/components/select";
import { StatusType } from "@/entity/enum";

import { useAction } from "./hook";

export const Replay = () => {
  const outlet = useOutlet();

  const { headerRef, data, updateData, status, updateStatus, location } =
    useAction();

  const rangePresets: TimeRangePickerProps["presets"] = [
    // { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    // { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
    // { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
    { label: "最近一週", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "最近一個月", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "最近三個月", value: [dayjs().add(-90, "d"), dayjs()] },
  ];

  return (
    <div className="w-full h-full box-border px-5 pt-5 pb-5 flex flex-col space-y-4">
      <div className="flex flex-wrap items-center justify-between">
        <div ref={headerRef}>
          <BreadcrumbComponent />
          {location.pathname === "/replay/list" && (
            <div className="flex items-center flex-wrap space-x-4">
              <div>
                <span className="font-medium text-sm text-[#566172] select-none">
                  選擇日期時間：
                </span>

                <DatePicker.RangePicker
                  bordered={false}
                  presets={rangePresets}
                  showTime={{
                    hideDisabledOptions: false,
                  }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={["開始日期時間", "結束日期時間"]}
                />
              </div>
              {/* 需要替换 */}
              {/* <FliterWarningComponent data={data} updateData={updateData} /> */}
              {/* <SelectComponent
                title="狀態："
                value={status}
                onChange={updateStatus}
                options={[
                  {
                    label: "全部",
                    value: StatusType.All,
                  },
                  {
                    label: "待標記",
                    value: StatusType.ToBeMarked,
                  },
                  {
                    label: "通過",
                    value: StatusType.Pass,
                  },
                  {
                    label: "異常",
                    value: StatusType.Abnormal,
                  },
                ]}
              /> */}
            </div>
          )}
        </div>
        {location.pathname === "/replay/list" && (
          <div className="flex flex-wrap">
            <Input
              placeholder="搜索設備名稱"
              className="rounded-[48px] text-base w-[200px] h-12"
              suffix={
                <SearchOutlined className="" onClick={() => console.log(111)} />
              }
            />
          </div>
        )}
      </div>

      <div
        className=""
        // ref={divRef}
        // className="flex-grow overflow-auto no-scrollbar scroll-smooth"
      >
        {outlet}
      </div>
    </div>
  );
};
