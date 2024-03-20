import { useEffect, useState } from "react";

import { GetTypeList } from "@/services/api/default";
import { IMonitorType } from "@/services/dtos/default";

export const useTypeList = () => {
  const [typeList, setTypeList] = useState<IMonitorType[]>([]);

  const [isShouldLoad, setIsShouldLoad] = useState<boolean>(false);

  const loadMonitoTyperList = (callBack?: () => void) => {
    GetTypeList()
      .then((res) => {
        setTypeList(res ?? []);
      })
      .catch(() => {
        setTypeList([]);
      })
      .finally(() => {
        callBack && callBack();
      });
  };

  const againLoad = () => {
    setIsShouldLoad(true);
  };

  useEffect(() => {
    loadMonitoTyperList();
  }, []);

  useEffect(() => {
    if (isShouldLoad) {
      loadMonitoTyperList(() => {
        setIsShouldLoad(false);
      });
    }
  }, [isShouldLoad]);

  return { typeList, againLoad };
};
