import React, { useEffect } from "react";
import { useSelector } from "react-redux";
const img1 = "https://i.ibb.co/k6WGVRwP/Whats-App-Image-2026-03-09-at-3-56-06-AM.jpg";

const MainLoader = () => {
  const { bannergetData } = useSelector((state) => state.user);

  return (
    <div className="bg-[--bg-nav] fixed z-[999] w-full md:w-[25.7rem] top-0 bottom-0 flex flex-col gap-5 items-center justify-center h-screen overflow-hidden p-0">
      <div className="w-[80%]">
        <img
          src={img1}
          className="w-[100%] h-auto relative"
          alt=""
          loading="lazy"
        />
      </div>
      <h2 className=" font-bold arial text-[18px] text-[#eec103] pl-8">
        Withdraw fast, safe and stable
      </h2>
      <img
        src={bannergetData?.gameall?.logo1}
        className="w-[200px] h-auto mt-[50px] ml-4"
        alt="logo"
        loading="lazy"
      />
    </div>
  );
};

export default MainLoader;
