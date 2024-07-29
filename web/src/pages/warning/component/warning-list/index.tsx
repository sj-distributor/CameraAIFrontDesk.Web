import "@/antd.css";

import {
  CheckOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Pagination, Tooltip } from "antd";
import Table from "antd/es/table";
import dayjs from "dayjs";
import { ReactElement } from "react";

import { ICameraAiMonitorType, IRecordItem, IStatusType } from "@/dtos/default";
import KEYS from "@/i18n/keys/alert-list";

import carImg from "../../../../assets/car.png";
import error_carImg from "../../../../assets/error-car.png";
import peopleImg from "../../../../assets/people.png";
import { useAction } from "./hook";

const statusComponent = (
  boxBorderColor: string,
  textColor: string,
  text: string,
  icon: ReactElement,
  canViewDetailWarning: boolean,
  func: VoidFunction
) => {
  const handleClick = () => {
    if (canViewDetailWarning) func();
  };

  return (
    <span
      className={`py-[0.25rem] px-[0.625rem] border border-solid rounded-lg space-x-1 cursor-pointer ${boxBorderColor}`}
      onClick={handleClick}
    >
      {icon}
      <span className={`${textColor} select-none`}>{text}</span>
    </span>
  );
};

const warningContentTips = (record: IRecordItem) => {
  if (record.monitorType === ICameraAiMonitorType.Costume) {
    return (
      <div>
        {record.name}無配戴{record.costumesDetected}
      </div>
    );
  } else {
    return <div>{record.name}</div>;
  }
};

export const WarningList = () => {
  const { t, dto, pagePermission, navigate, handleScroll, onChangePage } =
    useAction();

  const columns = [
    {
      title: t(KEYS.DEVICE, { ns: "alertList" }),
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
      title: t(KEYS.ALERT_TYPE, { ns: "alertList" }),
      dataIndex: "monitorTypeName",
      key: "monitorTypeName",
      width: 180,
      render: (text: string) => {
        const img = () => {
          if (text.includes("人員") || text.includes("人员"))
            return <img src={peopleImg} className="w-4 h-4 img-no-darg" />;
          else if (text.includes("異常車輛") || text.includes("异常车辆")) {
            return <img src={error_carImg} className="w-4 h-4 img-no-darg" />;
          } else if (text.includes("車輛") || text.includes("车辆")) {
            return <img src={carImg} className="w-4 h-4 img-no-darg" />;
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
      title: t(KEYS.ALERT_CONTENT, { ns: "alertList" }),
      dataIndex: "monitorContent",
      key: "monitorContent",
      width: 200,
      render: (_: string, record: IRecordItem) => {
        return (
          <div className="w-full text-wrap select-none">
            {record.equipmentName},{record.monitorTypeName}（
            {warningContentTips(record)}
            ）出現超過 {record.settingDuration} 秒
          </div>
        );
      },
    },
    {
      title: t(KEYS.STATUS, { ns: "alertList" }),
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
              pagePermission.canViewDetailWarning,
              () =>
                navigate(`/warning/${record.id}`, {
                  state: {
                    status: IStatusType.Unmarked,
                    record: record,
                  },
                })
            );
          case IStatusType.Verifed:
            return statusComponent(
              "border-[#04B6B5]",
              "text-[#04B6B5]",
              "通過",
              <CheckOutlined className="text-[#04B6B5] text-sm" />,
              pagePermission.canViewDetailWarning,
              () =>
                navigate(`/warning/${record.id}`, {
                  state: {
                    status: IStatusType.Verifed,
                    record: record,
                  },
                })
            );
          case IStatusType.Exception:
            return statusComponent(
              "border-[#FF908C]",
              "text-[#FF908C]",
              "異常",
              <ExclamationCircleOutlined className="text-[#FF908C] text-sm" />,
              pagePermission.canViewDetailWarning,
              () =>
                navigate(`/warning/${record.id}`, {
                  state: {
                    status: IStatusType.Exception,
                    record: record,
                  },
                })
            );
        }
      },
    },
    {
      title: t(KEYS.START_TIME, { ns: "alertList" }),
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
      title: t(KEYS.CONTINUE_TIME, { ns: "alertList" }),
      dataIndex: "monitorDuration",
      key: "monitorDuration",
      width: 180,
      render: (text: number) => {
        return text ? (
          <span className="select-none">
            {`${String(Math.floor(text / 60)).padStart(2, "0")}:${String(
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
      className="h-full box-border rounded-lg flex flex-col bg-white"
      id="warning-box"
    >
      <div
        className="flex-1 no-scrollbar mt-[1.5rem]"
        style={{ overflowY: "scroll" }}
        onScroll={handleScroll}
      >
        <Table
          sticky={true}
          loading={dto.loading}
          dataSource={dto.records}
          scroll={{ x: "100%" }}
          rowKey={(record) =>
            record.id + Math.floor(Math.random() * 100000000000)
          }
          columns={columns}
          pagination={false}
        />
      </div>
      <Pagination
        className="my-5 flex justify-end"
        current={dto.PageIndex}
        pageSize={dto.PageSize}
        total={dto.count}
        showSizeChanger
        showLessItems
        pageSizeOptions={[10, 15, 20, 50]}
        showQuickJumper={true}
        hideOnSinglePage={false}
        onChange={(page, pageSize) => {
          onChangePage(page, pageSize);
        }}
        showTotal={(total) => (
          <div>
            {t(KEYS.TOTAL, { ns: "alertList" })}
            <span className="text-[#2866F1]"> {total} </span>
            {t(KEYS.TOTAL_DATA, { ns: "alertList" })}
          </div>
        )}
        locale={{
          jump_to: t(KEYS.JUMPT_TO, { ns: "alertList" }),
          items_per_page: t(KEYS.ITEMS_PER_PAGE, { ns: "alertList" }),
          page: t(KEYS.PAGE, { ns: "alertList" }),
        }}
      />
    </div>
  );
};
