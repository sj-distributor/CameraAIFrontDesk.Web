export const Box = () => {
  return (
    <div className="w-screen h-screen">
      <div className=" relative w-full h-4/5 border">
        <video className="w-full h-full object-cover">
          <source src="/src/assets/meeting_01.mp4" />
        </video>
      </div>
      <div className="h-1/5 w-full">
        <div className=" relative overflow-x-auto">
          <div>1</div>
          <div className="w-20 h-20 bg-red-300 absolute -top-10">556</div>
        </div>
      </div>
    </div>
  );
};
