import { Button } from "antd";
import { createContext } from "react";
import { useOutlet } from "react-router-dom";

import { BreadcrumbComponent } from "@/components/breadcrumb";
import { CheckBoxComponent } from "@/components/check-box";
import { RangePickerComponent } from "@/components/date-range-picker";

import { useAction } from "./hook";
import { IFeedbackSearchDataContext } from "./props";

export const FeedbackSearchDataContext =
  createContext<IFeedbackSearchDataContext>(null!);

export const Feedback = () => {
  const {
    feedbackHeaderRef,
    selectValues,
    timeDto,
    height,
    handleOnExportDebounceFn,
    onTypeClick,
    setTimeDto,
  } = useAction();

  const outlet = useOutlet();

  return (
    <div className="w-full h-full flex flex-col py-5 px-5 space-y-1 overflow-auto no-scrollbar">
      <div
        className="flex flex-wrap items-center justify-between min-h-16"
        ref={feedbackHeaderRef}
      >
        <div>
          <BreadcrumbComponent />
          <div className="flex items-center flex-wrap space-x-4">
            <div>
              <span className="font-medium text-sm text-[#566172] select-none">
                選擇日期時間：
              </span>

              <RangePickerComponent timeDto={timeDto} setTimeDto={setTimeDto} />
            </div>
            <CheckBoxComponent
              title="預警篩選："
              selectValues={selectValues}
              onClick={onTypeClick}
            />
          </div>
        </div>
        <div className="flex space-x-6 flex-wrap">
          <Button
            icon={<img src="/src/assets/import.png" />}
            className="h-12 w-[100px] text-white bg-[#2866F1] !rounded-[56px] hover:!text-white flex items-center justify-center"
            onClick={handleOnExportDebounceFn}
          >
            導出
          </Button>
        </div>
      </div>

      <div
        style={{
          height: height + "px",
        }}
      >
        <FeedbackSearchDataContext.Provider
          value={{
            selectValues: selectValues,
            timeDto: timeDto,
          }}
        >
          {outlet}
        </FeedbackSearchDataContext.Provider>
      </div>
    </div>
  );
};
