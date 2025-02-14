import { ICameraAiMonitorType } from "@/dtos/default";
import { IItemProps, IWarningListProps, IWarningType } from "./props";
import { useState } from "react";
import { clone } from "ramda";

import KEYS from "@/i18n/keys/alert-list";
import { useAuth } from "@/hooks/use-auth";

export const useAction = () => {
  const { t } = useAuth();

  const warningList: IWarningListProps[] = [
    {
      label: t(KEYS.PEOPLE_TYPE, { ns: "alertList" }),
      value: IWarningType.People,
      children: [
        {
          label: t(KEYS.PEOPLE, { ns: "alertList" }),
          value: ICameraAiMonitorType.People,
          defaultCheck: true,
        },
        {
          label: t(KEYS.SMOKE, { ns: "alertList" }),
          value: ICameraAiMonitorType.Smoke,
        },
        {
          label: t(KEYS.FIGHT, { ns: "alertList" }),
          value: ICameraAiMonitorType.Fight,
        },
        {
          label: t(KEYS.COSTUME, { ns: "alertList" }),
          value: ICameraAiMonitorType.Costume,
          children: [
            {
              label: t(KEYS.FlUORESCENTCLOTHING, { ns: "alertList" }),
              value: ICameraAiMonitorType.FluorescentClothing,
            },
            {
              label: t(KEYS.GLOVES, { ns: "alertList" }),
              value: ICameraAiMonitorType.Gloves,
            },
            {
              label: t(KEYS.SAFETYSHOES, { ns: "alertList" }),
              value: ICameraAiMonitorType.SafetyShoes,
            },
          ],
        },
        {
          label: "觸摸二層貨物規範檢測",
          value: ICameraAiMonitorType.TouchGoods,
        },
      ],
    },
    {
      label: t(KEYS.VEHICLES_TYPE, { ns: "alertList" }),
      value: IWarningType.Vehicles,
      children: [
        {
          label: t(KEYS.VEHICLES, { ns: "alertList" }),
          value: ICameraAiMonitorType.Vehicles,
          defaultCheck: true,
        },
        {
          label: t(KEYS.ABNORMALVEHICLES, { ns: "alertList" }),
          value: ICameraAiMonitorType.AbnormalVehicles,
        },
        {
          label: "叉車熒光帶匹配檢測",
          value: ICameraAiMonitorType.Forklift,
        },
      ],
    },
    {
      label: t(KEYS.ELEMENT_TYPE, { ns: "alertList" }),
      value: IWarningType.Element,
      children: [
        {
          label: t(KEYS.ANIMAL, { ns: "alertList" }),
          value: ICameraAiMonitorType.Animal,
          children: [
            {
              label: t(KEYS.CAT, { ns: "alertList" }),
              value: ICameraAiMonitorType.Cat,
            },
            {
              label: t(KEYS.DOG, { ns: "alertList" }),
              value: ICameraAiMonitorType.Dog,
            },
            {
              label: t(KEYS.BIRD, { ns: "alertList" }),
              value: ICameraAiMonitorType.Bird,
            },
          ],
        },
      ],
    },
  ];

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
