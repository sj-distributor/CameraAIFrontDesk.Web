import { Pagination, Table, Tooltip } from "antd/es";
import dayjs from "dayjs";

import { IRecordItem, IStatusType } from "@/dtos/default";
import KEYS from "@/i18n/keys/feedback-list";

import { useAction } from "./hook";

export const FeedbackList = () => {
  const { t, dto, updateData, handleScroll, navigate } = useAction();

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
      render: (text: string) => {
        const img = () => {
          if (text.includes("人員") || text.includes("人员"))
            return (
              <img
                src="../../../src/assets/people.png"
                className="w-4 h-4 img-no-darg"
              />
            );
          else if (text.includes("異常車輛") || text.includes("异常车辆")) {
            return (
              <img
                src="../../../src/assets/error-car.png"
                className="w-4 h-4 img-no-darg"
              />
            );
          } else if (text.includes("車輛") || text.includes("车辆")) {
            return (
              <img
                src="../../../src/assets/car.png"
                className="w-4 h-4 img-no-darg"
              />
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
      title: t(KEYS.ALERT_CONTENT, { ns: "feedbackList" }),
      dataIndex: "monitorTypeName",
      key: "monitorTypeName",
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
      title: t(KEYS.ABNORMAL_REASON, { ns: "feedbackList" }),
      dataIndex: "exceptionReason",
      key: "exceptionReason",
      width: 308,
      render: (text: string, record: IRecordItem) => {
        return (
          <Tooltip title={text}>
            <div
              className="cursor-pointer line-clamp-2"
              onClick={() => {
                navigate(`/warning/${record.id}`, {
                  state: {
                    status: IStatusType.Verifed,
                    record: record,
                  },
                });
              }}
            >
              {text}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: t(KEYS.START_TIME, { ns: "feedbackList" }),
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
      title: t(KEYS.CONTINUE_TIME, { ns: "feedbackList" }),
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
          updateData("PageIndex", page);
          updateData("PageSize", pageSize);
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
