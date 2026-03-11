

import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { wingoHistory, gameHistory } from "../../store/reducer/gameReducer";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineSmallDash } from "react-icons/ai";
import { FaRegDotCircle } from "react-icons/fa";
import { MdSportsSoccer } from "react-icons/md";
import CustomeNavbar from "../../components/CustomeNavbar";

const GameStatistics = () => {
  const [activeTabs, setActiveTabs] = useState("today");

  const { wingoHistoryData, historyData, summaryData } = useSelector((state) => state.game);
  const dispatch = useDispatch();

  console.log("summaryData",summaryData);
  

  // Add gameHistory API call when tab changes
  useEffect(() => {
    dispatch(gameHistory({ filter: activeTabs }));
  }, [activeTabs, dispatch]);

  // Calculate totals from the new API response
  const calculateTotals = () => {
    if (!summaryData || !Array.isArray(summaryData)) {
      return {
        totalBet: 0,
        betCount: 0,
        winningAmount: 0
      };
    }

    return summaryData.reduce(
      (acc, game) => {
        acc.totalBet += parseFloat(game.total_bet_amount) || 0;
        acc.betCount += parseInt(game.total_bets) || 0;
        acc.winningAmount += parseFloat(game.total_win_amount) || 0;
        return acc;
      },
      { totalBet: 0, betCount: 0, winningAmount: 0 }
    );
  };

  const displayData = calculateTotals();

  const handle = () => {
    window.history.back();
  };

  // Function to render game type sections
  const renderGameTypeSections = () => {
    if (!summaryData || !Array.isArray(summaryData) || summaryData.length === 0) {
      return null;
    }

    return summaryData.map((gameType, index) => (
      <div key={index} className="bg-body rounded-md p-4 mt-3">
        <h2 className="flex items-center text-lg font-medium text-white">
          <MdSportsSoccer className="text-blue text-2xl mr-1 mb-1" />
          {gameType.game_type}
        </h2>

        <ul className="">
          <li className="flex justify-between">
            <div className="flex">
              <div className="flex flex-col items-center mt-[3px] mr-1">
                <FaRegDotCircle className="text-blue rounded-full fs-sm mr-1 border-b" />
                <AiOutlineSmallDash className="rotate-90 mt-[2px] mr-1 text-blue fs-sm" />
              </div>
              <p className="gray-50 text-sm">Total bet</p>
            </div>
            <span className="text-sm text-white">
              ₹{Number(gameType.total_bet_amount || 0).toFixed(2)}
            </span>
          </li>
          <li className="flex justify-between">
            <div className="flex">
              <div className="flex flex-col items-center mt-[3px] mr-1">
                <FaRegDotCircle className="text-blue rounded-full fs-sm mr-1 border-b" />
                <AiOutlineSmallDash className="rotate-90 mt-[2px] mr-1 text-blue fs-sm" />
              </div>
              <p className="gray-50 text-sm">Number of bets</p>
            </div>
            <span className="text-sm gray-50">
              {gameType.total_bets || 0}
            </span>
          </li>
          <li className="flex justify-between">
            <div className="flex">
              <div className="flex flex-col items-center mt-[3px] mr-1">
                <FaRegDotCircle className="text-blue rounded-full fs-sm mr-1 border-b" />
              </div>
              <p className="gray-50 text-sm">Winning amount</p>
            </div>
            <span className="text-sm color-l">
              ₹{Number(gameType.total_win_amount || 0).toFixed(2)}
            </span>
          </li>
        </ul>
      </div>
    ));
  };

  return (
    <>
      <CustomeNavbar name="Game statistics" />

      <div className="container-section mt-5">
        <div className="flex items-center justify-between">
          <button
            className={`${
              activeTabs == "today"
                ? "blue-linear font-bold color-orange"
                : " gray-50 bg-body"
            }  rounded-full p w-[24%] text-sm  p-1 flex items-center justify-center `}
            onClick={() => setActiveTabs("today")}
          >
            Today
          </button>
          <button
            className={`${
              activeTabs == "yesterday"
                ? "blue-linear font-bold color-orange"
                : "bg-body gray-50"
            }  rounded-full p w-[24%] text-sm  p-1  flex items-center justify-center`}
            onClick={() => setActiveTabs("yesterday")}
          >
            Yesterday
          </button>
          <button
            className={`${
              activeTabs == "this_week"
                ? "blue-linear font-bold color-orange"
                : "bg-body gray-50"
            }  rounded-full p w-[24%] text-sm  p-1  flex items-center justify-center`}
            onClick={() => setActiveTabs("this_week")}
          >
            This week
          </button>
          <button
            className={`${
              activeTabs == "this_month"
                ? "blue-linear font-bold color-orange"
                : "bg-body gray-50"
            }  rounded-full p w-[24%] text-sm  p-1  flex items-center justify-center`}
            onClick={() => setActiveTabs("this_month")}
          >
            This month
          </button>
        </div>

        {/* Main Statistics Card */}
        <div className="bg-body rounded-md mt-3 flex justify-center items-center flex-col h-40">
          <h3 className="heading-h3 text-lg font-bold color-yellow-200">
            ₹{displayData.totalBet.toFixed(2)}
          </h3>
          <p className="text-base text-white">Total bet</p>
        </div>

        {/* Game Type Sections */}
        {displayData.betCount > 0 && renderGameTypeSections()}

        {/* Show message when no data available */}
        {displayData.betCount === 0 && (
          <div className="bg-body rounded-md p-4 mt-3 text-center">
            <p className="gray-50 text-sm">No game data available for {activeTabs}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default GameStatistics;