import { BreadcrumbComponent } from "@/components/breadcrumb";
import {
  CloseCircleFilled,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  Button,
  Input,
  Popover,
  Table,
  TableProps,
  Image,
  Calendar,
} from "antd";

import importImg from "../../assets/import.png";
import { AccessTypeEnum, AccessTypeLabel } from "./props";
import { useAction } from "./hook";
import { isNil } from "ramda";

export const Access = () => {
  const {
    mockTableList,
    paginationDto,
    yesterday,
    showPopover,
    updatePaginationDto,
    updateShowPopover,
  } = useAction();

  const items = [
    {
      value: AccessTypeEnum.SafeDoor,
      label: AccessTypeLabel[AccessTypeEnum.SafeDoor],
    },
    {
      value: AccessTypeEnum.RollDoor,
      label: AccessTypeLabel[AccessTypeEnum.RollDoor],
    },
  ];

  const columns: TableProps<any>["columns"] = [
    {
      title: "出入口类型",
      dataIndex: "type",
    },
    {
      title: "出入口名称",
      dataIndex: "name",
    },
    {
      title: "开门次数",
      dataIndex: "openTimes",
    },
    {
      title: "合计时长",
      dataIndex: "continue",
    },
    {
      title: "图片",
      dataIndex: "picture",
      render: (value) => {
        return (
          <Image src={value} style={{ width: "2.69rem", height: "2.63rem" }} />
        );
      },
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
    },
  ];

  const TypeDropDownRender = () => {
    return (
      <div className="bg-white w-[8rem] flex flex-col justify-between rounded-md">
        {items.map((item, index) => {
          return (
            <div
              key={index}
              className={`cursor-pointer hover:bg-[#EBF1FF] h-[2.2rem] flex items-center pl-2 rounded-md ${
                item.value === paginationDto.accessType && "bg-[#EBF1FF]"
              }`}
              onClick={() => {
                updateShowPopover("accessTypeOpen", false);

                updatePaginationDto("accessType", item.value);
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col py-5 px-5 overflow-auto no-scrollbar">
      <BreadcrumbComponent />
      <div className="flex items-center flex-wrap">
        <Input
          placeholder="請輸入出入口名稱"
          className="rounded-[3rem] text-base w-[9.88rem] h-[3rem] mr-[2rem]"
        />

        <div className="flex items-center mr-[2rem]">
          <span className="text-[#566172] text-[0.88rem]">出入口类型：</span>
          <Popover
            trigger="click"
            content={TypeDropDownRender}
            open={showPopover.accessTypeOpen}
            arrow={false}
            placement="bottomLeft"
            onOpenChange={(open) => updateShowPopover("accessTypeOpen", open)}
          >
            <div className="text-[#2866F1] cursor-pointer group relative flex items-center text-[1rem]">
              <div className="mr-3">
                {AccessTypeLabel[paginationDto.accessType]}
              </div>

              <div className="w-[1rem] flex items-center justify-center">
                <DownOutlined
                  className={`${
                    paginationDto.accessType !== AccessTypeEnum.All &&
                    "group-hover:hidden"
                  }`}
                  style={{
                    color: "#18283C",
                    fontSize: "0.7rem",
                  }}
                />
                {paginationDto.accessType !== AccessTypeEnum.All && (
                  <CloseCircleFilled
                    className="hidden group-hover:block"
                    style={{
                      fontSize: "0.9rem",
                      color: "#B8B9BC",
                    }}
                    onClick={() => {
                      updatePaginationDto("accessType", AccessTypeEnum.All);
                    }}
                  />
                )}
              </div>
            </div>
          </Popover>
        </div>

        <div className="flex items-center mr-[1.5rem] w-[12rem]">
          <span className="text-[#566172] text-[0.88rem]">选择时间：</span>
          <Popover
            trigger="click"
            open={showPopover.datePickerOpen}
            content={() => {
              return (
                <div className="bg-white w-[8rem] flex flex-col justify-between rounded-md">
                  <div
                    className={`cursor-pointer hover:bg-[#EBF1FF] h-[2.2rem] flex items-center pl-2 rounded-md ${
                      yesterday.isSame(paginationDto.time, "day") &&
                      "bg-[#EBF1FF]"
                    }`}
                    onClick={() => {
                      updatePaginationDto("time", yesterday);

                      setTimeout(
                        () => updateShowPopover("datePickerOpen", false),
                        0
                      );
                    }}
                  >
                    昨天
                  </div>
                  <Popover
                    arrow={false}
                    open={showPopover.showCalendar}
                    placement="right"
                    overlayClassName="customDate"
                    content={() => {
                      return (
                        <Calendar
                          value={paginationDto.time}
                          fullscreen={false}
                          className="w-[18.75rem] h-[20rem] customCalendar"
                          onSelect={(value) => {
                            updatePaginationDto("time", value);

                            updateShowPopover("showCalendar", false);

                            setTimeout(
                              () => updateShowPopover("datePickerOpen", false),
                              0
                            );
                          }}
                        />
                      );
                    }}
                    onOpenChange={(open) =>
                      updateShowPopover("showCalendar", open)
                    }
                  >
                    <div
                      className={`cursor-pointer hover:bg-[#EBF1FF] h-[2.2rem] flex items-center pl-2 rounded-md ${
                        !yesterday.isSame(paginationDto.time, "day") &&
                        !isNil(paginationDto.time) &&
                        "bg-[#EBF1FF]"
                      }`}
                    >
                      自定义日期
                    </div>
                  </Popover>
                </div>
              );
            }}
            arrow={false}
            placement="bottomLeft"
            onOpenChange={(open) => updateShowPopover("datePickerOpen", open)}
          >
            <div className="text-[#2866F1] cursor-pointer group relative flex items-center text-[1rem]">
              <div className="mr-3">
                {isNil(paginationDto.time)
                  ? "请选择"
                  : paginationDto.time.format("YYYY-MM-DD")}
              </div>

              <div className="w-[1rem] flex items-center justify-center">
                <DownOutlined
                  className={`${
                    !isNil(paginationDto.time) && "group-hover:hidden"
                  }`}
                  style={{
                    color: "#18283C",
                    fontSize: "0.7rem",
                  }}
                />
                {!isNil(paginationDto.time) && (
                  <CloseCircleFilled
                    className="hidden group-hover:block"
                    style={{
                      fontSize: "0.9rem",
                      color: "#B8B9BC",
                    }}
                    onClick={() => {
                      updatePaginationDto("time", undefined);
                    }}
                  />
                )}
              </div>
            </div>
          </Popover>
        </div>

        <Button
          type="primary"
          className="w-[6.25rem] h-[3rem] rounded-[3.5rem]"
        >
          查询
        </Button>

        <div className="flex items-center ml-auto">
          <Input
            placeholder="搜索设备名称"
            className="rounded-[3rem] text-base w-[12.5rem] h-[3rem] mr-[1.5rem]"
            suffix={<SearchOutlined />}
          />
          <Button
            icon={<img src={importImg} />}
            type="primary"
            className="w-[6.25rem] h-[3rem] rounded-[3.5rem]"
          >
            导出
          </Button>
        </div>
      </div>

      <div className="bg-white h-full box-border rounded-lg flex flex-col mt-[1rem] no-scrollbar">
        <div className="flex-1 no-scrollbar mt-[1.5rem]">
          <Table
            className="tableScroll"
            dataSource={mockTableList.data}
            columns={columns}
            rowKey={(record) => record.id}
            scroll={{ x: 800, y: "calc(100vh - 22rem)" }}
            pagination={{
              current: paginationDto.PageIndex,
              pageSize: paginationDto.PageSize,
              total: mockTableList.count,
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                updatePaginationDto("PageIndex", page),
                  updatePaginationDto("PageSize", pageSize);
              },
              showTotal: (total) => {
                return (
                  <div>
                    共
                    <span className="text-[#2866F1] mx-[0.5rem]">{total}</span>
                    条数据
                  </div>
                );
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
