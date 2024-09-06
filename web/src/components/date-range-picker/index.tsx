import "./index.css";

import { DatePicker, TimeRangePickerProps } from "antd";
import dayjs from "dayjs";

import { useAuth } from "@/hooks/use-auth";
import KEYS from "@/i18n/keys/alert-list";

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

  const { t } = useAuth();

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
      className="rangePickerComponent"
      format="YYYY-MM-DD HH:mm:ss"
      placeholder={[
        t(KEYS.START_DATE_TIME, { ns: "alertList" }),
        t(KEYS.END_DATE_TIME, { ns: "alertList" }),
      ]}
      onChange={(e) => {
        if (e && e[0] && e[1]) {
          setTimeDto({
            startTime: e[0].format("YYYY/MM/DD HH:mm:ss"),
            endTime: e[1].format("YYYY/MM/DD HH:mm:ss"),
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
