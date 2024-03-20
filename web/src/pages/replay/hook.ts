import { useEffect, useRef, useState } from "react";

import { StatusType } from "@/entity/enum";
import { useAuth } from "@/hooks/use-auth";

export const useAction = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  const { location } = useAuth();

  const [status, setStatus] = useState<StatusType | null>(null);

  const [data, setData] = useState<string[]>([]);

  const updateData = (value: string[]) => {
    setData(value);
  };

  const updateStatus = (value: any) => {
    setStatus(value as StatusType);
  };

  const getHeight = () => {
    if (headerRef.current) {
      console.log(headerRef.current.clientHeight);
    }
  };

  useEffect(() => {
    getHeight();

    window.addEventListener("resize", getHeight);

    return () => {
      window.removeEventListener("resize", getHeight);
    };
  }, []);

  return {
    headerRef,
    data,
    updateData,
    status,
    updateStatus,
    location,
  };
};
