import React, { useEffect, useState } from "react";
import "./promotion.css";
import Layout from "../../layout/Layout";
import { PiCopySimpleLight } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import { MdOutlineArrowForwardIos } from "react-icons/md";

import CopyCodeImg from "../../assets/copyinvitationcode.png";
import SubordinateImg from "../../assets/subordinatedata.png";
import CommissionDetailImg from "../../assets/commisiondetail.png";
import InvitationRuleImg from "../../assets/invitationrule.png";
import CustomerServiceImg from "../../assets/customerserviceIcon.png";
import RebaterationImg from "../../assets/rebateratio.png";
import promotindataImg from "../../assets/promotiondeal.png";
import CopyCopmponent from "../../components/CopyCopmponent";
import { useDispatch, useSelector } from "react-redux";
import {
  promotions,
  totalCommission,
} from "../../store/reducer/promotionReducer";
import Loader from "../../components/Loader";
import Cookies from "js-cookie";
const PartnerReward = "https://i.ibb.co/x8HRG7tZ/icons.png";

const Promotion = () => {
  const { promotionsData, totalCommissionData } = useSelector(
    (state) => state.promotion
  );

  console.log("promotionsData",promotionsData);
  
  const { userInfo } = useSelector((state) => state.auth);

  const [copyPopup, setCopyPopup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const copyToClipCode = () => {
    navigator.clipboard
      .writeText(userInfo?.code)
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

  useEffect(() => {
    dispatch(promotions());
    dispatch(totalCommission());
    window.scrollTo(0, 0);
  }, [dispatch]);

  return (
    <Layout>
      {/* this is promotion page design by maxify web solution and developed by Engineer Jitendra kumar */}
      <div className="bg-body p-1 py-3 sticky top-0 z-30">
        <div className="container-section flex  items-center">
          {/* <button><Link to={"/activity"}>  <IoIosArrowBack className='text-xl' /></Link></button> */}
          <h3 className="heading-h3 text-white text-center flex justify-center items-center m-auto">
            Agency
          </h3>
          <Link to={"/promotion/Subordinate"}>
            {/* <PiNoteFill className="text-green-600 text-2xl" /> */}
            <svg data-v-600663f7="" class="svg-icon icon-subordinate">
              <use href="#icon-subordinate"></use>
            </svg>
          </Link>
        </div>
      </div>

      {!userInfo && <Loader />}

      <div className="promotion-banner">
        <div className="flex flex-col justify-center items-center pt-3">
          <h3 className="heading-h3 text-2xl text-[#8F5206]">
            {totalCommissionData?.yesterdayBalance || "0.00"}
          </h3>
          <p className="text-sm bg-body text-blue rounded-full px-3  pb-[2px] flex items-center justify-center text-center my-2 p-1">
            Yesterday's total commission
          </p>
          <p className="fs-sm py-2 text-[#8F5206]">
            Upgrade the level to increase commission income
          </p>

          <div className="promotion-member mt-2 flex items-start bg-body w-[100%] rounded-lg relative z-10">
            <div className="w-[50%]">
              <div className="sheet_nav_bg flex items-center p-1 rounded-tl-lg">
                <HiUsers className="text-whites text-2xl" />
                <p className="text-sm ms-2 font-normal py-2 text-white">
                  Direct subordinates
                </p>
              </div>

              <div className="flex  items-center justify-center flex-col text-center p-2">
                <div>
                  <h5 className="text-white text-xs">
                    {promotionsData?.level1_count
                      ? promotionsData?.level1_count
                      : "0"}
                  </h5>
                  <p className="text-white text-xs">number of register</p>
                </div>
                <div>
                  <h5 className="text-green-600 text-xs">
                    {promotionsData?.totalDepositCount
                      ? promotionsData?.totalDepositCount
                      : "0"}
                  </h5>
                  <p className="text-white text-xs">Deposit number</p>
                </div>
                <div>
                  <h5 className="color-yellow-200 text-xs">
                    {promotionsData?.totalDepositAmount
                      ? promotionsData?.totalDepositAmount
                      : "0"}
                  </h5>
                  <p className="text-white text-xs">Deposit amount</p>
                </div>
                <div>
                  <h5 className="text-white text-xs">
                    {promotionsData?.firstDepositCount
                      ? promotionsData?.firstDepositCount
                      : "0"}
                  </h5>
                  <p className="text-white text-xs">
                    Number of people making first deposit
                  </p>
                </div>
              </div>
            </div>
            <div className="w-[50%] h-full border-l border-text-white">
              <div className="sheet_nav_bg h-full flex items-center p-1 rounded-tr-lg">
                <FaUsers className="text-whites text-2xl" />
                <p className="text-sm ms-2 font-normal py-2 text-white">
                  Team subordinates
                </p>
              </div>
              <div className="flex  items-center justify-center flex-col text-center p-2">
                <div>
                  <h5 className="text-white text-xs">
                    {promotionsData?.level2_to_level6count
                      ? promotionsData?.level2_to_level6count
                      : "0"}
                  </h5>
                  <p className="text-white text-xs">number of register</p>
                </div>
                <div>
                  <h5 className="text-green-600 text-xs">
                    {promotionsData?.level2_to_level6totalDepositCount
                      ? promotionsData?.level2_to_level6totalDepositCount
                      : "0"}
                  </h5>
                  <p className="text-white text-xs">Deposit number</p>
                </div>
                <div>
                  <h5 className="color-yellow-200 text-xs">
                    {promotionsData?.level2_to_level6totalDepositAmount
                      ? promotionsData?.level2_to_level6totalDepositAmount
                      : "0"}
                  </h5>
                  <p className="text-white text-xs">Deposit amount</p>
                </div>
                <div>
                  <h5 className="text-white text-xs">
                    {promotionsData?.level2_to_level6firstDepositCount
                      ? promotionsData?.level2_to_level6firstDepositCount
                      : "0"}
                  </h5>
                  <p className="text-white text-xs">
                    Number of people making first deposit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-section">
        {/* <button
          className="blue-linear w-full p-2 text-md font-bold my-2 rounded-full"
          onClick={copyToClipboard}
        >
          INVITAION LINK
        </button> */}
        <div
          onClick={() => navigate("/invite")}
          className="blue-linear w-full p-1 text-md font-bold my-2 rounded-full text-center color-orange color-orange"
        >
          <div className="w-full ">INVITAION LINK</div>
        </div>

        <ul className="mt-3">
          {/* <li className="mt-2 bg-body p-3 py-4 rounded-lg">
            <Link
              className="flex justify-between items-center "
              to={"/promotion/PartnerReward"}
            >
              <div className="flex items-center">
                <img
                  src={PartnerReward}
                  alt=""
                  loading="lazy"
                  className="filter-imgs w-7"
                />
                <span className="text-sm font-semibold text-white ms-2 font-sans">
                  Partner rewards
                </span>
              </div>
              <div className="flex items-center">
                <MdOutlineArrowForwardIos className="text-xl text-white" />
              </div>
            </Link>
          </li> */}

          <li className="mt-2 bg-body p-3 py-4 rounded-lg">
            <Link className="flex justify-between items-center  ">
              <div className="flex items-center">
                <svg data-v-600663f7="" class="svg-icon icon-copy_Code size-8">
                  <use href="#icon-copy_Code"></use>
                </svg>
                {/* <img
                  src={CopyCodeImg}
                  alt=""
                  loading="lazy"
                  className="filter-imgs w-7"
                /> */}
                <span className="text-sm font-semibold gray-text ms-2 font-sans">
                  Copy invitation code
                </span>
              </div>
              <div className="flex items-center" onClick={copyToClipCode}>
                <span className="text-sm gray-50 mr-2">{userInfo?.code}</span>
                <PiCopySimpleLight className="gray-50" />
              </div>
            </Link>
          </li>
          {/* <li className="mt-2 bg-body p-3 py-4 rounded-lg">
            <Link
              className="flex justify-between items-center "
              to={"/promotion/Subordinate"}
            >
              <div className="flex items-center">
                <img
                  src={SubordinateImg}
                  alt=""
                  loading="lazy"
                  className="filter-imgs w-7"
                />
                <span className="text-sm font-semibold text-white ms-2 font-sans">
                  New Subordinate
                </span>
              </div>
              <div className="flex items-center">
                <MdOutlineArrowForwardIos className="text-xl text-white" />
              </div>
            </Link>
          </li> */}
          <li className="mt-2 bg-body p-3 py-4 rounded-lg">
            <Link
              className="flex justify-between items-center "
              to={"/promotion/TeamReport"}
            >
              <div className="flex items-center">
                {/* <img
                  src={SubordinateImg}
                  alt=""
                  loading="lazy"
                  className="filter-imgs w-7"
                /> */}
                <svg data-v-600663f7="" class="svg-icon icon-team_port size-8">
                  <use href="#icon-team_port"></use>
                </svg>
                <span className="text-sm font-semibold gray-text ms-2 font-sans">
                  Subordinate data
                </span>
              </div>
              <div className="flex items-center">
                <MdOutlineArrowForwardIos className="text-xl text-white" />
              </div>
            </Link>
          </li>
          <li className="mt-2 bg-body p-3 py-4 rounded-lg">
            <Link
              className="flex justify-between items-center"
              to={"/promotion/MyCommission"}
            >
              <div className="flex items-center">
                {/* <img
                  src={CommissionDetailImg}
                  alt=""
                  loading="lazy"
                  className="filter-imgs w-7"
                /> */}
                <svg data-v-600663f7="" class="svg-icon icon-commission size-8">
                  <use href="#icon-commission"></use>
                </svg>
                <span className="text-sm font-semibold gray-text ms-2 font-sans">
                  Commission detail
                </span>
              </div>
              <div className="flex items-center">
                <MdOutlineArrowForwardIos className="text-xl text-white" />
              </div>
            </Link>
          </li>
          <li className="mt-2 bg-body p-3 py-4 rounded-lg">
            <Link
              className="flex justify-between items-center  "
              to={"/promotion/PromotionRule"}
            >
              <div className="flex items-center">
                {/* <img
                  src={InvitationRuleImg}
                  alt=""
                  loading="lazy"
                  className="filter-imgs w-7 h-8"
                /> */}
                <svg data-v-600663f7="" class="svg-icon icon-invite_reg size-8">
                  <use href="#icon-invite_reg"></use>
                </svg>
                <span className="text-sm font-semibold gray-text ms-2 font-sans">
                  Invitation rules
                </span>
              </div>
              <div className="flex items-center">
                <MdOutlineArrowForwardIos className="text-xl text-white" />
              </div>
            </Link>
          </li>
          <li className="mt-2 bg-body p-3 py-4 rounded-lg">
            <Link
              className="flex justify-between items-center  "
              to={`https://h5.workorder.support.aaladin.pro?token=${Cookies.get(
                "auth"
              )}`}
            >
              <div className="flex items-center">
                {/* <img
                  src={CustomerServiceImg}
                  alt=""
                  loading="lazy"
                  className="filter-imgs w-7"
                /> */}
                <svg data-v-600663f7="" class="svg-icon icon-server size-8">
                  <use href="#icon-server"></use>
                </svg>
                <span className="text-sm font-semibold gray-text ms-2 font-sans">
                  Agent line customer service
                </span>
              </div>
              <div className="flex items-center">
                <MdOutlineArrowForwardIos className="text-xl text-white" />
              </div>
            </Link>
          </li>
          <li className="mt-2 bg-body p-3 py-4 rounded-lg">
            <Link
              className="flex justify-between items-center  "
              to={"/promotion/RebateRatio"}
            >
              <div className="flex items-center">
                {/* <img
                  src={RebaterationImg}
                  alt=""
                  loading="lazy"
                  className="filter-imgs w-7"
                /> */}
                <svg
                  data-v-600663f7=""
                  class="svg-icon icon-rebateRatio size-8"
                >
                  <use href="#icon-rebateRatio"></use>
                </svg>
                <span className="text-sm font-semibold gray-text ms-2 font-sans">
                  Rebate ratio
                </span>
              </div>
              <div className="flex items-center">
                <MdOutlineArrowForwardIos className="text-xl text-white" />
              </div>
            </Link>
          </li>
        </ul>

        <div className="mt-2 bg-body p-2 rounded-lg">
          <div className="flex items-center">
            <img
              src={promotindataImg}
              alt=""
              loading="lazy"
              className="filter-imgs w-7 mr-2"
            />
            <h5 className="heading-h5 text-base gray-text font-sans">
              promotion data
            </h5>
          </div>

          <div className="flex justify-between mt-2">
            <div className="text-center w-[50%]">
              <h5 className="heading-h5  text-sm text-white">
                {Number(totalCommissionData?.weekBalance)?.toFixed(2)}
              </h5>
              <p className="font-light text-gray-400 leading-5">This Week</p>
            </div>
            <div className="text-center  w-[50%] border-l border-[#4D4D4C]">
              <h5 className="heading-h5 text-sm text-white">
                {Number(totalCommissionData?.totalBalance)?.toFixed(2)}
              </h5>
              <p className="font-light text-gray-400 leading-5">
                Total commission
              </p>
            </div>
          </div>
          <div className="flex justify-between mt-3">
            <div className="text-center w-[50%]">
              <h5 className="heading-h5  text-sm text-white">
                {promotionsData?.invite?.f1}
              </h5>
              <p className="font-light text-gray-400 leading-5">
                direct subordinate
              </p>
            </div>
            <div className="text-center  w-[50%] border-l border-[#4D4D4C]">
              <h5 className="heading-h5 text-sm text-white">
                {promotionsData?.total_downline_count}
              </h5>
              <p className="font-light text-gray-400 leading-5">
                Total number of subordinate in the team
              </p>
            </div>
          </div>
        </div>
      </div>
      <CopyCopmponent copyPopup={copyPopup} message="Copy successful" />
    </Layout>
  );
};

export default Promotion;
