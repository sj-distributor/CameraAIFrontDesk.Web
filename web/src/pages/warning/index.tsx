import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Radio } from "antd";
import { createContext } from "react";
import { useOutlet } from "react-router-dom";

import { BreadcrumbComponent } from "@/components/breadcrumb";
import { CheckBoxComponent } from "@/components/check-box";
import { RangePickerComponent } from "@/components/date-range-picker";
import { SelectComponent } from "@/components/select";

import { useAction } from "./hook";
import { IWarningSearchDataContext } from "./props";

export const WarningSearchDataContext =
  createContext<IWarningSearchDataContext>(null!);

export const Warning = () => {
  const {
    isMark,
    height,
    status,
    timeDto,
    location,
    warningHeaderRef,
    selectValues,
    keyWord,
    searchKeyWord,
    isOpenMarkModel,
    handleOnExportDebounceFn,
    setTimeDto,
    setKeyWord,
    onTypeClick,
    onStatusClick,
    setIsOpenmMarkModel,
  } = useAction();

  const outlet = useOutlet();

  return (
    <div className="w-full h-full flex flex-col py-5 px-5 space-y-4">
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
          ) : isMark ? (
            <Button
              icon={<img src="/src/assets/pin.png" />}
              className="h-12 w-[100px] text-[#2866F1] bg-[#C2D5FF] !rounded-[56px] hover:!text-[#2866F1] hover:!border-[#C2D5FF] flex justify-center items-center"
            >
              標記
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div
        className="shrink-0"
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
        open={true}
        centered={true}
        title={<span className="select-none">狀態標記</span>}
        closeIcon={false}
        footer={null}
      >
        <div className="bg-red-300 w-full h-full">
          <Radio.Group>
            <Radio value={1}>A</Radio>
            <Radio value={2}>B</Radio>
          </Radio.Group>
        </div>
        {/* <div className="min-h-24">123</div> */}
      </Modal>
    </div>
  );
};
