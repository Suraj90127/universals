import { useState, useRef, useEffect } from "react";

// Black Icons
import blackIcon1 from "../../../assets/NewImg/slotsicons/black/JILI ICON.png";
import blackIcon2 from "../../../assets/NewImg/slotsicons/black/CQ9.png";
import blackIcon3 from "../../../assets/NewImg/slotsicons/black/JDB ICON.png";
import blackIcon4 from "../../../assets/NewImg/slotsicons/black/mg fish icon.png";
import blackIcon5 from "../../../assets/NewImg/slotsicons/black/evo_electronic icon.png";
import blackIcon6 from "../../../assets/NewImg/slotsicons/black/G9 ICON.png";
import blackIcon7 from "../../../assets/NewImg/slotsicons/black/PG.png";
import PopularIcon from "../../../assets/bdgimg/popularicon.png";
import LotteryIcon from "../../../assets/bdgimg/lotteryicon.png";
import SlotsIcon from "../../../assets/bdgimg/slotsicon.png";
import SportsIcon from "../../../assets/bdgimg/sportsicon.png";
import CasinoIcon from "../../../assets/bdgimg/casinoicon.png";
import RummyIcon from "../../../assets/bdgimg/rummyicon.png";
import FishingIcon from "../../../assets/bdgimg/chickenpng.png";
import OriginalIcon from "../../../assets/bdgimg/originalicon.png";
import { rechargeList2 } from "../../../store/reducer/userReducer";

// White Icons
import whiteIcon1 from "../../../assets/NewImg/slotsicons/white/JILI ICON WHITE.png";
import whiteIcon2 from "../../../assets/NewImg/slotsicons/white/CQ9 WHITE.png";
import whiteIcon3 from "../../../assets/NewImg/slotsicons/white/JDB ICON WHITE.png";
import whiteIcon4 from "../../../assets/NewImg/slotsicons/white/mg video WHITE.png";
import whiteIcon5 from "../../../assets/NewImg/slotsicons/white/EVO ELECTRONIC WHITE ICON.png";
import whiteIcon6 from "../../../assets/NewImg/slotsicons/white/G9 WHITE ICON.png";
import whiteIcon7 from "../../../assets/NewImg/slotsicons/white/pg white icon.png";

import PVCSection from "./PVCSection";

import SportsComponent from "./SportsComponent";
import CasinoSection from "../newgame/CasinoSection";

import { useDispatch } from "react-redux";
import { notification } from "../../../store/reducer/activityReducer";

import LotterSection from "../newgame/LotterSection";
import JilliGame from "../newgame/JilliGame";
import Cq9Game from "../newgame/Cq9Game";
import JDBGame from "../newgame/JDBGame";
import MGGame from "../newgame/MGGame";
import EVOGame from "../newgame/EVOGame";
import G9Game from "../newgame/G9Game";
import PGGame from "../newgame/PGGame";
import MGfishGame from "../newgame/MGfishGame";
import OriginalGame from "../newgame/OriginalGame";
import FishingGame from "../newgame/FishingGame";
import CasinoLiveGame from "../newgame/CasinoLiveGame";
import SuperJackportGame from "../newgame/SuperJackportGame";
import { useNavigate } from "react-router-dom";
import Rummy from "../newgame/Rummy";
import Popular from "../newgame/Popular";
import Slots from "../newgame/Spots";
import RecommendSlider from "../newgame/RecommendSlider";
import ChikenRoad from "./ChikenRoad";

const jackpot = "https://i.ibb.co/cSfQ63hD/gamecategory-20240722092600jsn4.png";
const lottery = "https://i.ibb.co/qF5pybkQ/gamecategory-20240722092542sh85.png";
const slot = "https://i.ibb.co/t02yBnw/gamecategory-20240722092552pj7d.png";
const original =
  "https://i.ibb.co/FL5Cgn80/gamecategory-20240722092452swfv.png";
const fishing = "https://i.ibb.co/ycwGgRFG/gamecategory-20240722092502uryl.png";
const sports = "https://i.ibb.co/sJ2RLb6q/gamecategory-20240722092533461f.png";
const pvc = "https://i.ibb.co/4wnPM29p/gamecategory-20240722092510alv1.png";
const casino = "https://i.ibb.co/pDq8CR8/gamecategory-20240722092524eyc6.png";

