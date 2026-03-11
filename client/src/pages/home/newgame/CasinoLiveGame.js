// import React, { useState } from "react";
// import { BiCategory } from "react-icons/bi";
// // import JilliPopup from "../../../components/JilliPopup";
// import { Link } from "react-router-dom";

// const casinoData = [
//   {
//     img: "https://i.ibb.co/Rp83pqx7/casino1.png",
//     name: "PA Casino",
//     id: "8405541014f364b7dc59657aa6892446",
//     iconId: "icon-AG",
//   },
//   {
//     img: "https://i.ibb.co/hxFwCQqT/casino2.png",
//     name: "WM Casino",
//     id: "724eebd5cbe7555b01ed60279cb59e5a",
//     iconId: "icon-WM",
//   },
//   {
//     img: "https://i.ibb.co/vvjbMy6J/casino3.png",
//     name: "Sexy Casino",
//     id: "9b25f8d744859c6840d16ff6103dc5a6",
//     iconId: "icon-SEXY",
//   },
//   {
//     img: "https://i.ibb.co/4hQ8kND/casino4.png",
//     name: "EVO Casino",
//     id: "624db9f6b362baf19796f281dfdee1ab",
//     iconId: "icon-EVO",
//   },
//   // {
//   //   img: "https://i.ibb.co/F4wKdzGH/1-16.png",
//   //   name: "SA Casino",
//   //   id: "1fd20a344c9f147cdef85bbaa7447dcd",
//   // },
// ];

// const CasinoLiveGame = () => {
//   // const [gameId, setGameId] = useState();
//   const [showComingSoon, setShowComingSoon] = useState(false);

//   // const handleJilliOpen = (data) => {
//   //   setGameId(data);
//   // };

//   const handleComingSoon = () => {
//     setShowComingSoon(true);
//   };

//   return (
//     <>
//       {/* {gameId && <JilliPopup gameId={gameId} />} */}

//       {/* Coming Soon Popup */}
//       {showComingSoon && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
//           <div className="bg-white rounded-lg p-6 text-center w-80">
//             <h2 className="text-xl font-bold mb-3">Coming Soon</h2>
//             <p className="text-gray-600 mb-5">
//               This game will be available soon.
//             </p>
//             <button
//               onClick={() => setShowComingSoon(false)}
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="lottery-game-section">
//         {/* Header Section */}
//         <div className="flex justify-between items-center">
//           <h1 className="border-after mt-2 text-whites font-bold text-lg border-l-4 border-[#c4933f] pl-1">
//             Casino
//           </h1>
//         </div>

//         {/* Game Grid */}
//         <div className="slider-container mt-3">
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
//             {casinoData.map((game, index) => (
//               <div
//                 key={index}
//                 className="rounded-2xl overflow-hidden bg-home-lg relative cursor-pointer p-4"
//                 // onClick={() => handleJilliOpen(game.id)}
//                 onClick={handleComingSoon}
//               >
//                 <div className="flex flex-col items-start z-10 relative ml-2">
//                   {/* ✅ SVG  */}
//                   <svg className="w-14 h-8 fill-current text-black">
//                     <use href={`#${game.iconId}`}></use>
//                   </svg>

//                   {/* ✅ text */}
//                   <h2 className="text-black font-bold text-base ">| Casino</h2>
//                   <p className="text-black text-sm">{game.name}</p>
//                 </div>

//                 {/* ✅ Right image */}
//                 <img
//                   src={game.img}
//                   alt={game.name}
//                   className="absolute right-0 bottom-0 h-[100px] object-contain z-0"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CasinoLiveGame;





import React, { useState } from "react";
import { BiCategory } from "react-icons/bi";
import { Link } from "react-router-dom";
import JilliPopup from "../../../components/JilliPopup"; // ✅ Active import

const casinoData = [
  {
    img: "https://i.ibb.co/vvjbMy6J/casino3.png",
    name: "Sexy Casino",
    id: "5956fee9c7e1524f0e6310e75a368c81",
    iconId: "icon-SEXY",
  },
  {
    img: "https://i.ibb.co/4hQ8kND/casino4.png",
    name: "EVO Casino",
    id: "8ef39602e589bf9f32fc351b1cbb338b",
    iconId: "icon-EVO",
  },
  {
    img: "https://i.ibb.co/Rp83pqx7/casino1.png",
    name: "PA Casino",
    id: "38d36d194ec3b610e49904bf06bbaa68",
    iconId: "icon-AG",
  },
  {
    img: "https://i.ibb.co/hxFwCQqT/casino2.png",
    name: "WM Casino",
    id: "724eebd5cbe7555b01ed60279cb59e5a",
    iconId: "icon-WM",
  },
];

const CasinoLiveGame = () => {
  const [jilliPopup, setJilliPopup] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  // ✅ Open popup (fixed so same game can reopen)
  const handleJilliOpen = (data) => {
    setJilliPopup(false); // close old popup if open
    setGameId(null); // reset previous ID

    setTimeout(() => {
      setGameId(data);
      setJilliPopup(true);
    }, 50); // small delay ensures re-render
  };

  // ⚠️ Coming soon popup
  const handleComingSoon = () => {
    setShowComingSoon(true);
  };

  return (
    <>
      {/* ✅ Jilli Popup */}
      {gameId && jilliPopup && <JilliPopup gameId={gameId} />}

      {/* ⚠️ Coming Soon Popup */}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg p-6 text-center w-80">
            <h2 className="text-xl font-bold mb-3">Coming Soon</h2>
            <p className="text-gray-600 mb-5">
              This game will be available soon.
            </p>
            <button
              onClick={() => setShowComingSoon(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* 🎰 Casino Section */}
      <div className="lottery-game-section">
        <div className="flex justify-between items-center mt-2">
          <h1 className="border-after text-whites font-bold text-lg border-l-4 border-[#c4933f] pl-1">
            Casino
          </h1>
        </div>

        {/* Game Grid */}
        <div className="slider-container mt-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
            {casinoData.map((game, index) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden bg-home-lg relative cursor-pointer p-4"
                onClick={() =>
                  index < 3
                    ? handleJilliOpen(game.id) // ✅ top 2 open Jilli
                    : handleComingSoon() // ⚠️ bottom 2 show Coming Soon
                }
              >
                <div className="flex flex-col items-start z-10 relative ml-2">
                  <svg className="w-14 h-8 fill-current text-black">
                    <use href={`#${game.iconId}`}></use>
                  </svg>
                  <h2 className="text-black font-bold text-base">| Casino</h2>
                  <p className="text-black text-sm">{game.name}</p>
                </div>
                <img
                  src={game.img}
                  alt={game.name}
                  className="absolute right-0 bottom-0 h-[100px] object-contain z-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CasinoLiveGame;
