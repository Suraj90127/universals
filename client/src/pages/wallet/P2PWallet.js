

import React, { useEffect, useState } from "react";
import VaulIcon from "../../assets/vaul.png";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { BsExclamationCircle, BsShieldFillCheck } from "react-icons/bs";
import { MdKeyboardDoubleArrowRight, MdLibraryBooks } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import CustomeNavbar from "../../components/CustomeNavbar";
import { IoEyeOffOutline, IoEyeOutline, } from "react-icons/io5";
import { TbLockFilled } from "react-icons/tb";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { getP2PMain, trasferToMain } from "../../store/reducer/userReducer";
import EmptyData from "../activity/EmptyData";
import Coins from "../../assets/coins.png";
import { userDetail } from "../../store/reducer/authReducer";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
const P2PWallet = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { loader,P2PMainData } = useSelector((state) => state.user);
  const [openPopup, setOpenPopup] = useState(false)
  const [password, setPassword] = useState("")
  const [amount, setAmount] = useState("")
  const [showPassword, setShowPassword] = useState("")
  const [betAlert, setBetAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const navigate = useNavigate();
  const dispatch = useDispatch()


  const withdrawSubmit = async () => {
    dispatch(trasferToMain({ amount, password })).then((res) => {
      setSuccessMessage(res.payload.message)
      setBetAlert(true)
      if(res.payload.status){
         dispatch(getP2PMain())
         setOpenPopup(false)
          dispatch(userDetail());
      }
      setTimeout(() => {
        setBetAlert(false)
        setSuccessMessage(false)
      }, 2000);
    })
  }

  useEffect(() => {
    dispatch(getP2PMain())
      dispatch(userDetail());
  }, [dispatch])


  return (
    <>
      <CustomeNavbar name="P2P Wallet" />

      <div className="container-section mt-2  text-white ">

        <div className="total-img p-4 mt-3">
          <div className="flex items-center justify-between">
            <img src={VaulIcon} alt="" className="w-4 mr-2 mb-[2px]" />
            <p className="fs-sm border border-[var(--white)] px-3 rounded-md flex items-center ">
              <BsShieldFillCheck className="mr-1" /> Financial security
            </p>
          </div>
          <div className="flex items-center ms-1 mt-2">
            <h3 className="heaing-h3 text-xl font-bold font-sans">
              ₹{Number(userInfo?.p2pwallet)?.toFixed(2)}
            </h3>

          </div>

        </div>

        <div className="mt-3 nav-bg pt-4">
          <div className="flex justify-between">
            <div className="flex justify-center items-center flex-col w-[50%] px-2">
              <h3 className="heading-h3 color-red-200 gray-100 font-bold">
                ₹{P2PMainData?.totalAmountUser||0}
              </h3>
              <p className="text-xs font-sans gray-50">
Total transfer
              </p>

            </div>
            <div className="flex  items-center flex-col w-[50%] px-2 border-s border-[var(--bg-color-l)]">
              <h3 className="heading-h3 gray-100">₹{P2PMainData?.totalAmount||0}</h3>
              <p className="text-xs font-sans gray-50">Total cashout</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex justify-center items-center flex-col w-[50%] p-2">
              <button onClick={()=>navigate("/P2PTransfers")} className="border w-full flex font-sans  justify-center items-center border-[var(--bgblue)] m-auto rounded-md p-2 mt-2 ">
                <span className="text-base">Send Funds</span>
              </button>
            </div>
            <div className="flex justify-center items-center flex-col w-[50%] p-2">
              <button onClick={() => setOpenPopup(true)} className="border bg-[var(--bgdark)] w-full flex  font-sans  justify-center items-center border-[var(--bgblue)] m-auto rounded-md p-2 mt-2 ">
                <span className="text-base ">Transfer to Account</span>
              </button>
            </div>
          </div>
          <p className="fs-sm color-red-200 flex items-center px-2 font-sans">
            <BsExclamationCircle className="color-red-200 mr-1 " />
            <span>
              Funds are safe and secure, and can be transferred at any time
            </span>
          </p>
          <p className="fs-sm gray-50 flex items-center mt-3 pb-1 justify-center font-sans">
            Explore Wallet Features
            <MdKeyboardDoubleArrowRight className="text-slate-500" />
          </p>
        </div>

        <div className="flex items-center font-semibold mt-5 text-lg gray-100">
          <MdLibraryBooks className=" text-3xl mr-1 color-orange" />
          <h1>Historical record</h1>
        </div>
  <div className="">
        {P2PMainData?.transactions?.length>0?(Array.isArray(P2PMainData?.transactions) &&
          P2PMainData?.transactions?.map((item, i) => (
            <div className="nav-bg rounded-md mt-3">
              <div className="flex justify-between items-center p-2 ">
                <div>
                  <p className="text-[14px] gray-text font-medium">
                    Transfer in account
                  </p>
                  <p className="fs-sm text-whites">{item.date}</p>
                </div>
                <div className="flex items-center rounded-2xl color-yellow-bg-200 p-1 w-[40%]">
                  <img src={Coins} alt="" className="w-5" />
                  <p className=" text-[14px]  text-center flex m-auto font-medium">
                    {item.amount}
                  </p>
                </div>
              </div>
            </div>
          ))):(

            <EmptyData/>
          )}
      </div>


      </div>
      <div className={openPopup ? "overlay-section block" : "hidden"}></div>
      <div
        className={`bg-body z-[12]  items-center transition ease-in-out delay-150 justify-center fixed bottom-0 rounded-t-3xl filter-section w-[25.7rem] ${openPopup ? "flex" : "hidden"
          }`}
      >
        <div className=" rounded-t-3xl  overflow-hidden w-full ">
          <div className="container-section mb-5 mt-4 px-2">
            {/* <h3 className="heading-h3 flex items-center font-sans ms-1 gray-100">
              <BsShieldFillCheck className="text-blue text-xl mr-2" /> Security
              verification
            </h3> */}

            <div className="mt-4">
              <div className="flex items-center">
                <span>
                  <HiOutlineCurrencyRupee className="text-blue text-2xl" />

                </span>
                <label htmlFor="" className="font-sans ms-1 gray-50 ">
                  Amount
                </label>
              </div>
              <div className="mt-3 flex justify-between relative mb-3">
                <input
                  type="number"
                  name="amount"
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                  className="w-full nav-bg border border-slate-700 rounded-lg p-2 py-3 focus:border-slate-700 ps-6 flex items-center focus:border focus:outline-none  placeholder:text-sm placeholder:text-slate-500"
                  placeholder="Amount"
                />

              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span>
                  <TbLockFilled className="text-blue text-2xl" />
                </span>
                <label htmlFor="" className="font-sans ms-1 gray-50 ">
                  Password
                </label>
              </div>
              <div className="mt-3 flex justify-between relative mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full nav-bg border border-slate-700 rounded-lg p-2 py-3 focus:border-slate-700 ps-6 flex items-center focus:border focus:outline-none  placeholder:text-sm placeholder:text-slate-500"
                  placeholder=" Password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-lg top-4 gray-50 cursor-pointer"
                >
                  {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </span>
              </div>
            </div>

            <p className="text-sm color-red-200 py-2">
              Please secure your balance, please enter your password{" "}
            </p>

          </div>

          <div className="flex justify-between items-center gray-100">
            <button
              className=" w-[40%] p-2 mx-3"
              onClick={() => setOpenPopup(false)}
            >
              Return
            </button>
            <button
              className={` w-[60%] p-2 color-orange
             blue-linear
              `}
              disabled={loader }
              onClick={withdrawSubmit}
            >
             {loader?"Loading":"Confirm Payout"} 
            </button>
          </div>
        </div>
      </div>
      <div style={{ zIndex: "100" }} className={`place-bet-popup ${betAlert ? "active" : ""}`}>
        <div className="text-sm">{successMessage} </div>
      </div>

    </>
  );
};

export default P2PWallet;
