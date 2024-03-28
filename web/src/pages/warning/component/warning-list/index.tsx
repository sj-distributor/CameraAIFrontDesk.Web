import "@/antd.css";

import {
  CheckOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import Table from "antd/es/table";
import dayjs from "dayjs";
import { ReactElement } from "react";

import { IRecordItem, IStatusType } from "@/dtos/default";

import { useAction } from "./hook";

const statusComponent = (
  boxBorderColor: string,
  textColor: string,
  text: string,
  icon: ReactElement,
  func: VoidFunction
) => {
  return (
    <span
      className={`py-1 px-[10px] border border-solid rounded-lg space-x-1 cursor-pointer ${boxBorderColor}`}
      onClick={func}
    >
      {icon}
      <span className={`${textColor} select-none`}>{text}</span>
    </span>
  );
};

export const WarningList = () => {
  const { height, dto, isShowQuickJumper, navigate, updateData } = useAction();

  const columns = [
    {
      title: "設備名稱",
      dataIndex: "equipmentName",
      key: "equipmentName",
      width: 180,
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
      width: 180,
      render: (text: string) => {
        const img = () => {
          if (text.includes("人員") || text.includes("人员"))
            return (
              <img
                src="/src/assets/people.png"
                className="w-4 h-4 img-no-darg"
              />
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
      dataIndex: "monitorContent",
      key: "monitorContent",
      width: 200,
      render: (_: string, record: IRecordItem) => {
        return (
          <div className="w-full text-wrap select-none">
            {record.equipmentName},{record.monitorTypeName}（
            {record.plateNumber}
            ）出現超過 {record.monitorDuration} 秒
          </div>
        );
      },
    },
    {
      title: "狀態",
      dataIndex: "recordStatus",
      key: "recordStatus",
      width: 180,
      render: (text: IStatusType, record: IRecordItem) => {
        switch (text) {
          case IStatusType.Unmarked:
            return statusComponent(
              "border-[#E9EDF2]",
              "text-[#18283C]",
              "待標記",
              <PlusOutlined className="text-[#18283C] text-sm" />,
              () =>
                navigate(`/warning/${record.id}`, {
                  state: {
                    status: IStatusType.Unmarked,
                  },
                })
            );
          case IStatusType.Verifed:
            return statusComponent(
              "border-[#04B6B5]",
              "text-[#04B6B5]",
              "通過",
              <CheckOutlined className="text-[#04B6B5] text-sm" />,
              () =>
                navigate(`/warning/${record.id}`, {
                  state: {
                    status: IStatusType.Verifed,
                  },
                })
            );
          case IStatusType.Exception:
            return statusComponent(
              "border-[#FF908C]",
              "text-[#FF908C]",
              "異常",
              <ExclamationCircleOutlined className="text-[#FF908C] text-sm" />,
              () =>
                navigate(`/warning/${record.id}`, {
                  state: {
                    status: IStatusType.Exception,
                  },
                })
            );
        }
      },
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

  return (
    <div
      className="bg-green-300 w-full h-full box-border rounded-lg flex flex-col"
      id="warning-box"
    >
      <div className="flex-1 min-h-96">
        <Table
          loading={dto.loading}
          dataSource={dto.records}
          rowKey={(record) =>
            record.id + Math.floor(Math.random() * 100000000000)
          }
          columns={columns}
          scroll={{ y: height ?? 0 }}
          // scroll={{ y: 800 }}
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
