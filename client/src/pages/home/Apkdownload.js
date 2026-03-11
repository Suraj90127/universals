import React, { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

import { useSelector } from "react-redux";

const Apkdownload = () => {
  const [isOpen, setIsOpen] = useState(true); // Renamed 'close' to 'isOpen' for clarity
  const {bannergetData}=useSelector((state)=>state.user)

  const handleClose = () => {
    setIsOpen(false); // Close the popup when 'X' is clicked
  };

  return (
    <>
      {isOpen && (
        <div className="z-50 fixed bottom-20 left-1/2 transform -translate-x-1/2">
          <div className=" px-[10px] flex blue-linear2 justify-around w-[182px] py-1 rounded-3xl shadow-lg cursor-pointer h-full items-center text-center">
            <div className="mt-1">
              <img className="w-8 h-6" src={bannergetData?.gameall?.favicon} alt="" />
            </div>
            <a href="/app.apk" download>
              <p className="text-sm font-bold text-[#8F5206]">Add Desktop</p>
            </a>
         
            <div
              className="cursor-pointer border-l border-[var(--oranges)] text-white text-right text-2xl font-bold mt-[2px]"
              onClick={handleClose}
            >
              <IoCloseCircleOutline />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Apkdownload;