import "@/antd.css";

import {
  CheckOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Pagination, Tooltip } from "antd";
import Table from "antd/es/table";
import { ReactElement } from "react";

import { ICameraAiMonitorType, IRecordItem, IStatusType } from "@/dtos/default";
import KEYS from "@/i18n/keys/alert-list";

import carImg from "../../../../assets/car.png";
import error_carImg from "../../../../assets/error-car.png";
import peopleImg from "../../../../assets/people.png";
import floorIceImg from "../../../../assets/floor_ice.png";
import floorWaterImg from "../../../../assets/floor_water.png";
import doorSafetyImg from "../../../../assets/door-safety.png";
import doorRollingImg from "../../../../assets/door_rolling.png";
import { useAction } from "./hook";
import { renderAlertText } from "@/utils/monitor-summary";

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
      render: (text: string, record: IRecordItem) => {
        const renderImage = () => {
          switch (record.monitorType) {
            case ICameraAiMonitorType.People:
            case ICameraAiMonitorType.Smoke:
            case ICameraAiMonitorType.Fight:
            case ICameraAiMonitorType.Costume:
            case ICameraAiMonitorType.TouchGoods:
            case ICameraAiMonitorType.Move:
            case ICameraAiMonitorType.FallDown:
              return <img src={peopleImg} className="w-4 h-4 img-no-darg" />;

            case ICameraAiMonitorType.Vehicles:
            case ICameraAiMonitorType.Antiskid:
            case ICameraAiMonitorType.ForkliftFork:
            case ICameraAiMonitorType.Tidy:
            case ICameraAiMonitorType.TrashCanLid:
              return <img src={carImg} className="w-4 h-4 img-no-darg" />;

            case ICameraAiMonitorType.AbnormalVehicles:
            case ICameraAiMonitorType.Forklift:
              return <img src={error_carImg} className="w-4 h-4 img-no-darg" />;

            case ICameraAiMonitorType.FloorIce:
              return <img src={floorIceImg} className="w-4 h-4 img-no-darg" />;

            case ICameraAiMonitorType.FloorWater:
              return (
                <img src={floorWaterImg} className="w-4 h-4 img-no-darg" />
              );

            case ICameraAiMonitorType.DoorSafety:
              return (
                <img src={doorSafetyImg} className="w-4 h-4 img-no-darg" />
              );

            case ICameraAiMonitorType.DoorRolling:
              return (
                <img src={doorRollingImg} className="w-4 h-4 img-no-darg" />
              );
          }
        };

        return (
          <div className="flex items-center space-x-2 select-none">
            {renderImage()}
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
            {record.equipmentName},{renderAlertText(record)}
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
      dataIndex: "locationTime",
      key: "locationTime",
      width: 180,
      render: (text: string) => {
        return text ? (
          <span className="select-none">{text.replace(/[+-].*/, "")}</span>
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