const slotCategories = [
  { name: "Popular", icon: PopularIcon, layout: "absolute", id: "popular" },
  { name: "Lottery", icon: LotteryIcon, layout: "absolute", id: "lottery" },
  { name: "Slots", icon: SlotsIcon, layout: "absolute", id: "slots" },
  { name: "Sports", icon: SportsIcon, layout: "center", id: "sports" },
  { name: "Casino", icon: CasinoIcon, layout: "center", id: "casino" },
  { name: "Rummy", icon: RummyIcon, layout: "center", id: "pvc" },
  { name: "Chiken Road", icon: FishingIcon, layout: "side", id: "fishing" },
  { name: "Orignal", icon: OriginalIcon, layout: "side", id: "orignal" },
];

const slotCategories2 = [
  { name: "JILI", blackIcon: blackIcon1, whiteIcon: whiteIcon1, id: "jili" },
  { name: "CQ9", blackIcon: blackIcon2, whiteIcon: whiteIcon2, id: "cq9" },
  { name: "JDB", blackIcon: blackIcon3, whiteIcon: whiteIcon3, id: "jdb" },
  // { name: "MG", blackIcon: blackIcon4, whiteIcon: whiteIcon4, id: "mg" },
  {
    name: "EVO_Electronic",
    blackIcon: blackIcon5,
    whiteIcon: whiteIcon5,
    id: "evo_ele",
  },
  // { name: "G9", blackIcon: blackIcon6, whiteIcon: whiteIcon6, id: "g9" },
  // { name: "PG", blackIcon: blackIcon7, whiteIcon: whiteIcon7, id: "pg" },
  // {
  //   name: "MG_Fish",
  //   blackIcon: blackIcon8,
  //   whiteIcon: whiteIcon8,
  //   id: "mg_fish",
  // },
];

