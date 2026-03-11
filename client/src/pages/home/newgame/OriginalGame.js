import React, { useState, useCallback, useEffect } from "react";
import debounce from "lodash/debounce";
import { gameListByProvider } from "../../../store/reducer/spribeGameReducer";

import { useDispatch } from "react-redux";
import JilliPopup from "../../../components/JilliPopup"; // 🔹 Abhi ke liye comment kiya
import { Link } from "react-router-dom";

const OriginalGame = () => {
  const dispatch = useDispatch();

  const [gameId, setGameId] = useState(); // 🔹 Abhi ke liye comment kiya
  const [gameList, setGameList] = useState([]);
  const [gameType, setGameType] = useState("CasinoTable");

  // State for "Coming Soon" popup
  // const [showComingSoon, setShowComingSoon] = useState(false);

  const handleJilliOpen = (data) => {
    setGameId(data);
  };

  const fetchGameList = useCallback(
    debounce(() => {
      dispatch(
        gameListByProvider({ provider: "spribe", page: 1, size: 8 })
      ).then((res) => {
        if (res?.payload?.data?.data) {
          setGameList(res.payload.data.data);
        }
      });
    }, 300),
    [dispatch, gameType]
  );

  useEffect(() => {
    fetchGameList();
    return () => fetchGameList.cancel();
  }, [fetchGameList]);

  // Click handler for "Coming Soon"
  // const handleImageClick = () => {
  //   setShowComingSoon(true);
  // };

  return (
    <>
      {gameId && <JilliPopup gameId={gameId} />}  
     

      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="border-after mt-2 text-whites text-lg border-l-4 border-[#c4933f] pl-1">
            Original
          </h1>
        </div>
      </div>

      {/* Game Grid */}
      <div className="slider-container mt-4">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
          {gameList &&
            gameList.map((game, index) => (
              <div
                key={index}
                className="rounded-lg bg-gray-100 overflow-hidden cursor-pointer"
              >
                <img
                  data-origin={game.icon}
                  src={game.icon}
                  alt={game.game_name}
                  loading="lazy"
                  className="w-full h-[12vh] object-fill"
                  // onClick={handleImageClick} // 🔹 Abhi ke liye coming soon show karega
                  onClick={() => handleJilliOpen(game.game_uid)} // 🔹 Baad me uncomment karke Spribe game open karna
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default OriginalGame;
