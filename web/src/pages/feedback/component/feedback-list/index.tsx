import { Table, Tooltip } from "antd/es";
import dayjs from "dayjs";

import { IRecordItem } from "@/services/dtos/default";

import { useAction } from "./hook";

const columns = [
  {
    title: "設備名稱",
    dataIndex: "equipmentName",
    key: "equipmentName",
    width: 200,
    render: (text: string) => {
      return (
        <div className="w-full truncate select-none">
          <Tooltip
            overlayClassName="select-none"
            className="w-full truncate"
            placement="topLeft"
            title={text}
          >
            {text}
          </Tooltip>
        </div>
      );
    },
  },
  {
    title: "預警類型",
    dataIndex: "monitorTypeName",
    key: "monitorTypeName",
    width: 200,
    render: (text: string) => {
      const img = () => {
        if (text.includes("人員") || text.includes("人员"))
          return (
            <img src="/src/assets/people.png" className="w-4 h-4 img-no-darg" />
          );
        else if (text.includes("異常車輛") || text.includes("异常车辆")) {
          return (
            <img
              src="/src/assets/error-car.png"
              className="w-4 h-4 img-no-darg"
            />
          );
        } else if (text.includes("車輛") || text.includes("车辆")) {
          return (
            <img src="/src/assets/car.png" className="w-4 h-4 img-no-darg" />
          );
        }
      };

      return (
        <div className="flex items-center space-x-2 select-none">
          {img()}
          <span>{text}</span>
        </div>
      );
    },
  },
  {
    title: "預警內容",
    dataIndex: "monitorTypeName",
    key: "monitorTypeName",
    width: 200,
    render: (_, record: IRecordItem) => {
      return (
        <div className="w-full text-wrap select-none">
          {record.equipmentName},{record.monitorTypeName}（{record.plateNumber}
          ）出現超過 {record.monitorDuration} 秒
        </div>
      );
    },
  },
  {
    title: "異常原因",
    dataIndex: "exceptionReason",
    key: "exceptionReason",
    width: 308,
  },
  {
    title: "開始時間",
    dataIndex: "occurrenceTime",
    key: "occurrenceTime",
    width: 180,
    render: (text: string) => {
      return text ? (
        <span className="select-none">
          {dayjs(text).format("YYYY-MM-DD HH:mm:ss")}
        </span>
      ) : (
        ""
      );
    },
  },
  {
    title: "持續時間",
    dataIndex: "settingDuration",
    key: "settingDuration",
    width: 180,
    render: (text: number) => {
      return text ? (
        <span className="select-none">
          {`${String(Math.round(text / 60)).padStart(2, "0")}:${String(
            text % 60
          ).padStart(2, "0")}`}
        </span>
      ) : (
        ""
      );
    },
  },
];

export const FeedbackList = () => {
  const { height, dto, isShowQuickJumper, updateData } = useAction();

  return (
    <div
      className="bg-white w-full h-full overflow-x-auto box-border pt-5 rounded-lg overflow-y-auto"
      id="feedback-box"
    >
      <div className="h-full w-full min-h-96">
        <Table
          loading={dto.loading}
          dataSource={dto.records}
          rowKey={(record) => record.id}
          columns={columns}
          scroll={{ y: height ?? 0 }}
          pagination={{
            position: ["bottomRight"],
            pageSizeOptions: [10, 15, 20, 50],
            current: dto.PageIndex,
            pageSize: dto.PageSize,
            showQuickJumper: isShowQuickJumper,
            showSizeChanger: true,
            hideOnSinglePage: false,
            showLessItems: true,
            total: dto.count,
            size: "small",
            showTotal: (total) => (
              <div className="w-full">
                共<span className="text-[#2866F1]"> {total} </span>條數據
              </div>
            ),
            onChange: (page, pageSize) => {
              updateData("PageIndex", page);
              updateData("PageSize", pageSize);
            },
          }}
        />
      </div>
    </div>
  );
};
