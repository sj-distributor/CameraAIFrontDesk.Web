import { ICameraAiMonitorType } from "@/dtos/default";
import { IItemProps, IWarningListProps, IWarningType } from "./props";
import { useState } from "react";
import { clone } from "ramda";

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

export const useAction = () => {
  const [selectValues, setSelectValues] = useState<ICameraAiMonitorType[]>([]);

  const [checkIndex, setCheckIndex] = useState<IWarningType[]>([]);

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

  return {
    warningList,
    selectValues,
    checkIndex,
    setSelectValues,
    setCheckIndex,
    handleSelect,
    flatten,
  };
};
