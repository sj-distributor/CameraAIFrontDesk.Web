import { useAuth } from "@/hooks/use-auth";

export const ReplayList = () => {
  const { navigate } = useAuth();

  return (
    <div className="grid auto-grid1 md:auto-grid gap-8">
      {[
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      ].map((item, index) => (
        <div
          className="overflow-hidden flex flex-col"
          key={index}
          onClick={() => navigate(`/replay/1111`)}
        >
          <div className="rounded-xl overflow-hidden w-full flex-1 relative hover:cursor-pointer aspect-[4/2.25]">
            <div className="absolute py-1 px-3 border border-solid rounded-lg top-7 left-6 select-none border-[#E9EDF2] bg-[#F4F5FC] text-[#18283C]">
              13:15
            </div>
            <img
              src={"/src/assets/star.jpeg"}
              alt=""
              className="w-full h-full object-cover img-no-darg"
            />
          </div>
          <div className="w-full select-none">
            <div className="truncate text-lg">設備名稱</div>
            <div className="flex flex-row space-x-1 items-center">
              <div className="w-9">
                <div className="w-4 h-4 bg-[#2866F1] rounded-full hidden" />
                <div className="w-4 h-4 bg-[#04B6B5] rounded-full" />
              </div>

              <span>2023-08-29 17:36:41</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
