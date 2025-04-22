import { ICameraAiMonitorType } from "@/dtos/default";
import { ElementIcon, PeopleIcon, VehiclesIcon } from "@/icon/monitor";
import { DownOutlined } from "@ant-design/icons";
import { Checkbox, Switch } from "antd";
import { clone } from "ramda";
import { forwardRef, useImperativeHandle } from "react";
import { Fragment } from "react/jsx-runtime";
import { IWarningType } from "./props";
import { useAction } from "./hook";

export const WarningSelect = forwardRef((_, ref) => {
  const {
    warningList,
    selectValues,
    checkIndex,
    setSelectValues,
    setCheckIndex,
    handleSelect,
    flatten,
  } = useAction();

  useImperativeHandle(ref, () => ({
    selectValues,
    checkIndex,
    setSelectValues,
    setCheckIndex,
  }));

  const getIconHeader = (type: IWarningType | ICameraAiMonitorType) => {
    const iconProps = {
      className:
        "w-[2rem] h-[2rem] flex justify-center items-center rounded-[.5rem]",
      icon: <PeopleIcon />,
      bgColor: "",
    };

    switch (type) {
      case IWarningType.People:
        iconProps.icon = <PeopleIcon />;
        iconProps.bgColor = "bg-[#2853E3]";
        break;

      case IWarningType.Vehicles:
        iconProps.icon = <VehiclesIcon />;
        iconProps.bgColor = "bg-[#34A46E]";
        break;

      case IWarningType.Element:
        iconProps.icon = <ElementIcon />;
        iconProps.bgColor = "bg-[#F48445]";
        break;
    }

    return (
      <div className={`${iconProps.className} ${iconProps.bgColor}`}>
        {iconProps.icon}
      </div>
    );
  };

  return (
    <div className="w-[25rem] rounded-[.5rem] pt-[1.3rem] px-[1.3rem] h-[60vh] max-h-[35rem] overflow-y-auto">
      {warningList.map((item, index) => {
        return (
          <div className="mb-[2.5rem]" key={index}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getIconHeader(item.value)}
                <span className="ml-[.5rem] text-[.88rem] text-[#18283C] font-medium">
                  {item.label}
                </span>
              </div>
              <Switch
                checked={checkIndex.includes(item.value)}
                onChange={(checked) => {
                  if (checked) {
                    setCheckIndex((prev) => [...prev, item.value]);

                    item.value === IWarningType.People &&
                      setSelectValues((prev) => [
                        ...prev,
                        ICameraAiMonitorType.People,
                      ]);

                    item.value === IWarningType.Vehicles &&
                      setSelectValues((prev) => [
                        ...prev,
                        ICameraAiMonitorType.Vehicles,
                      ]);

                    item.value === IWarningType.Security &&
                      setSelectValues((prev) => [
                        ...prev,
                        ICameraAiMonitorType.Security,
                      ]);
                  } else {
                    setCheckIndex((prev) => {
                      let newCheckIndex = clone(prev);

                      newCheckIndex = newCheckIndex.filter(
                        (value) => value !== item.value
                      );

                      return newCheckIndex;
                    });

                    const flatDataValues = new Set(
                      flatten(item.children).map((obj) => obj.value)
                    );

                    const filterValues = (array: ICameraAiMonitorType[]) =>
                      array.filter((item) => !flatDataValues.has(item));

                    setSelectValues(filterValues(selectValues));
                  }
                }}
              />
            </div>

            <div
              className={`flex-col space-y-[.75rem] mt-[.63rem] ml-[2.63rem] ${
                item.value === IWarningType.Security ? "hidden" : "flex"
              }`}
            >
              {item.children?.map((monitorType, monitorTypeIndex) => {
                return (
                  <Fragment key={monitorTypeIndex}>
                    <Checkbox
                      disabled={
                        !checkIndex.includes(item.value) ||
                        (checkIndex.includes(item.value) &&
                          monitorType.defaultCheck)
                      }
                      checked={
                        selectValues.findIndex(
                          (option) => option === monitorType.value
                        ) !== -1 ||
                        (monitorType.children &&
                          monitorType.children.every((child) =>
                            selectValues.includes(child.value)
                          )) ||
                        (monitorType.defaultCheck &&
                          checkIndex.includes(item.value))
                      }
                      indeterminate={
                        monitorType.children &&
                        selectValues.some((value) =>
                          monitorType.children?.some(
                            (child) => child.value === value
                          )
                        ) &&
                        !monitorType.children.every((child) =>
                          selectValues.includes(child.value)
                        )
                      }
                      onChange={() => {
                        handleSelect(monitorType.value);
                      }}
                    >
                      {monitorType.label}
                      {monitorType.children && (
                        <DownOutlined
                          style={{
                            marginLeft: "0.5rem",
                            width: "0.56rem",
                            height: "0.34rem",
                          }}
                        />
                      )}
                    </Checkbox>

                    {monitorType.children && (
                      <Checkbox.Group
                        disabled={!checkIndex.includes(item.value)}
                        className="ml-[1.5rem]"
                        options={monitorType.children}
                        value={selectValues}
                        onChange={(list) => {
                          handleSelect(monitorType.value, list);
                        }}
                      />
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});
