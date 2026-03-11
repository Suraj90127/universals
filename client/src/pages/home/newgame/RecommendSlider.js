import React, { useState, useEffect, useCallback } from "react";
// import JilliPopup from "../../../components/JilliPopup"; // ✅ Comment kiya

const RecommendSlider = () => {
  const [gameId, setGameId] = useState();
  const [gameList, setGameList] = useState([]);
  const [comingSoonPopup, setComingSoonPopup] = useState(false);

  const handleGameClick = (game) => {
    // ✅ Jilli popup open code comment kiya
    /*
    setGameId(game.game_uid);
    */
    setComingSoonPopup(true); // ✅ Abhi ke liye coming soon popup dikhayega
  };

  const fetchGameList = useCallback(() => {
    setGameList([
      {
        icon: "https://i.ibb.co/YTB8kF0Y/800.png",
        game_name: "Aviator",
        game_uid: "a04d1f3eb8ccec8a4823bdf18e3f0e84",
      },
      {
        icon: "https://i.ibb.co/Z12wyvwj/105.png",
        game_name: "Cricket",
        game_uid: "c68a515f0b3b10eec96cf6d33299f4e2",
      },
      {
        icon: "https://i.ibb.co/4qkGcH0/125.png",
        game_name: "Mines 1",
        game_uid: "da0d973cee506257c900d18375883f2c",
      },
      {
        icon: "https://i.ibb.co/B5HTX2VS/14027.png",
        game_name: "Mines 2",
        game_uid: "4de0c305e78b77ab9b3714138299a36d",
      },
      {
        icon: "https://i.ibb.co/7tXcBCL8/109-1.png",
        game_name: "Mines 3",
        game_uid: "a493bdd1bbe559f7a3fa5e5947982242",
      },
      {
        icon: "https://i.ibb.co/1Y9CJ2Wt/223.png",
        game_name: "Mines 4",
        game_uid: "1180fe0cde1d83f307d3db95883123d8",
      },
    ]);
  }, []);

  useEffect(() => {
    fetchGameList();
  }, [fetchGameList]);

  return (
    <>
      {/* {gameId && <JilliPopup gameId={gameId} />} */}

      {/* Coming Soon Popup */}
      {comingSoonPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg p-6 text-center w-80">
            <h2 className="text-xl font-bold mb-3">Coming Soon</h2>
            <p className="text-gray-600 mb-5">
              This game will be available soon.
            </p>
            <button
              onClick={() => setComingSoonPopup(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="mb-3">
        <h4 className="border-after text-white font-bold border-l-4 border-[#c4933f] pl-1">
          Platform Recommended
        </h4>
      </div>

      <div className="grid grid-cols-12 gap-3 mt-2">
        {gameList.map((game, index) => (
          <div className="col-span-4 mb-2" key={index}>
            <div
              className="bg-home-lg rounded-lg"
              onClick={() => handleGameClick(game)}
            >
              <img
                src={game.icon}
                alt={game.game_name}
                loading="lazy"
                className="w-full rounded-lg p-1 h-[22vh]"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RecommendSlider;
