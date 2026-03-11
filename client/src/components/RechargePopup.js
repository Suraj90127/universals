import React from 'react'
import { useNavigate } from 'react-router-dom';

const RechargePopup = ({repopup,setRepopup}) => {
const navigate=useNavigate()
      const handleCloseRecharge = () => {
    navigate("/wallet/Recharge");
    setRepopup(false);
  };

  return (
    <>
    <div className={repopup ? 'overlay-section block' : 'hidden'}></div>
         {repopup && (
        <div className="fixed top-0 z-[20] bottom-0 pb-2 h-32 m-auto flex flex-col justify-center items-center left-0 right-0 w-[20rem] bg-light rounded-lg">
          <h3 className="heading-h3 text-white mt-5">Tips</h3>
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
    </>
  )
}

export default RechargePopup
