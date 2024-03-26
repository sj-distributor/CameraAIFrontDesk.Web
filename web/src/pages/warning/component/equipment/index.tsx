import {} from "react";

export const Equipment = () => {
  return (
    <div className="w-full h-full bg-red-300 flex flex-col">
      <div className="grid grid-cols-3 gap-4 rounded-lg overflow-hidden w-full p-6 bg-white">
        {[
          "設備名稱 攝像頭001",
          "預警類型 識別人員",
          "預警內容 攝像頭001，識別人員出現超過 10 秒",
          "區域地址 廣東省中山市東區16號",
          "持續時間 1m10s",
          "開始時間 2023-08-29 19:05:12",
        ].map((item, index) => (
          <div key={index} className="bg-green-300">
            {item}
          </div>
        ))}
      </div>
      <div className="flex-1 bg-green-300">2</div>
    </div>
  );
};
