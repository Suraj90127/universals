import React from "react";

import service from "../../assets/icon_sevice.png";

import { GoAlertFill } from "react-icons/go";
import { BsDatabaseFillAdd } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import CustomeNavbar from "../../components/CustomeNavbar";
const JackpotRule = () => {
  return (
    <>
      <CustomeNavbar name="Rule" />
      <div className="jackpot-rule-banner text-white">
        <div className="w-[70%]">
          <h3 className="heading-h3 mb-2 font-bold">Super Jackpot</h3>
          <p className="fs-sm font-medium">
            When you win the Super Jackpot in the game, you can get additional
            platform bonuses, and the bonuses will be distributed to you
            according to the multiple of the winning prize
          </p>
        </div>
        <div className="bg-[rgba(212,91,52,.5)] p-3 flex rounded-md mt-4">
          <GoAlertFill className="text-3xl mr-2" />{" "}
          <p className="fs-sm">
            Warning: Please claim all bonuses befor the event ends, after the
            event ends, you will lose the chance to get the bonus
          </p>
        </div>
      </div>

      <div className="container-section mt-5">
        <div className="flex items-center mt-2">
          <BsDatabaseFillAdd className="blue-color-300 text-2xl" />{" "}
          <span className="text-lg ms-1 font-bold text-white">Bonus</span>
        </div>

        <div className="grid grid-cols-12 bg-[#3A3947] text-white rounded-t-md p-2 mt-2">
          <div className="col-span-4 flex text-center justify-center">
            <h5 className="heading-h5">Winning rate</h5>
          </div>
          <div className="col-span-4  text-center justify-center">
            <h5 className="heading-h5">Bet amount</h5>
          </div>
          <div className="col-span-4  text-center justify-center">
            <h5 className="heading-h5">Bonus</h5>
          </div>
        </div>

        {/* rules data */}

        <div className="grid grid-cols-12 bg-body p-2 ">
          <div className="col-span-4 flex text-center justify-center">
            <span className="fs-sm pt-2 font-medium color-yellow-200">
              0.01X-10X
            </span>
          </div>
          <div className="col-span-4  text-center justify-center">
            <span className="fs-sm gray-50 font-medium">₹0.01-₹1000</span>
          </div>
          <div className="col-span-4  text-center justify-center">
            <span className="fs-sm  font-medium color-red-200">₹10.00</span>
          </div>
        </div>

        <div className="bg-body rounded-lg mt-3 flex p-2 py-4 ">
          <FaPlay className="blue-color-300 text-3xl" />
          <p className="gray-50 fs-sm ms-2">
            All event interpretation rights belong to the platform. If you have
            any qustions, please contact customer service now
          </p>
        </div>
        <div className="flex mt-3 justify-center items-center color-orange text-lg font-medium rounded-3xl blue-linear2 p-2 ">
          <img src={service} alt="iconService" className="w-8 h-8" />
          Contact customer service
        </div>
      </div>
    </>
  );
};

export default JackpotRule;
