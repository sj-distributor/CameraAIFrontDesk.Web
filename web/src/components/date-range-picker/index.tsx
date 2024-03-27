import "./index.css";

import { DatePicker, TimeRangePickerProps } from "antd";
import dayjs from "dayjs";

import { IRangePickerProps } from "./props";

const rangePresets: TimeRangePickerProps["presets"] = [
  // { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
  // { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
  // { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
  { label: "最近一週", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "最近一個月", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "最近三個月", value: [dayjs().add(-90, "d"), dayjs()] },
];

export const RangePickerComponent = (props: IRangePickerProps) => {
  const { timeDto, setTimeDto } = props;

  return (
    <DatePicker.RangePicker
      presets={rangePresets}
      bordered={false}
      showTime={{
        hideDisabledOptions: false,
      }}
      value={[
        timeDto.startTime ? dayjs(timeDto.startTime) : null,
        timeDto.endTime ? dayjs(timeDto.endTime) : null,
      ]}
      format="YYYY-MM-DD HH:mm:ss"
      placeholder={["開始日期時間", "結束日期時間"]}
      onChange={(e) => {
        if (e && e[0] && e[1]) {
          setTimeDto({
            startTime: e[0].toISOString(),
            endTime: e[1].toISOString(),
          });
        } else {
          setTimeDto({
            startTime: null,
            endTime: null,
          });
        }
      }}
    />
  );
};
