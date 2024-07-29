import { ICameraAiMonitorType } from "@/dtos/default";
import { ElementIcon, PeopleIcon, VehiclesIcon } from "@/icon/monitor";
import { DownOutlined } from "@ant-design/icons";
import { Checkbox, Switch } from "antd";
import { clone } from "ramda";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { IItemProps, IWarningListProps, IWarningType } from "./props";

export const WarningSelect = forwardRef((_, ref) => {
  const warningList: IWarningListProps[] = [
    {
      label: "人員",
      value: IWarningType.People,
      children: [
        {
          label: "人員檢測",
          value: ICameraAiMonitorType.People,
          defaultCheck: true,
        },
        {
          label: "吸煙檢測",
          value: ICameraAiMonitorType.Smoke,
        },
        {
          label: "打架檢測",
          value: ICameraAiMonitorType.Fight,
        },
        {
          label: "安全配備檢測",
          value: ICameraAiMonitorType.Costume,
          children: [
            {
              label: "螢光衣",
              value: ICameraAiMonitorType.FluorescentClothing,
            },
            {
              label: "手套",
              value: ICameraAiMonitorType.Gloves,
            },
            {
              label: "安全鞋",
              value: ICameraAiMonitorType.SafetyShoes,
            },
          ],
        },
      ],
    },
    {
      label: "車輛",
      value: IWarningType.Vehicles,
      children: [
        {
          label: "識別車輛",
          value: ICameraAiMonitorType.Vehicles,
          defaultCheck: true,
        },
        {
          label: "識別異常車輛",
          value: ICameraAiMonitorType.AbnormalVehicles,
        },
      ],
    },
    {
      label: "物體",
      value: IWarningType.Element,
      children: [
        {
          label: "動物入侵",
          value: ICameraAiMonitorType.Animal,
          children: [
            {
              label: "貓",
              value: ICameraAiMonitorType.Cat,
            },
            {
              label: "狗",
              value: ICameraAiMonitorType.Dog,
            },
            {
              label: "鳥",
              value: ICameraAiMonitorType.Bird,
            },
          ],
        },
      ],
    },
  ];

  const [selectValues, setSelectValues] = useState<ICameraAiMonitorType[]>([]);

  const [checkIndex, setCheckIndex] = useState<IWarningType[]>([]);

  useImperativeHandle(ref, () => ({
    selectValues,
    checkIndex,
    setSelectValues,
    setCheckIndex,
  }));

  const handleSelect = (type: number, subTypes?: number[]) => {
    setSelectValues((prev) => {
      let newData = clone(prev);

      const animalData = [
        ICameraAiMonitorType.Cat,
        ICameraAiMonitorType.Dog,
        ICameraAiMonitorType.Bird,
      ];

      const costumeData = [
        ICameraAiMonitorType.FluorescentClothing,
        ICameraAiMonitorType.Gloves,
        ICameraAiMonitorType.SafetyShoes,
      ];

      if (subTypes) {
        if (type === ICameraAiMonitorType.Costume) {
          newData = newData.filter((value) => !costumeData.includes(value));
        }

        if (type === ICameraAiMonitorType.Animal) {
          newData = newData.filter((value) => !animalData.includes(value));
        }

        newData = newData.concat(subTypes);

        newData.push(type);

        if (!subTypes.length) {
          newData = newData.filter((value) => value !== type);
        }

        newData = newData.filter(
          (value, index, self) => self.indexOf(value) === index
        );
      } else {
        if (type === ICameraAiMonitorType.Animal) {
          newData = newData.concat(animalData);
        }

        if (type === ICameraAiMonitorType.Costume) {
          newData = newData.concat(costumeData);
        }

        const isExist = newData.findIndex((item) => item === type) !== -1;

        if (isExist) {
          newData = newData.filter((item) => item !== type);

          if (type === ICameraAiMonitorType.Animal) {
            newData = newData.filter((value) => !animalData.includes(value));
          }

          if (type === ICameraAiMonitorType.Costume) {
            newData = newData.filter((value) => !costumeData.includes(value));
          }
        } else newData.push(type);
      }

      return newData;
    });
  };

  const flatten = (items: IItemProps[]): IItemProps[] => {
    return items.flatMap((item) =>
      item.children ? [item, ...flatten(item.children)] : [item]
    );
  };

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
    <div className="w-[25rem] bg-white rounded-[.5rem] pt-[1.3rem] px-[1.3rem]">
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

            <div className="flex flex-col space-y-[.75rem] mt-[.63rem] ml-[2.63rem]">
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
