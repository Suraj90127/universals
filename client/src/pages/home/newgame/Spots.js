import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { launchGame } from "../../../store/reducer/spribeGameReducer";

const Slots = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [comingSoonPopup, setComingSoonPopup] = useState(false);
  const [gameId, setGameId] = useState();

  // ✅ Static slots with images & unique ids
  const staticSlots = [
    // { img: "https://i.ibb.co/pBR1wxN5/slot1.png" },
    // { img: "https://i.ibb.co/w9g9Cgk/slot2.png" },
    // { img: "https://i.ibb.co/99bjQGrz/slot3.png" },
    // { img: "https://i.ibb.co/TxHGR4L8/slot4.png" },
    // { img: "https://i.ibb.co/XfC49PXz/slot5.png" },
    // { img: "https://i.ibb.co/pBVfBNtk/slot6.png" },
    {
      img: "https://i.ibb.co/60v3SgrG/slot7.png",
      link: "/home/AllOnlineGames", // yahan link daal diya
    },
  ];

  const handleSlotClick = () => {
    // ✅ Spribe ka API wala code comment kiya
    // /*
    if (!userInfo) {
      navigate("/login");
    } else {
      if (userInfo?.isdemo === 0) {
        const playerid = userInfo?.phone_user;
        dispatch(launchGame({ playerid, gameId })).then((res) => {
          if (res.payload.status) {
            window.location.href = res.payload.data.launch_view_url;
          }
        });
      }
    }
    // */
    // setComingSoonPopup(true); // ✅ Abhi ke liye coming soon popup open karega
  };

  return (
    <>
      {/* Coming Soon Popup */}
      {/* {comingSoonPopup && (
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
      )} */}

      <h4 className="border-after mt-2 text-white text-lg border-l-4 border-[#c4933f] pl-1 mb-3">
        Slots
      </h4>
      <div className="grid grid-cols-12 gap-3">
        {staticSlots.map((slot, i) => (
          <div className="col-span-4 bg-home-lg rounded-lg" key={i}>
            <img
              src={slot.img}
              alt={`Slot ${i + 1}`}
              loading="lazy"
              className="w-full rounded-lg p-[1px] h-[12vh]"
              onClick={() => {
                if (slot.link) {
                  navigate(slot.link); // react-router ka navigate use karo
                } else {
                  handleSlotClick();
                }
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Slots;
