import { Button } from "antd";
import { createContext } from "react";
import { useOutlet } from "react-router-dom";

import { BreadcrumbComponent } from "@/components/breadcrumb";
import { CheckBoxComponent } from "@/components/check-box";
import { RangePickerComponent } from "@/components/date-range-picker";
import KEYS from "@/i18n/keys/feedback-list";

import { useAction } from "./hook";
import { IFeedbackSearchDataContext } from "./props";

import importImg from "../../assets/import.png";

export const FeedbackSearchDataContext =
  createContext<IFeedbackSearchDataContext>(null!);

export const Feedback = () => {
  const {
    t,
    feedbackHeaderRef,
    selectValues,
    timeDto,
    height,
    handleOnExportDebounceFn,
    pagePermission,
    onTypeClick,
    setTimeDto,
  } = useAction();

  const outlet = useOutlet();

  return (
    <div className="w-full h-full flex flex-col py-5 px-5 space-y-1 overflow-auto no-scrollbar">
      <div
        className="flex flex-wrap items-center justify-between"
        ref={feedbackHeaderRef}
      >
        <div>
          <BreadcrumbComponent />
          <div className="flex items-center flex-wrap space-x-4">
            <div>
              <span className="font-medium text-sm text-[#566172] select-none">
                {t(KEYS.SELECT_DATE_TIME, { ns: "feedbackList" })}
              </span>

              <RangePickerComponent timeDto={timeDto} setTimeDto={setTimeDto} />
            </div>
            <CheckBoxComponent
              title={t(KEYS.ALERT_SELECT, { ns: "feedbackList" })}
              selectValues={selectValues}
              monitorSummary={true}
              onClick={onTypeClick}
            />
          </div>
        </div>
        <div className="flex space-x-6 flex-wrap">
          {pagePermission.canExportExcelFeedback && (
            <Button
              icon={<img src={importImg} />}
              className="h-12 w-[6.25rem] text-white bg-[#2866F1] !rounded-[3.5rem] hover:!text-white flex items-center justify-center hover:!bg-[#2866F1]"
              onClick={handleOnExportDebounceFn}
            >
              {t(KEYS.EXPORT, {
                ns: "feedbackList",
              })}
            </Button>
          )}
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
