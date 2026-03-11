import React, { useEffect, useState } from "react";

import { AiFillExclamationCircle } from "react-icons/ai";
import { PiCopySimpleLight } from "react-icons/pi";

import Layout from "../../layout/Layout";
import { useNavigate, Link } from "react-router-dom";

import RefereshImg from "../../assets/refresh.png";
import { IoIosArrowForward } from "react-icons/io";
import { BiLogOutCircle } from "react-icons/bi";
import CopyCopmponent from "../../components/CopyCopmponent";
import { useDispatch, useSelector } from "react-redux";
import {
  notification,
  notificationgets,
  unseenmessage,
} from "../../store/reducer/activityReducer";
import { userDetail, auth_reset } from "../../store/reducer/authReducer";
import Cookies from "js-cookie";
import { AvatarData, VIPImg } from "./AvatarData";
import Loader from "../../components/Loader";
import AlertCopmponent from "../../components/AlertComponent";
import VaulIcon from "../../assets/valueIcon.png";

const Main = () => {
  const { unseenmessageget, loader } = useSelector((state) => state.activity);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refesh, setRefesh] = useState(false);
  const [copyPopup, setCopyPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [alerts, setAlerts] = useState(false);

  useEffect(() => {
    dispatch(notification());
    dispatch(notificationgets());
    dispatch(unseenmessage());
  }, []);

  const handleLogout = () => {
    Cookies.remove("auth");
    Cookies.remove("token");
    dispatch(userDetail());
    dispatch(auth_reset());
    setShowPopup(false);
    if (!userInfo) {
      navigate("/login");
    }
  };

  const copyToClipCode = () => {
    navigator.clipboard
      .writeText(userInfo.id_user)
      .then(() => {
        setCopyPopup(true);
        setTimeout(() => {
          setCopyPopup(false);
        }, 1500);
      })
      .catch((err) => {
        console.error("Failed to copy the text: ", err);
      });
  };
  const handleRefesh = () => {
    dispatch(userDetail());
    setRefesh(true);
    // dispatch(user_reset());
    setTimeout(() => {
      setRefesh(false);
    }, 1500);
  };

  function arFun() {
    setAlerts(true);
    setTimeout(() => {
      setAlerts(false);
    }, 1500);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {loader && <Loader />}

      <div className="blue-linear py-7 pb-32 rounded-b-[60px] relative">
        <div className="absolute right-2 top-1 flex">
          <div className="col-span-4  flex flex-col justify-center items-center ms-2 mt-2 relative"></div>
        </div>
        <div className="container-section text-white">
          <div className="flex items-center">
            <img
              src={AvatarData[userInfo?.userPhoto]}
              alt=""
              loading="lazy"
              className="w-20 rounded-full h-20"
              onClick={() => navigate("/main/avatar")}
            />
            <div className="ms-2">
              <h3 className="heading-h3 flex items-center text-md">
                {userInfo?.name_user}{" "}
                <img
                  src={VIPImg[userInfo?.vip_level]}
                  alt=""
                  loading="lazy"
                  className="w-16  "
                />
              </h3>
              <div className="bg-yellow text-[12px] justify-between items-center px-2 rounded-full inline-flex ">
                <span>UID</span>
                <span className="px-3">|</span>
                <span>{userInfo?.id_user}</span>
                <span className="ps-2" onClick={copyToClipCode}>
                  <PiCopySimpleLight />
                </span>
              </div>
              <p className="fs-sm mt-1">
                Last login: {localStorage.getItem("currentDate")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-section relative mt-[-100px]">
        <div className="sheet_nav_bg p-3 rounded-lg pb-3">
          <div>
            <p className="gray-50 text-sm">Total balance</p>
            <div className="flex items-center ms-2 mt-2">
              <h4 className="heading-h3 text-md text-white font-bold">
                ₹
                {userInfo?.money_user
                  ? Number(userInfo?.money_user).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0.00"}
              </h4>
              <img
                src={RefereshImg}
                alt=""
                loading="lazy"
                onClick={handleRefesh}
                className="w-5 ms-2 mb-[2px] brightness-75"
              />
            </div>
          </div>
          <hr className="mt-2 border-[#4B5563]" />
          <div className="flex justify-between mt-4 mx-2">
            <div
              onClick={()=>navigate("/P2PWallet")}
              className=" cursor-pointer flex flex-col items-center justify-center"
            >
              <svg data-v-7d799898="" class="svg-icon icon-wallets size-8">
                <use href="#icon-wallets"></use>
              </svg>
              <p className="text-sm gray-text text-center mt-2">P2PWallet</p>
            </div>
            <div
              onClick={() => navigate("/wallet/Recharge")}
              className=" cursor-pointer flex flex-col items-center justify-center"
            >
              <svg data-v-7d799898="" class="svg-icon icon-rechargeIcon size-8">
                <use href="#icon-rechargeIcon"></use>
              </svg>
              <p className="text-sm gray-text text-center mt-2">Deposit</p>
            </div>
            <div
              onClick={() => navigate("/wallet/Withdraw")}
              className="flex flex-col items-center justify-center  cursor-pointer"
            >
              <svg
                data-v-7d799898=""
                class="svg-icon icon-widthdrawBlue size-8"
              >
                <use href="#icon-widthdrawBlue"></use>
              </svg>
              <p className="text-sm gray-text text-center mt-2">Withdraw</p>
            </div>
            <div
              onClick={() => navigate("/vip")}
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <svg data-v-7d799898="" class="svg-icon icon-VipIcon size-8">
                <use href="#icon-VipIcon"></use>
              </svg>
              <p className="text-sm gray-text text-center mt-2">VIP</p>
            </div>
          </div>
        </div>
        {/* safe */}
        <div
          className="blue-linear2 rounded-md flex items-center p-2 py-4 mt-4"
          onClick={() => navigate("/main/StrongBox")}
        >
          <img src={VaulIcon} alt="" loading="lazy" className="w-10 h-10" />
          <div className="ms-2 ">
            <div className="flex justify-between items-center">
              <h3 className="heading-h3 text-base font-bold text-white">
                Safe
              </h3>
              <div className="flex items-center justify-center">
                <h3 className="bg-orange-400 text-white text-sm justify-between items-center px-2 rounded-full inline-flex">
                  ₹0.00
                </h3>
                <span>
                  <IoIosArrowForward className="text-white text-base" />
                </span>
              </div>
            </div>
            <p className="fs-sm text-white">
              Daily rate 0.1%+VIP extra income safe, calculate every 1 minute
            </p>
          </div>
        </div>
        {/* ... */}
        <div className="grid grid-cols-12 gap-[10px] mt-3">
          <div
            className="col-span-6 bg-body px-3 py-1  rounded-md flex items-center bg-body"
            onClick={() => navigate("/main/BetRecors")}
          >
            {/* <img src={GameHistory} alt="" loading="lazy" className="w-9" /> */}
            <svg data-v-acd6d46f className="svg-icon2 icon-betHistory">
              <use xlinkHref="#icon-betHistory" />
            </svg>

            <div className="ms-2">
              <h3 className="heading-h3 gray-text leading-4 text-sm">
                Game History
              </h3>
              <p className="text-[12px] gray-50 leading-4">My game history</p>
            </div>
          </div>
          <div
            className="col-span-6 bg-body px-3 py-3 rounded-md flex items-center bg-body"
            onClick={() => navigate("/wallet/TransAction")}
          >
            {/* <img src={TransactionHistory} alt="" loading="lazy" className="w-9" /> */}
            <svg data-v-acd6d46f className="svg-icon2 icon-tradeHistory">
              <use xlinkHref="#icon-tradeHistory" />
            </svg>

            <div className="ms-2">
              <h3 className="heading-h3 gray-text leading-4 text-sm">
                Transaction
              </h3>
              <p className="text-[12px] gray-50 leading-4">
                My transaction history
              </p>
            </div>
          </div>
          <div
            className="col-span-6 bg-body px-3 py-1 rounded-md flex items-center bg-body"
            onClick={() => navigate("/wallet/RechargeHistory")}
          >
            <svg data-v-acd6d46f className="svg-icon2 icon-rechargeHistory">
              <use xlinkHref="#icon-rechargeHistory" />
            </svg>

            <div className="ms-2 py-2">
              <h3 className="heading-h3 gray-text leading-4 text-sm">
                Deposit
              </h3>
              <p className="text-[12px] gray-50 leading-4">
                My deposit history
              </p>
            </div>
          </div>
          <div
            className="col-span-6 bg-body px-3 py-1 rounded-md flex items-center bg-body"
            onClick={() => navigate("/wallet/WithdrawalHistory")}
          >
            <svg data-v-acd6d46f className="svg-icon2 icon-myWithdrawHistory">
              <use xlinkHref="#icon-myWithdrawHistory" />
            </svg>

            <div className="ms-2">
              <h3 className="heading-h3 gray-text leading-4">Withdraw</h3>
              <p className="text-[12px] gray-50 leading-4">
                My withdraw history
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* game notification section */}
      <div className="container-section">
        <ul className="bg-body mt-5 rounded-lg divide-y divide-[#4B5563] ...">
          <li
            className="flex justify-between items-center p-3 py-4"
            onClick={() => navigate("/home/Messages")}
          >
            <div className="flex items-center">
              <svg data-v-a30d19b1="" class="svg-icon icon-notification size-8">
                <use href="#icon-notification"></use>
              </svg>
              <span className="text-sm text-white font-medium ml-2">
                Notification
              </span>
            </div>
            <div className="flex items-center">
              {unseenmessageget > 0 && (
                <h5 className="mr-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center text-center justify-center  px-1">
                  {unseenmessageget || "0"}
                </h5>
              )}
              <IoIosArrowForward className="text-sm font-thin gray-text" />
            </div>
          </li>
          {/* <hr className="border"/> */}
          <li
            className="flex justify-between items-center p-3 py-4"
            onClick={() => navigate("/main/RedeemGift")}
          >
            <div className="flex items-center">
              <svg data-v-a30d19b1="" class="svg-icon icon-gifts size-8 bright">
                <use href="#icon-gifts"></use>
              </svg>
              <span className="text-sm text-white font-medium ml-2">Gifts</span>
            </div>
            <div>
              <IoIosArrowForward className="text-sm font-thin gray-text" />
            </div>
          </li>
          <li
            className="flex justify-between items-center p-3 py-4"
            onClick={() => navigate("/main/GameStats")}
          >
            <div className="flex items-center">
              <svg
                data-v-a30d19b1=""
                class="svg-icon icon-statsIcon size-8 bright"
              >
                <use href="#icon-statsIcon"></use>
              </svg>
              <span className="text-sm text-white font-medium ml-2">
                Games statistics
              </span>
            </div>
            <div>
              <IoIosArrowForward className="text-sm font-thin gray-text" />
            </div>
          </li>
          <li
            className="flex justify-between items-center p-3 py-4"
            // onClick={() => navigate("/main/Language")}
          >
            <div className="flex items-center">
              <svg
                data-v-a30d19b1=""
                class="svg-icon icon-language size-8 bright"
              >
                <use href="#icon-language"></use>
              </svg>
              <span className="text-sm  text-white font-medium ml-2">
                Language
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm  text-white font-medium mr-1">
                English
              </span>
              <IoIosArrowForward className="text-sm font-thin gray-text" />
            </div>
          </li>
        </ul>
      </div>

      <div className="container-section mt-4">
        <div className="bg-body p-3 rounded-lg pb-5 bg-body">
          <h3 className="heading-h3 gray-text font-medium mb-2 ">
            Service center
          </h3>
          <div className="grid grid-cols-12 gap-2">
            <div
              className="col-span-4  flex flex-col justify-center items-center ms-2 mt-2"
              onClick={() => navigate("/main/SettingCenter")}
            >
              <svg
                data-v-159bf81f=""
                class="svg-icon icon-settingCenter size-7 text-[#008b59] bright"
              >
                <use href="#icon-settingCenter"></use>
              </svg>
              <p className="gray-50 fs-sm">Setting</p>
            </div>
            <div
              className="col-span-4  flex flex-col justify-center items-center ms-2 mt-2"
              onClick={() => navigate("/main/Feedback")}
            >
              <svg
                data-v-159bf81f=""
                class="svg-icon icon-feedback size-7 text-[#008b59] bright"
              >
                <use href="#icon-feedback"></use>
              </svg>
              <p className="gray-50 fs-sm">Feedback</p>
            </div>
            <div
              className="col-span-4  flex flex-col justify-center items-center ms-2 mt-2"
              onClick={() => navigate("/main/Notification")}
            >
              <svg
                data-v-159bf81f=""
                class="svg-icon icon-notificationCenter size-7 text-[#008b59] bright"
              >
                <use href="#icon-notificationCenter"></use>
              </svg>
              <p className="gray-50 fs-sm">Notification</p>
            </div>
            <Link
              className="col-span-4  flex flex-col justify-center items-center ms-2 mt-2"
              to={`https://h5.workorder.support.aaladin.pro?token=${Cookies.get(
                "auth"
              )}`}
            >
              <svg
                data-v-159bf81f=""
                class="svg-icon icon-serverTicket size-7 text-[#008b59] bright"
              >
                <use href="#icon-serverTicket"></use>
              </svg>
              <p className="gray-50 fs-sm text-center">
                24/7 Customer <br />
                service
              </p>
            </Link>
            <div
              onClick={() => navigate("/main/beginner")}
              className="col-span-4  flex flex-col justify-center items-center ms-2 mt-2"
            >
              <svg
                data-v-159bf81f=""
                class="svg-icon icon-guide size-7 text-[#008b59] bright"
              >
                <use href="#icon-guide"></use>
              </svg>
              <p className="gray-50 fs-sm text-center">Beginner's guide</p>
            </div>
            <div
              className="col-span-4  flex flex-col justify-center items-center ms-2 mt-2"
              onClick={() => navigate("/main/About")}
            >
              <svg
                data-v-159bf81f=""
                class="svg-icon icon-about size-7 text-[#008b59] bright"
              >
                <use href="#icon-about"></use>
              </svg>
              <p className="gray-50 fs-sm">About us</p>
            </div>
            {/* {userInfo?.vip_level >= 2 && (
              <div
                className="col-span-4 flex flex-col justify-center items-center ms-2 mt-2"
                onClick={() => window.open("/manager/index")}
              >
                <RiVipCrownFill className="size-7 text-[#008b59]" />
                <p className="gray-text fs-sm">Agent</p>
              </div>
            )} */}
          </div>
        </div>

        <button
          className="border flex  color-l justify-center items-center border-[var(--bg-color-l)] w-[100%] rounded-full p-2 mt-6 text-lg"
          onClick={() => setShowPopup(true)}
        >
          {" "}
          <BiLogOutCircle className="rotate-90 font-thin mr-2 color-l text-2xl" />{" "}
          Log Out
        </button>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-body p-6 px-10 rounded-lg text-center bg-body">
              <AiFillExclamationCircle
                className="mx-auto text-[#fb5b5b]"
                size={80}
              />
              <h2 className="gray-text font-semibold text-xl mt-4">
                Do you want to log out?
              </h2>
              <div className="mt-6 gap-3 flex flex-col">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 blue-linear font-medium text-white rounded-full"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 border border-[#c4933f] font-medium color-l rounded-full bg-body"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <CopyCopmponent copyPopup={copyPopup} message="Copy successful" />
      <CopyCopmponent copyPopup={refesh} message="Refesh successfully" />
      <AlertCopmponent alertPopup={alerts} message="Comming soon" />
    </Layout>
  );
};

export default Main;
