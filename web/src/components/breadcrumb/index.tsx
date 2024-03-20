import Breadcrumb from "antd/es/breadcrumb";

import { useAction } from "./hook";

export const BreadcrumbComponent = () => {
  const { items, navigate } = useAction();

  function itemRender(item: any, _: any, items: any) {
    const last = items.indexOf(item) === items.length - 1;

    return (
      <div
        className={`text-xl ${!last && "hover:cursor-pointer"}`}
        onClick={() => {
          !last && navigate(item.path);
        }}
      >
        {item.title}
      </div>
    );
  }

  return (
    <Breadcrumb itemRender={itemRender} items={items} className="select-none" />
  );
};
