import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CardImg from "../../assets/card.png";
import USDtImg from "../../assets/usdt.png";
import USDt1Img from "../../assets/usdt1.png";
import {
  BsCheckCircleFill,
  BsPlusSquareDotted,
  BsShieldFillCheck,
} from "react-icons/bs";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FaSquare } from "react-icons/fa";
import Wallet from "../../assets/balance.png";
import RefereshImg from "../../assets/refresh.png";
import CopyCopmponent from "../../components/CopyCopmponent";
import { useDispatch, useSelector } from "react-redux";
import { userDetail } from "../../store/reducer/authReducer";
import { getBank, withdrawal } from "../../store/reducer/userReducer";
import { TbLockFilled } from "react-icons/tb";
import Marquee from "react-fast-marquee";
import CustomeNavbar from "../../components/CustomeNavbar";
import { MdOutlineArrowForwardIos } from "react-icons/md";
const AR = "https://i.ibb.co/DPSRWVbF/pay-Name-Icon.png";
const Withdraw = () => {
  const { userInfo, loader } = useSelector((state) => state.auth);
  const { addBankData } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("BANK CARD");
  const [amount, setAmount] = useState("");
  const [copyPopup, setCopyPopup] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [betAlert, setBetAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const tabs = [
    { label: "BANK CARD", Img: CardImg },
    { label: "USDT", Img: USDtImg },
    { label: "UPI", Img: "https://i.ibb.co/chmx0RsJ/With-Before-Img-Icon-20250917120418v5ej.png" },
    { label: "P2P Wallet", Img: "/p2p.png" },
  ];

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRefesh = () => {
    setCopyPopup(true);
    dispatch(userDetail());
    setTimeout(() => {
      setCopyPopup(false);
    }, 1500);
  };

  const withdrawSubmit = () => {
    dispatch(
      withdrawal({ money: amount, password: password, type: activeTab })
    ).then((res) => {
      setSuccessMessage(res.payload.message);
      setBetAlert(true);
      if (res.payload.status) {
        setOpenPopup(false);
        setShowPopup(true);
      }
    });
    dispatch(userDetail());
    setTimeout(() => {
      setBetAlert(false);
    }, 2000);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  useEffect(() => {
    dispatch(getBank());
    dispatch(userDetail());
    window.scrollTo(0, 0);
  }, [dispatch]);

  useEffect(() => {}, [addBankData]);

  function accountNumber(phoneNumber) {
    const prefix = phoneNumber.slice(0, 6); // '987'
    const suffix = phoneNumber.slice(-3); // '211'
    return `${prefix}****${suffix}`;
  }

  function formateUSDT(phoneNumber) {
    const prefix = phoneNumber.slice(0, 6); // '987'
    const suffix = phoneNumber.slice(-5); // '211'
    return `****${suffix}`;
  }

  return (
    <>
      <CustomeNavbar
        name="Withdraw"
        details="Withdraw history"
        link="/wallet/WithdrawalHistory"
      />
      <div className="container-section mt-3">
        <div className="total-img p-4 color-orange">
          <div className="flex items-center">
            <img src={Wallet} alt="" className="w-4 mr-2 mb-[2px]" />
            <p className="fs-sm">Available balance</p>
          </div>
          <div className="flex items-center ms-2 mt-2">
            <h3 className="heaing-h3 text-xl font-bold">
              ₹{" "}
              {userInfo?.money_user
                ? Number(userInfo?.money_user).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "0.00"}
            </h3>
            <img
              src={RefereshImg}
              alt=""
              className="w-5 ms-2 mb-[2px]"
              onClick={handleRefesh}
            />
          </div>
        </div>
      

        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              className={`px-2 py-2 rounded w-28 flex flex-col justify-center items-center ${
                activeTab === tab.label
                  ? "blue-linear color-orange"
                  : "bg-body gray-50"
              }`}
              onClick={() => setActiveTab(tab.label)}
            >
              <img src={tab.Img} alt="" className="w-10 mb-1" />
              <span
                className={activeTab === tab.label ? "text-[12px]" : " text-[12px]"}
              >
                {" "}
                {tab.label}
              </span>
            </button>
          ))}
        </div>

      
        <div className="mt-4">
          {(activeTab === "BANK CARD" || activeTab === "P2P Wallet") && (
            <>
              {addBankData?.stk?.length >= 3 ? (
                <div className="bg-body p-4 rounded-md text-center flex items-center">
                  <div className="flex items-center flex-col mr-3  w-[30%]">
                    <svg data-v-80a607a5 className="svg-icon icon-1">
                      <use xlinkHref="#icon-1" />
                    </svg>
                    <p className="text-sm gray-50 mt-2 flex">
                      {addBankData?.name_bank.substring(0, 10)}...
                    </p>
                  </div>

                  <div className="border-l flex justify-between  items-center pl-5 w-[70%]">
                    <p className="text-sm gray-50 mt-1">
                      {accountNumber(addBankData?.stk)}
                    </p>

                    <div>
                      <MdOutlineArrowForwardIos className="text-xl gray-50" />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="bg-body p-4 rounded-md text-center"
                  onClick={() => navigate("/wallet/Withdraw/AddBankCard")}
                >
                  <p className="text-center flex justify-center text-4xl gray-50">
                    {" "}
                    <BsPlusSquareDotted />
                  </p>
                  <p className="text-sm gray-text mt-5">
                    Add a bank account number
                  </p>
                </div>
              )}
              {addBankData?.stk?.length >= 3 ? (
                // <p className="color-red-200 fs-sm text-center my-2">
                //   Need to add beneficiary information to be able to withdraw money
                // </p>
                ""
              ) : (
                <p className="color-red-200 fs-sm text-center my-2">
                  Need to add beneficiary information to be able to withdraw
                  money
                </p>
              )}
              <div className="bg-body mt-2 p-3 rounded-t-md pb-10">
                <div className="bgs-body flex items-center px-5 py-1 rounded-full">
                  <span className="text-blue text-lg font-bold">₹</span>
                  <form autoComplete="off">
                    <input
                      type="number"
                      name="amount_no_autofill_123" // Random name prevents browser detection
                      autoComplete="off" // Turns off autocomplete
                      inputMode="numeric" // Numeric keyboard on mobile
                      autoCorrect="off"
                      spellCheck="false"
                      className="w-full bgs-body p-2 ps-6 flex items-center focus:outline-none color-blue placeholder:text-sm placeholder:text-[#d9ac4f]"
                      placeholder="Please enter the amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      onFocus={(e) => {
                        const val = e.target.value;
                        e.target.value = "";
                        e.target.value = val;
                      }}
                    />
                  </form>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="fs-sm gray-50">
                    Withdrawable balance{" "}
                    <span className="color-yellow-200">
                      ₹
                      {(
                        Number(userInfo?.money_user) -
                        Number(userInfo?.recharge)
                      ).toFixed(2)}
                    </span>
                  </p>
                  <button
                    className="border rounded-md border-[var(--main-color)] text-blue px-5 py-[2px] fs-sm"
                    onClick={() =>
                      setAmount(
                        Math.round(
                          Number(userInfo?.money_user) -
                            Number(userInfo?.recharge)
                        )
                      )
                    }
                  >
                    All
                  </button>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="fs-sm gray-50">Withdrawable amount received </p>
                  <span className="color-yellow-200 text-base font-bold">
                    ₹{Number(amount).toFixed(2)}{" "}
                  </span>
                </div>
                <button
                  className="blue-linear  w-full rounded-full p-2 mt-4 color-orange"
                  onClick={() => setOpenPopup(true)}
                >
                  Withdraw
                </button>
              </div>
            </>
          )}

          {activeTab === "USDT" && (
            <>
              {addBankData?.sdt?.length >= 3 ? (
                <div className="bg-body p-2 rounded-md text-center flex items-center">
                  <div className="flex items-center flex-col mr-3  w-[30%]">
                    <div className="flex ">
                      <img src={USDt1Img} alt="" className="w-6 mr-2" />
                      <p>TRC</p>
                    </div>
                    <p className="text-sm gray-50 flex">
                      {formateUSDT(addBankData?.sdt)}
                    </p>

                    <p className="text-sm gray-50 flex">
                      {addBankData?.remarkType?.substring(0, 10)}...
                    </p>
                  </div>

                  <div className="flex justify-end  items-center pl-5 w-[70%]">
                    <MdOutlineArrowForwardIos className="text-xl gray-50" />
                    <div></div>
                  </div>
                </div>
              ) : (
                <div
                  className="bg-body p-4 rounded-md text-center"
                  onClick={() => navigate("/wallet/Withdraw/AddUSDT")}
                >
                  <p className="text-center flex justify-center text-4xl gray-50">
                    {" "}
                    <BsPlusSquareDotted />
                  </p>
                  <p className="text-sm gray-text mt-5">Add address</p>
                </div>
              )}

              <div className="bg-body mt-2 p-3 pb-10 rounded-t-md">
                <div className="flex items-center mb-2">
                  <img src={USDt1Img} alt="" className="w-6 mr-2" />{" "}
                  <h3 className="heading-h3 gray-50">Select amount of USDT</h3>
                </div>
                <div className="bgs-body flex items-center px-5 py-1 rounded-lg">
                  <span className="text-blue text-lg font-bold">₹</span>
                  <input
                    type="number"
                    className="w-full  bgs-body  p-2  ps-6 flex items-center  focus:outline-none text-blue placeholder:text-sm placeholder:text-[#d9ac4f]"
                    placeholder="Please enter withdrawal amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="bgs-body flex items-center px-5 py-1 rounded-lg mt-3">
                  <img src={USDt1Img} alt="" className="w-5" />
                  <input
                    type="number"
                    className="w-full  bgs-body  p-2  ps-6 flex items-center  focus:outline-none text-blue placeholder:text-sm placeholder:text-[#d9ac4f]"
                    placeholder="Please enter USDT amount"
                    value={Number(Number(amount) / 94).toFixed(2)}
                    onChange={(e) => setAmount(e.target)}
                  />
                </div>

                <div className="flex justify-between mt-2">
                  <p className="fs-sm gray-50 text-blue">
                    Withdrawable balance{" "}
                    <span className="color-yellow-200">
                      ₹
                      {(
                        Number(userInfo.money_user) - Number(userInfo?.recharge)
                      ).toFixed(2)}
                    </span>
                  </p>
                  <button
                    className="border rounded-md border-[var(--main-color)] text-blue px-5 py-[2px] fs-sm"
                    onClick={() =>
                      setAmount(
                        Math.round(
                          Number(userInfo?.money_user) -
                            Number(userInfo?.recharge)
                        )
                      )
                    }
                  >
                    All
                  </button>
                </div>

                <button
                  className="blue-linear  w-full rounded-full p-2 mt-4 color-orange"
                  onClick={() => setOpenPopup(true)}
                >
                  Withdraw
                </button>
              </div>
            </>
          )}
            {(activeTab === "UPI" ) && (
            <>
              {addBankData?.upi?.length >= 3 ? (
                <div className="bg-body p-4 rounded-md text-center flex items-center">
                  <div className="flex items-center flex-col mr-3  w-[30%]">
                    <svg data-v-80a607a5 className="svg-icon icon-1">
                      <use xlinkHref="#icon-1" />
                    </svg>
                    <p className="text-sm gray-50 mt-2 flex">
                      {addBankData?.name_user.substring(0, 10)}...
                    </p>
                  </div>

                  <div className="border-l flex justify-between  items-center pl-5 w-[70%]">
                    <p className="text-sm gray-50 mt-1">
                      {accountNumber(addBankData?.upi)}
                    </p>

                    <div>
                      <MdOutlineArrowForwardIos className="text-xl gray-50" />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="bg-body p-4 rounded-md text-center"
                  onClick={() => navigate("/wallet/Withdraw/AddUpi")}
                >
                  <p className="text-center flex justify-center text-4xl gray-50">
                    {" "}
                    <BsPlusSquareDotted />
                  </p>
                  <p className="text-sm gray-text mt-5">
                    Add UPI ID
                  </p>
                </div>
              )}
              {addBankData?.upi?.length >= 3 ? (
                // <p className="color-red-200 fs-sm text-center my-2">
                //   Need to add beneficiary information to be able to withdraw money
                // </p>
                ""
              ) : (
                <p className="color-red-200 fs-sm text-center my-2">
                  Need to add beneficiary information to be able to withdraw
                  money
                </p>
              )}
              <div className="bg-body mt-2 p-3 rounded-t-md pb-10">
                <div className="bgs-body flex items-center px-5 py-1 rounded-full">
                  <span className="text-blue text-lg font-bold">₹</span>
                  <form autoComplete="off">
                    <input
                      type="number"
                      name="amount_no_autofill_123" // Random name prevents browser detection
                      autoComplete="off" // Turns off autocomplete
                      inputMode="numeric" // Numeric keyboard on mobile
                      autoCorrect="off"
                      spellCheck="false"
                      className="w-full bgs-body p-2 ps-6 flex items-center focus:outline-none color-blue placeholder:text-sm placeholder:text-[#d9ac4f]"
                      placeholder="Please enter the amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      onFocus={(e) => {
                        const val = e.target.value;
                        e.target.value = "";
                        e.target.value = val;
                      }}
                    />
                  </form>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="fs-sm gray-50">
                    Withdrawable balance{" "}
                    <span className="color-yellow-200">
                      ₹
                      {(
                        Number(userInfo?.money_user) -
                        Number(userInfo?.recharge)
                      ).toFixed(2)}
                    </span>
                  </p>
                  <button
                    className="border rounded-md border-[var(--main-color)] text-blue px-5 py-[2px] fs-sm"
                    onClick={() =>
                      setAmount(
                        Math.round(
                          Number(userInfo?.money_user) -
                            Number(userInfo?.recharge)
                        )
                      )
                    }
                  >
                    All
                  </button>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="fs-sm gray-50">Withdrawable amount received </p>
                  <span className="color-yellow-200 text-base font-bold">
                    ₹{Number(amount).toFixed(2)}{" "}
                  </span>
                </div>
                <button
                  className="blue-linear  w-full rounded-full p-2 mt-4 color-orange"
                  onClick={() => setOpenPopup(true)}
                >
                  Withdraw
                </button>
              </div>
            </>
          )}
        </div>

        <div className="bg-body pb-5 rounded-b-md">
          <ul className="border border-[#525167] rounded-md mx-3 p-5 ">
            <li className=" flex">
              <FaSquare className="rotate-45 text-[7px] text-blue mr-2 mt-[2px]" />
              <p className="fs-sm gray-50  leading-[18px]">
                Need to bet{" "}
                <span className="color-red-200">
                  ₹{Number(userInfo?.recharge).toFixed(2)}
                </span>{" "}
                to be able to withdraw
              </p>
            </li>
            <li className=" flex mt-2">
              <span>
                <FaSquare className="rotate-45 text-[7px] text-blue mr-2 mt-[2px]" />
              </span>
              <p className="fs-sm gray-50 leading-[18px] ">
                With time <span className="color-red-200">00:00-23:59</span>{" "}
              </p>
            </li>
            <li className=" flex mt-2">
              <span>
                <FaSquare className="rotate-45 text-[7px] text-blue mr-2 mt-[2px]" />
              </span>
              <p className="fs-sm gray-50 leading-[18px]">
                Inday Remaining Withdrawal Times{" "}
                <span className="color-red-200">3</span>{" "}
              </p>
            </li>
            <li className=" flex mt-2">
              <span>
                <FaSquare className="rotate-45 text-[7px]  text-blue mr-2 mt-[2px]" />
              </span>
              <p className="fs-sm gray-50 leading-[18px] ">
                Withdrawal amount range{" "}
                <span className="color-red-200">
                  {" "}
                  {activeTab === "USDT"
                    ? "₹1000.00-₹1,000,000.00"
                    : "₹110.00-₹150,000.00"}
                </span>{" "}
              </p>
            </li>
            <li className="flex mt-2">
              <span>
                <FaSquare className="rotate-45 text-[7px]  text-blue mr-2 mt-[2px]" />
              </span>
              <p className="fs-sm gray-50 leading-[18px] ">
                {" "}
                Please confirm your beneficial account information before
                withdrawing. If your information is incorrect, our company will
                not be liable for the amount of loss
              </p>
            </li>
            <li className=" flex mt-2">
              <span>
                <FaSquare className="rotate-45 text-[7px]  text-blue mr-2 mt-[2px]" />
              </span>
              <p className="fs-sm gray-50 leading-[18px] ">
                {" "}
                If your beneficial information is incorrect, please contact
                customer service
              </p>
            </li>
          </ul>
        </div>
      </div>

   
      <div className={showPopup ? "overlay-section block" : "hidden"}></div>
   <div className={openPopup ? "overlay-section block" : "hidden"}></div>
      <div
        className={`bg-body z-[12]  items-center transition ease-in-out delay-150 justify-center fixed bottom-0 rounded-t-md filter-section w-[25.7rem] ${
          openPopup ? "flex" : "hidden"
        }`}
      >
        <div className=" rounded-t-lg  overflow-hidden w-full ">
          <div className="container-section mb-5 mt-4 px-2">
            <h3 className="heading-h3 flex items-center font-sans ms-1 gray-100">
              <BsShieldFillCheck className="text-blue text-xl mr-2" /> Security
              verification
            </h3>

            <div className="mt-4">
              <div className="flex items-center">
                <span>
                  <TbLockFilled className="text-blue text-2xl" />
                </span>
                <label htmlFor="" className="font-sans ms-1 gray-50 mb-2">
                  Password
                </label>
              </div>
              <div className="mt-3 flex justify-between relative mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full nav-bg border border-slate-900 rounded-lg p-2 py-3 focus:border-slate-700 ps-6 flex items-center focus:border focus:outline-none  placeholder:text-sm placeholder:text-slate-500"
                  placeholder=" Password"
                />
                <span
                  onClick={toggleShowPassword}
                  className="absolute right-4 text-lg top-4 gray-50 cursor-pointer"
                >
                  {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </span>
              </div>
            </div>

            <p className="text-sm color-red-200 py-2">
              Please secure your balance, please enter your password{" "}
            </p>
            <Link to={userInfo?.telegram} className="gray-50 text-sm">
              Customer care service
            </Link>
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
              disabled={loader ? true : false}
              onClick={withdrawSubmit}
            >
             {loader?"Loading":"Confirm Withdrawal"} 
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex z-20 items-center justify-center bg-black bg-opacity-50">
          <div className="bg-blues p-6 px-8 rounded-lg text-center relative">
            <img
              src="https://i.ibb.co/4RsybQgG/popup-img-01.png"
              alt=""
              className="w-32 flex justify-center items-center m-auto absolute -top-6 left-0 right-0"
              loading="lazy"
            />
            <h2 className="text-white font-semibold text-xl mt-4 pt-10">
              Withdrawal request successful
            </h2>
            <p className="text-sm gray-50 pt-2">
              We will complete the withdrawal with 3 hours
            </p>
            <p className="text-sm gray-50">Please wait petiently...</p>
            <div className="mt-6 gap-3 flex flex-col">
              <button
                onClick={() => {
                  navigate("/wallet/WithdrawalHistory");
                  setShowPopup(false);
                }}
                className="px-4 py-2 blue-linear font-medium color-orange rounded-full"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`place-bet-popup ${betAlert ? "active" : ""}`}>
        <div className="text-sm">{successMessage} </div>
      </div>
      <CopyCopmponent copyPopup={copyPopup} message="Refesh successfully" />
    </>
  );
};

export default Withdraw;
