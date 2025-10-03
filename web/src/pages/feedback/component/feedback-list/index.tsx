import { Pagination, Table, Tooltip } from "antd/es";

import { ICameraAiMonitorType, IRecordItem, IStatusType } from "@/dtos/default";
import KEYS from "@/i18n/keys/feedback-list";

import carImg from "../../../../assets/car.png";
import error_carImg from "../../../../assets/error-car.png";
import peopleImg from "../../../../assets/people.png";
import floorIceImg from "../../../../assets/floor_ice.png";
import floorWaterImg from "../../../../assets/floor_water.png";
import doorSafetyImg from "../../../../assets/door-safety.png";
import doorRollingImg from "../../../../assets/door_rolling.png";

import { useAction } from "./hook";
import { renderAlertText } from "@/utils/monitor-summary";

export const FeedbackList = () => {
  const { t, dto, pagePermission, handleScroll, navigate, onChangePage } =
    useAction();

  const columns = [
    {
      title: t(KEYS.DEVICE, { ns: "feedbackList" }),
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
      title: t(KEYS.ALERT_TYPE, { ns: "feedbackList" }),
      dataIndex: "monitorTypeName",
      key: "monitorTypeName",
      width: 200,
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
      title: t(KEYS.ALERT_CONTENT, { ns: "feedbackList" }),
      dataIndex: "monitorTypeName",
      key: "monitorTypeName",
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
      title: t(KEYS.ABNORMAL_REASON, { ns: "feedbackList" }),
      dataIndex: "exceptionReason",
      key: "exceptionReason",
      width: 308,
      render: (text: string) => {
        return (
          <Tooltip title={text}>
            <div className="cursor-pointer line-clamp-2">{text}</div>
          </Tooltip>
        );
      },
    },
    {
      title: t(KEYS.START_TIME, { ns: "feedbackList" }),
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
      title: t(KEYS.CONTINUE_TIME, { ns: "feedbackList" }),
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
    {
      title: "提出人",
      dataIndex: "feedbackUser",
      key: "feedbackUser",
      width: 180,
    },
  ];

  return (
    <div
      className="bg-white h-full box-border rounded-lg flex flex-col"
      id="feedback-box"
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
          rowKey={(record) => record.id}
          columns={columns}
          scroll={{ x: "100%" }}
          pagination={false}
          onRow={(record) => {
            return {
              onClick: () => {
                if (pagePermission.canViewDetailFeedback) {
                  navigate(`/warning/${record.id}`, {
                    state: {
                      status: IStatusType.Verifed,
                      record: record,
                    },
                  });
                }
              },
            };
          }}
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
            {t(KEYS.TOTAL, { ns: "feedbackList" })}
            <span className="text-[#2866F1]"> {total} </span>
            {t(KEYS.TOTAL_DATA, { ns: "feedbackList" })}
          </div>
        )}
        locale={{
          jump_to: t(KEYS.JUMPT_TO, { ns: "feedbackList" }),
          items_per_page: t(KEYS.ITEMS_PER_PAGE, { ns: "feedbackList" }),
          page: t(KEYS.PAGE, { ns: "feedbackList" }),
        }}
      />
    </div>
  );
};
