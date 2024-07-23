import { Outlet } from "react-router-dom";

import { BreadcrumbComponent } from "@/components/breadcrumb";

export const Monitor = () => {
  return (
    <div className="w-full h-full box-border px-5 pt-5 pb-5">
      <div className="w-full h-full flex flex-col space-y-2">
        <BreadcrumbComponent />

        <div className="h-[calc(100%-3.25rem)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
