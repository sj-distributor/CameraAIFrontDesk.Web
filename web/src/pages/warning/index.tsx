import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Radio } from "antd";
import { createContext } from "react";
import { useOutlet } from "react-router-dom";

import { BreadcrumbComponent } from "@/components/breadcrumb";
import { CheckBoxComponent } from "@/components/check-box";
import { RangePickerComponent } from "@/components/date-range-picker";
import { SelectComponent } from "@/components/select";
import { IStatusType } from "@/dtos/default";
import KEYS from "@/i18n/keys/alert-list";

import importImg from "../../assets/import.png";
import pinImg from "../../assets/pin.png";
import { useAction } from "./hook";
import { IWarningSearchDataContext } from "./props";

const { TextArea } = Input;

export const WarningSearchDataContext =
  createContext<IWarningSearchDataContext>(null!);

export const Warning = () => {
  const {
    t,
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
    markedStatus,
    setTimeDto,
    setKeyWord,
    onTypeClick,
    onStatusClick,
    setMarkModelDto,
  } = useAction();

  const outlet = useOutlet();

  return (
    <div className="w-full h-full flex flex-col pt-5 pb-3 px-5 space-y-1">
      <div
        className="flex flex-wrap items-center justify-between"
        ref={warningHeaderRef}
      >
        <div>
          <BreadcrumbComponent />
          {location.pathname === "/warning/list" && (
            <div className="flex items-center flex-wrap space-x-4">
              <div>
                <span className="font-medium text-sm text-[#566172] select-none">
                  {t(KEYS.SELECT_DATE_TIME, { ns: "alertList" })}
                </span>

                <RangePickerComponent
                  timeDto={timeDto}
                  setTimeDto={setTimeDto}
                />
              </div>
              <CheckBoxComponent
                title={t(KEYS.ALERT_SELECT, { ns: "alertList" })}
                selectValues={selectValues}
                onClick={onTypeClick}
              />
              <SelectComponent
                title={t(KEYS.STATUS, { ns: "alertList" }) + "："}
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
                placeholder={t(KEYS.SEARCH_INPUT_PLACEHOLDER, {
                  ns: "alertList",
                })}
                className="rounded-[3rem] text-base w-[12.5rem]"
                suffix={<SearchOutlined className="" />}
                value={keyWord}
                onChange={(e) => setKeyWord(e.target.value)}
              />
              <Button
                icon={<img src={importImg} />}
                className="h-12 w-[6.25rem] text-white bg-[#2866F1] !rounded-[3.5rem] hover:!text-white flex items-center justify-center hover:!bg-[#2866F1]"
                onClick={handleOnExportDebounceFn}
              >
                {t(KEYS.EXPORT, {
                  ns: "alertList",
                })}
              </Button>
            </>
          ) : markedStatus !== null && markedStatus === IStatusType.Unmarked ? (
            <Button
              icon={<img src={pinImg} />}
              className="h-12 w-[6.25rem] text-[#2866F1] bg-[#C2D5FF] !rounded-[3.5rem] hover:!text-[#2866F1] hover:!border-[#C2D5FF] flex justify-center items-center"
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
          <div className="w-full box-border px-4 space-x-2 pt-5 border-t-[0.063rem] border-[#E9EDF2]">
            <button
              className="bg-[#E6EAF4] text-[#8B98AD] rounded-[3.5rem] w-[4.25rem] h-[2.125rem] select-none"
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
              className="bg-[#2866F1] text-white rounded-[3.5rem] w-[4.25rem] h-[2.125rem] select-none"
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