const SlotComponents = () => {
  const dispatch = useDispatch();

  const [activeCategory, setActiveCategory] = useState("jili");
  const [alertsuccess, setAlertsuccess] = useState(false);

  const categoryRef = useRef();
  const contentRef = useRef(null);

  const [repopup, setRepopup] = useState(false);
  const navigate = useNavigate();

  const data = localStorage.getItem("topup");
  const data22 = localStorage.getItem("topup22");
  const [tabs, setTabs] = useState("lottery");

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };
  const categoryChunks = [
    slotCategories.slice(0, 3), // row 1
    slotCategories.slice(3, 6), // row 2
    slotCategories.slice(6, 8), // row 3
  ];

  const handleTabClick = (id) => {
    setTabs(id); 
    // scroll forcefully trigger karo
    const section = document.getElementById(id);
    if (section) {
      const yOffset = -80; // header ka height adjust karne ke liye
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    dispatch(notification());
  }, []);

  const handleWingo = (path) => {
    dispatch(rechargeList2()).then((res) => {
      if (res.payload.data2?.length === 0) {
        setRepopup(true);
      } else {
        navigate(path);
      }
    });
  };
  useEffect(() => {
    const section = document.getElementById(tabs);
    if (section) {
      const yOffset = -80;
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [tabs]);

  const handleCloseRecharge = () => {
    navigate("/wallet/Recharge");
    setRepopup(false);
  };

  return (
    <div className="container-section mt-5 relative">
      <div className="bg-white">
        <div className={`place-bet-popup z-40 ${alertsuccess ? "active" : ""}`}>
          <div className="text-lg">
            {"Need first recharge to Play the Game"}
          </div>
        </div>
      </div>

      {/* lottery tabs  */}
      <div className="mt-5">
        {categoryChunks.map((chunk, rowIndex) => {
          const isMiddleRow = rowIndex === 1;

          const containerHeight =
            rowIndex === 0 ? "h-28" : rowIndex === 1 ? "h-24" : "h-16";

          const textSize =
            rowIndex === 0
              ? "text-base"
              : rowIndex === 1
              ? "text-sm"
              : "text-sm";

          const imageSize =
            rowIndex === 0
              ? "h-20 w-auto"
              : rowIndex === 1
              ? "h-16 w-auto"
              : "h-12 w-auto";

          return (
            <div
              key={rowIndex}
              className={`grid grid-cols-12 ${
                isMiddleRow
                  ? "gap-4 rounded-lg py-1 mt-3 divide-x divide-gray-300 bg-cover bg-center bg-no-repeat relative"
                  : "gap-2 mt-3"
              }`}
              style={
                isMiddleRow
                  ? {
                      backgroundImage:
                        "url('https://i.ibb.co/SXvNgYSY/third-bg-e90cc231.webp')",
                    }
                  : {}
              }
            >
              {chunk.map((category) => {
                const colSpan =
                  chunk.length === 2 ? "col-span-6" : "col-span-4";
                const backgroundClass = !isMiddleRow ? "bg-home-lg" : "";

                return (
                  <div
                    key={category.name}
                    className={`${colSpan} relative ${backgroundClass} ${containerHeight} rounded-lg ${
                      category.layout === "center" || category.layout === "side"
                        ? "flex"
                        : ""
                    } ${
                      category.layout === "center"
                        ? "justify-center items-center flex-col"
                        : ""
                    } ${category.layout === "side" ? "py-1 items-center" : ""}`}
                    onClick={() => handleTabClick(category.id)}
                  >
                    {category.layout === "absolute" && (
                      <>
                        <img
                          src={category.icon}
                          alt={category.name}
                          className={`absolute ${
                            category.name === "Orignal"
                              ? "top-[-10px] left-4 w-24"
                              : `left-2 top-[-10px] ${imageSize}`
                          }`}
                        />
                        <p
                          className={`${textSize} font-bold absolute left-2 bottom-2 text-[#292929]`}
                        >
                          {category.name}
                        </p>
                      </>
                    )}

                    {category.layout === "center" && (
                      <>
                        <img
                          src={category.icon}
                          alt={category.name}
                          className={imageSize}
                        />
                        <p className={`${textSize} font-bold text-black`}>
                          {category.name}
                        </p>
                      </>
                    )}

                    {category.layout === "side" && (
                      <>
                        <img
                          src={category.icon}
                          alt={category.name}
                          className={`${imageSize} ml-3`}
                        />
                        <p
                          className={`${textSize} font-bold absolute right-5 bottom-6 transform translate-y-1/2 text-black`}
                        >
                          {category.name}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div>
        {/* lottery Section*/}
        {tabs === "lottery" && (
          <div id="lottery" className="lottery-game-section mt-3">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="border-after mt-2 text-whites text-lg border-l-4 border-[#d9ac4f] pl-1">
                  Lottery
                </h1>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex flex-col gap-2 ">
                {gameData.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => handleWingo(game.link)}
                    className="lotterySlotItem  bg-home-lg rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="pl-4 pr-1 py-2 flex flex-row items-start justify-between">
                      <div className="flex flex-col items-start">
                        <span className="block text-[#292929] font-bold text-lg mt-1">
                          {game.name}
                        </span>
                        <h4 className="mt-1">
                          <div className="text-[#292929] text-xs font-semibold">
                            {game.description1}
                          </div>
                          <div className="text-[#292929] text-xs font-semibold">
                            {game.description2}
                          </div>
                        </h4>
                      </div>
                      <img
                        src={game.image}
                        alt={game.name}
                        className={`w-[90px] rounded ${
                          game.id >= 1 && game.id <= 5 ? "h-[80px]" : ""
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/*  */}
        {tabs === "slots" && (
          // <div className="" id="slots">
          //   <h1 className="border-after mt-2 text-whites font-[500] text-base">
          //     Slot
          //   </h1>
          //   <p className="text-whites text-[11px] mt-1">
          //     Online real-time game dealers, all verified fair games
          //   </p>

          //   <div className="relative overflow-x-auto scrollbar-hide rounded bg-light">
          //     <div ref={categoryRef} className="flex border-none">
          //       {slotCategories2.map((category, index) => (
          //         <div
          //           key={index}
          //           data-id={category.id}
          //           onClick={() => handleCategoryClick(category.id)}
          //           className={`flex flex-col items-center whitespace-nowrap py-2 px-1 rounded ${
          //             activeCategory === category.id
          //               ? "blue-linear2 text-white shadow-lg"
          //               : "bg-[#fff] text-[#606877] border-gray-300"
          //           }`}
          //         >
          //           <div className="w-20 flex flex-col justify-center items-center">
          //             <img
          //               src={
          //                 activeCategory === category.id
          //                   ? category.whiteIcon
          //                   : category.blackIcon
          //               }
          //               alt={category.name}
          //               className="h-[15px] w-auto object-contain"
          //             />
          //           </div>
          //           <span>{category.name}</span>
          //         </div>
          //       ))}
          //     </div>
          //   </div>
          //   <div className=" overflow-hidden">
          //     <div ref={contentRef} className="transition-all duration-300">
          //       {activeCategory === "jili" && (
          //         <div>
          //           <JilliGame />
          //         </div>
          //       )}
          //       {activeCategory === "cq9" && <Cq9Game />}
          //       {activeCategory === "jdb" && <JDBGame />}
          //       {activeCategory === "mg" && <MGGame />}
          //       {activeCategory === "evo_ele" && <EVOGame />}
          //       {activeCategory === "g9" && <G9Game />}
          //       {activeCategory === "pg" && <PGGame />}
          //       {activeCategory === "mg_fish" && <MGfishGame />}
          //     </div>
          //   </div>
          // </div>
          <div id="slots">
            <div className="flex justify-between items-center"></div>
            <Slots />
          </div>
        )}
        {/*  */}
        {/* <div className=" overflow-hidden">
          <div ref={contentRef} className="transition-all duration-300">
            {activeCategory === "jili" && (
              <div>
                <JilliGame />
              </div>
            )}
            {activeCategory === "cq9" && <Cq9Game />}
            {activeCategory === "jdb" && <JDBGame />}
            {activeCategory === "mg" && <MGGame />}
            {activeCategory === "evo_ele" && <EVOGame />}
            {activeCategory === "g9" && <G9Game />}
            {activeCategory === "pg" && <PGGame />}
            {activeCategory === "mg_fish" && <MGfishGame />}
          </div>
        </div> */}
        {tabs === "popular" && (
          <div id="popular" className="mt-2">
            <div className="flex justify-between items-center"></div>
            {/* <CasinoSection /> */}
            {/* <RecommendSlider /> */}
            <Popular />
          </div>
        )}

        {tabs === "casino" && (
          <div id="casino" className="mt-2">
            <div className="flex justify-between items-center"></div>
            <CasinoLiveGame />
          </div>
        )}

        {tabs === "orignal" && (
          <div id="orignal" className="lottery-game-section">
            <OriginalGame />
          </div>
        )}
        {tabs === "fishing" && (
          <div id="fishing" className="lottery-game-section">
            {/* <FishingGame /> */}
            <ChikenRoad />
          </div>
        )}
        {tabs === "sports" && (
          <div>
            <SportsComponent />
          </div>
        )}
        {tabs === "pvc" && (
          <div>
            {/* <PVCSection /> */}
            <Rummy />
          </div>
        )}

        {/* orignal */}

        {/* <div id="orignal" className="mt-4">
          <div className="flex justify-between items-center"></div>
          <OriginalGame />
        </div> */}
        {/* fishing */}

        {/* <div id="fishing" className="mt-2">
          <div className="flex justify-between items-center"></div>
          <FishingGame />
        </div> */}
        {/* casino */}

        {/* sports & pvc */}

        {/* <div id="sports" className="mt-2">
          <div className="flex justify-between items-center"></div>
          <SportsComponent />
        </div>
        <div id="pvc" className="mt-2">
          <div className="flex justify-between items-center"></div>
          <PVCSection />
        </div> */}
        {/* jackpot */}
        {/* <div id="jackpot" className="mt-2">
          <div className="flex justify-between items-center"></div>
          <SuperJackportGame />
        </div> */}
      </div>
      <div
        className={repopup ? "overlay-section block z-[50]" : "hidden"}
      ></div>
      {repopup && (
        <div className="fixed top-0 z-[60] bottom-0 pb-2 h-32 m-auto flex flex-col justify-center items-center left-0 right-0 w-[20rem] bg-light rounded-lg">
          <h3 className="heading-h3 gray-50 mt-5">Tips</h3>
          <p className="text-sm gray-50 mt-2">
            First need to recharge for this game
          </p>

          <div className="w-full mt-5">
            <button
              className=" text-white sheet_nav_bg p-2 w-[50%]  rounded-bl-lg "
              onClick={() => setRepopup(false)}
            >
              Cancel
            </button>
            <button
              className="p-2 text-white blue-linear rounded-br-lg  w-[50%]"
              onClick={handleCloseRecharge}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotComponents;
const gameData = [
  {
    id: 1,
    name: "Win Go",
    image: "https://i.ibb.co/1YpMws1w/lotterycategory-wingo.png",
    description1: "Guess Number",
    description2: "Green/Red/Violet to win",
    link: "/wingo?Game=10",
  },
  {
    id: 2,
    name: "K3",
    image: "https://i.ibb.co/8DM9C571/lotterycategory-k3.png",
    description1: "Guess Number",
    description2: "Big/Small/Odd/Even",
    link: "/k3",
  },
  {
    id: 3,
    name: "5D",
    image: "https://i.ibb.co/rLDKjgV/lotterycategory-5d.png",
    description1: "Guess Number",
    description2: "Big/Small/Odd/Even",
    link: "/5d",
  },
  {
    id: 4,
    name: "Trx Win Go",
    image: "https://i.ibb.co/MDHJpJL6/trx-ec.png",
    description1: "Guess Number",
    description2: "Green/Red/Violet to win",
    link: "/trx",
  },
];
