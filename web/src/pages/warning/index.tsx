import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Radio } from "antd";
import { createContext } from "react";
import { useOutlet } from "react-router-dom";

import { BreadcrumbComponent } from "@/components/breadcrumb";
import { CheckBoxComponent } from "@/components/check-box";
import { RangePickerComponent } from "@/components/date-range-picker";
import { SelectComponent } from "@/components/select";
import { IStatusType } from "@/dtos/default";

import { useAction } from "./hook";
import { IWarningSearchDataContext } from "./props";

const { TextArea } = Input;

export const WarningSearchDataContext =
  createContext<IWarningSearchDataContext>(null!);

export const Warning = () => {
  const {
    height,
    status,
    timeDto,
    location,
    warningHeaderRef,
    selectValues,
    keyWord,
    searchKeyWord,
    markModelDto,
    handleOnMarkDebounceFn,
    handleOnExportDebounceFn,
    setTimeDto,
    setKeyWord,
    onTypeClick,
    onStatusClick,
    setMarkModelDto,
  } = useAction();

  const outlet = useOutlet();

  return (
    <div className="w-full h-full flex flex-col py-5 px-5 space-y-1">
      <div
        className="flex flex-wrap items-center justify-between min-h-16"
        ref={warningHeaderRef}
      >
        <div className="">
          <BreadcrumbComponent />
          {location.pathname === "/warning/list" && (
            <div className="flex items-center flex-wrap space-x-4">
              <div>
                <span className="font-medium text-sm text-[#566172] select-none">
                  選擇日期時間：
                </span>

                <RangePickerComponent
                  timeDto={timeDto}
                  setTimeDto={setTimeDto}
                />
              </div>
              <CheckBoxComponent
                title="預警篩選："
                selectValues={selectValues}
                onClick={onTypeClick}
              />
              <SelectComponent
                title="狀態："
                value={status}
                onClick={onStatusClick}
              />
            </div>
          )}
        </div>
        <div className="flex space-x-6 flex-wrap">
          {location.pathname === "/warning/list" ? (
            <>
              <Input
                placeholder="搜索設備名稱"
                className="rounded-[48px] text-base w-[200px]"
                suffix={<SearchOutlined className="" />}
                value={keyWord}
                onChange={(e) => setKeyWord(e.target.value)}
              />
              <Button
                icon={<img src="/src/assets/import.png" />}
                className="h-12 w-[100px] text-white bg-[#2866F1] !rounded-[56px] hover:!text-white flex items-center justify-center"
                onClick={handleOnExportDebounceFn}
              >
                導出
              </Button>
            </>
          ) : markModelDto.status !== null &&
            markModelDto.status === IStatusType.Unmarked ? (
            <Button
              icon={<img src="/src/assets/pin.png" />}
              className="h-12 w-[100px] text-[#2866F1] bg-[#C2D5FF] !rounded-[56px] hover:!text-[#2866F1] hover:!border-[#C2D5FF] flex justify-center items-center"
              onClick={() =>
                setMarkModelDto((prev) => ({
                  ...prev,
                  open: true,
                }))
              }
            >
              標記
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div
        style={{
          height: height + "px",
        }}
      >
        <WarningSearchDataContext.Provider
          value={{
            status: status,
            selectValues: selectValues,
            timeDto: timeDto,
            searchKeyWord: searchKeyWord,
          }}
        >
          {outlet}
        </WarningSearchDataContext.Provider>
      </div>

      <Modal
        open={markModelDto.open}
        centered={true}
        className="mark"
        title={<span className="select-none ml-4">狀態標記</span>}
        closeIcon={false}
        footer={
          <div className="w-full box-border px-4 space-x-2 pt-5 border-t-[1px] border-[#E9EDF2]">
            <button
              className="bg-[#E6EAF4] text-[#8B98AD] rounded-[56px] w-[4.25rem] h-[2.125rem] select-none"
              onClick={() => {
                setMarkModelDto((prev) => ({
                  ...prev,
                  open: false,
                }));
              }}
            >
              取消
            </button>
            <button
              className="bg-[#2866F1] text-white rounded-[56px] w-[4.25rem] h-[2.125rem] select-none"
              onClick={handleOnMarkDebounceFn}
            >
              确认
            </button>
          </div>
        }
      >
        <div className="w-full h-full box-border px-4">
          <div className="flex items-center space-x-2 my-6">
            <span className="text-base select-none">標記</span>
            <Radio.Group
              value={markModelDto.status}
              onChange={(e) => {
                setMarkModelDto((prev) => ({
                  ...prev,
                  status: e.target.value as IStatusType,
                }));
              }}
            >
              <Radio value={IStatusType.Verifed}>
                <strong className="select-none">已通過</strong>
              </Radio>
              <Radio value={IStatusType.Exception}>
                <strong className="select-none">異常</strong>
              </Radio>
            </Radio.Group>
          </div>
          {markModelDto.status === IStatusType.Exception && (
            <div className="flex space-x-2">
              <span className="text-base select-none">原因</span>
              <TextArea
                className="flex-1"
                value={markModelDto.exceptionReason}
                autoSize={{
                  minRows: 4,
                  maxRows: 4,
                }}
                onChange={(e) => {
                  setMarkModelDto((prev) => ({
                    ...prev,
                    exceptionReason: e.target.value,
                  }));
                }}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
