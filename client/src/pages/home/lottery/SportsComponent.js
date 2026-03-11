import React, { useState } from "react";
import JilliPopup from "../../../components/JilliPopup";

const SportsComponent = () => {
  const [gameId, setGameId] = useState();
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleJilliOpen = (data) => {
    setGameId(data);
  };

  const handleComingSoon = () => {
    setShowComingSoon(true);
    // setTimeout(() => setShowComingSoon(false), 2000);
  };

  const sportsData = [
    {
      id: 1,
      name: "Baseball",
      image: "https://i.ibb.co/qY3gD1hL/vendorlogo-20240411190844d133.png",
      iconId: "icon-Wickets9",
    },
    {
      id: 2,
      name: "Basketball",
      image: "https://i.ibb.co/Q7cJzG5F/vendorlogo-20240411191851up8s.png",
      iconId: "icon-SaBa",
    },
  ];

  return (
    <div className="container mx-auto py-3">
      {gameId && <JilliPopup gameId={gameId} />}

      {/* Coming Soon Popup */}
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

      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="border-after pl-1 mt-2 text-blue font-bold text-lg border-l-4 border-[#c4933f]">
              Sports
            </h2>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sportsData?.map((sport, index) => (
          <div
            key={index}
            className="relative rounded-2xl px-2 py-4 cursor-pointer hover:shadow-md transition-shadow bg-home-lg h-[110px]"
            onClick={() => {
              // Pehle ka game open logic (future use ke liye rakha hai)
              // index === 0 && handleJilliOpen(229);
              // index === 1 && handleJilliOpen(51);
              // index === 2 && handleJilliOpen(109);

              // Abhi ke liye Coming Soon
              handleComingSoon();
            }}
          >
            {/* Left: Text Info */}
            <div className="flex flex-col justify-start z-10 ml-4 relative">
              <svg className="w-14 h-8 fill-current text-black mb-1">
                <use href={`#${sport.iconId}`}></use>
              </svg>
              <h2 className="text-black font-bold text-base">| Sports</h2>
              <p className="text-black text-sm">{sport.name}</p>
            </div>

            {/* Right: Sport Image */}
            <img
              src={sport.image}
              alt={sport.name}
              className="absolute right-0 bottom-0 h-[100px] object-contain z-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SportsComponent;
