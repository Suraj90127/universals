import React, { useCallback, useEffect, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
// import Slider from "react-slick";
import "./home.css";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";

import Slider from "react-slick";
import { RiVolumeUpFill } from "react-icons/ri";
import Layout from "../../layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userDetail } from "../../store/reducer/authReducer";
import { recharheBonus } from "../../store/reducer/userReducer";
import debounce from "lodash/debounce";
import MainLoader from "../../components/MainLoader";

import WinningInformation from "./WinningInformation";

import { Alerts } from "./Alerts";
import { BsFire } from "react-icons/bs";
import Apkdownload from "./Apkdownload";

import SlotComponents from "./lottery/SlotComponents";

import PlatformDetails from "./lottery/PlatformDetails";
import WheelSpinImg from "../../assets/wheelspin.png";
import BasicTools from "./lottery/BasicTools";
import { totalCommission } from "../../store/reducer/promotionReducer";

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { bannergetData, rechargeBonusData } = useSelector(
    (state) => state.user
  );
  const { totalCommissionData } = useSelector((state) => state.promotion);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(true);
  const [topup, setTopup] = useState(false);
  const [topup2, setTopup2] = useState(false);
  // const [topup3, setTopup3] = useState(false);
  const [mainLoader, setMainloader] = useState(false);
  const [apps, setApp] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    dispatch(recharheBonus());
  }, [dispatch]);

  const debouncedDispatch = useCallback(
    debounce(() => {
      dispatch(userDetail());
    }), // Adjust the debounce delay as needed
    [dispatch]
  );
  useEffect(() => {
    debouncedDispatch(); // Call the debounced dispatch function
    window.scrollTo(0, 0);
    const data = localStorage.getItem("topup");

    if (data == "true") {
      setTopup(true);
    }
  }, [debouncedDispatch]); // Empty dependency array ensures it runs only once
  const handleTopup = () => {
    localStorage.setItem("topup", false);
    setTopup(false);
    // setTopup3(true);
    setTopup2(true);
  };

  useEffect(() => {
    const data = localStorage.getItem("app");

    if (data === "closed") {
      setApp(false);
    } else {
      setApp(true);
    }

    dispatch(totalCommission());
  }, []);

  useEffect(() => {
    // Function to handle when the page has fully loaded
    const handleLoad = () => {
      console.log("Loading complete.");
      setMainloader(false);
    };

    if (performance.getEntriesByType("navigation")[0].type === "navigate") {
      console.log("Loading started in a new tab...");

      setMainloader(true);
      setTimeout(() => {
        setMainloader(false);
      }, 1000);
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useEffect(() => {
    // if (topup || topup2 || topup3)
    if (topup || topup2) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto"; // or 'visible' depending on your default
    };
  }, [topup2, topup]);

  const notices = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    autoplay: true,
    autoplaySpeed: 4000,
    verticalSwiping: true,
    arrows: false, // This removes the arrows
    cssEase: "linear", // Smooth scrolling effect
  };

  const [showPopup, setShowPopup] = useState(false);
  const handleReceive = () => {
    setShowPopup(false);
  };

  return (
    <Layout>
      <div
        style={{
          position: "fixed",
          zIndex: 500,
        }}
        className="flex flex-col right-0 bottom-36"
      >
        {/* 🔐 WheelSpin Protected */}
        <div
          style={{ display: "inline-block", cursor: "pointer" }}
          onClick={() => {
            if (userInfo) {
              navigate("/WheelSpin");
            } else {
              navigate("/login");
            }
          }}
        >
          <img src={WheelSpinImg} alt="Service" className="w-14" />
        </div>

        {/* 🔗 Telegram (Open Always) */}
       <Link to="/telegram" style={{ display: "inline-block" }}>
          <img src="/telegram.png" alt="Service" className="w-20" />
        </Link>
        
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#201d2b] rounded-2xl shadow-xl p-4 w-[21rem] text-center relative">
            <img
              src="https://i.ibb.co/NdLQwsCh/popup-img-01.png"
              alt=""
              className="absolute w-[9rem] right-0 left-0 flex m-auto top-[-25px]"
              loading="lazy"
            />

            {/* Right Tick Icon */}
            {/* <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-yellow-300 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div> */}

            {/* Marvelous Message */}
            <h2 className="text-xl font-semibold text-gray-200 mb-2 pt-20">
              marvelous!
            </h2>
            <p className="text-gray-500 mb-2 font-normal text-sm">
              Your invitation reward has been settled
            </p>

            {/* Commission Display */}
            <div className="flex items-center justify-center gap-1 text-2xl font-normal text-yellow-700 mb-6">
              <span className="text-gray-500 text-sm">Commission</span>
              <span className="text-base">
                {totalCommissionData?.yesterdayBalance?.toFixed(2)}
              </span>
            </div>

            {/* Receive Button */}
            <button
              onClick={handleReceive}
              className="w-[80%] py-1 rounded-3xl text-white text-xl font-bold  blue-linear"
            >
              Receive
            </button>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-20 top_bg">
        {userInfo && userInfo ? (
          <div className="flex items-center justify-between rounded-md px-3 py-2">
            <div className="flex items-center">
              <div className="logo">
                <img
                  src={bannergetData?.gameall?.logo}
                  alt="loading img"
                  loading="lazy"
                  className="w-[100px]"
                />
              </div>
            </div>
            {/* Right: Notification + Support Icons */}
            <div className="flex items-center justify-end gap-2 pr-4 text-white">
              {/* Notification Icon with Blinking Dot */}
              <div
                className="relative"
                onClick={() => navigate("/home/Messages")}
              >
                <svg
                  data-v-2564a95f
                  className="svg-icon icon-notification w-8 h-8"
                >
                  <use xlinkHref="#icon-notification" />
                </svg>
                {/* Blinking red dot */}
                <div className="absolute top-0.5 right-2">
                  <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                  <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-600"></span>
                </div>
              </div>

              {/* Customer Support Icon */}
              <a href="/app.apk" download>
                <div>
                  <svg data-v-715dd0f6="" class="svg-icon icon-down down down">
                    <use href="#icon-down"></use>
                  </svg>
                </div>
              </a>
            </div>
            {/* <div className="flex items-center">
              <svg data-v-3dc40049 className="svg-icon icon-wallet1">
                <use xlinkHref="#icon-wallet1" />
              </svg>

              <div className="ms-1">
                <p className="fs-sm">Balance</p>
                <p className="fs-sm font-medium text-blue mt-1">
                  ₹{" "}
                  {userInfo?.money_user
                    ? Number(userInfo?.money_user).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </p>
              </div>
            </div> */}
          </div>
        ) : (
          <div className=" flex items-center justify-between rounded-md px-3">
            <div className="logo py-4">
              <img
                src={bannergetData?.gameall?.logo}
                alt="loading img"
                loading="lazy"
                className="w-[100px]"
              />
            </div>
            {/* Right: Notification + Support Icons */}
            <div className="flex items-center justify-end gap-2 pr-4 text-white">
              {/* Notification Icon with Blinking Dot */}
              <div className="relative" onClick={() => navigate("/login")}>
                <svg
                  data-v-2564a95f
                  className="svg-icon icon-notification w-8 h-8"
                >
                  <use xlinkHref="#icon-notification" />
                </svg>
                {/* Blinking red dot */}
                <div className="absolute top-0.5 right-2">
                  <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                  <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-600"></span>
                </div>
              </div>

              {/* Download Icon */}
              <div onClick={() => navigate("/login")}>
                <svg data-v-715dd0f6="" class="svg-icon icon-down down down">
                  <use href="#icon-down"></use>
                </svg>
              </div>
            </div>
            {/* <div className="flex items-center">
              <button
                className="blue-linear text-white p-1 px-3 text-sm  rounded-md"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="text-blue ml-2 px-2 p-1 border border-[#c4933f]  text-sm rounded-md "
                onClick={() => navigate("/register")}
              >
                Register
              </button>{" "}
            </div> */}
          </div>
        )}
      </div>

      <Alerts />

      {mainLoader && <MainLoader />}

      {/* bannner */}
      <div className="container-section ">
        <div className="home-slider-banner">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            className="mySwiper h-[184px] rounded-xl overflow-hidden"
          >
            <SwiperSlide>
              <div className="w-full">
                <img
                  src={bannergetData?.data?.ban1}
                  className="w-full rounded-md h-36"
                  alt=""
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full">
                <img
                  src={bannergetData?.data?.ban2}
                  className="w-full rounded-md h-36"
                  alt=""
                  loading="lazy"
                />
              </div>
            </SwiperSlide>{" "}
            <SwiperSlide>
              <div className="w-full">
                <img
                  src={bannergetData?.data?.ban3}
                  className="w-full rounded-md h-36"
                  alt=""
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full">
                <img
                  src={bannergetData?.data?.ban4}
                  className="w-full rounded-md h-36"
                  alt=""
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full">
                <img
                  src={bannergetData?.data?.ban5}
                  className="w-full rounded-md h-36"
                  alt=""
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full">
                <img
                  src={bannergetData?.data?.ban6}
                  className="w-full rounded-md h-36"
                  alt=""
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full">
                <img
                  src={bannergetData?.data?.ban7}
                  className="w-full rounded-md h-36"
                  alt=""
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full">
                <img
                  src={bannergetData?.data?.ban8}
                  className="w-full rounded-md h-36"
                  alt=""
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full">
                <img
                  src={bannergetData?.data?.ban9}
                  className="w-full rounded-md h-36"
                  alt=""
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-full">
                <img
                  src={bannergetData?.data?.ban10}
                  className="w-full rounded-md h-36"
                  alt=""
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          </Swiper>

          {/* notice board */}
          <div className="banner-notice bg-body shadow-lg mt-[0.5rem] rounded-full flex items-center justify-between">
            <RiVolumeUpFill className="text-lg text-blue absolute" />
            <div className="slider-container h-[33px] ms-6 mr-2 overflow-hidden">
              <Slider {...notices}>
                <div>
                  <h3 className="text-[12px] leading-[1rem]  text-white">
                    Welcome to the {bannergetData?.gameall?.name}! Greetings,
                    Gamers and Enthusiasts! The {bannergetData?.gameall?.name}
                  </h3>
                </div>
                <div>
                  <h3 className="text-[12px] leading-[1rem] text-white">
                    If your deposit not receive, please send it directly to{" "}
                    {bannergetData?.gameall?.name} Self-service Center
                  </h3>
                </div>
                <div>
                  <h3 className="text-[12px] leading-[1rem] text-white">
                    Please be sure to always use our official website for
                    playing the games with the following link, phishing links
                  </h3>
                </div>
              </Slider>
            </div>

            <span className="float-end text-xl  relative mr-2">
              <Link
                to={"/main/Notification"}
                className="flex items-center blue-linear p-2 rounded-2xl px-4"
              >
                <BsFire className="text-black mr-1 fs-sm" />{" "}
                <span className="text-black font-semibold fs-sm">Detail</span>
              </Link>

              {/* <div className="ponter-event"></div> */}
            </span>
          </div>
        </div>
      </div>

      <SlotComponents />

      <div className="container-section overflow-x-hidden">
        <WinningInformation />
      </div>
      {/* Basic Tools */}
      {/* <BasicTools /> */}
      {/* Plateform Details */}
      {/* <div>
        <PlatformDetails />
      </div> */}

      {/* more menu */}

      <div className={topup ? "overlay-section block" : "hidden"}></div>
      <div className={topup2 ? "overlay-section block" : "hidden"}></div>
      {/* <div className={topup3 ? "overlay-section block" : "hidden"}></div> */}
      {topup && (
        <div className="absolute top-16 left-0 right-0 flex m-auto flex-col bg-light mx-8 pb-2 rounded-xl z-[9999]">
          <div className="blue-linear text-center p-2 font-bold text-lg text-[#292929] rounded-t-xl">
            𝕎𝕖𝕝𝕔𝕠𝕞𝕖 𝕋𝕠 universals
          </div>
          <div className=" py-2 font-medium  text-color text-[15px] bg-light">
            <div className="text-center comic-neue-regular text-[18px]  px-2">
              <span className=" text-white bg-transparent">
                🚨🚨🚨FOLLOW OUR LATEST INFORMATION AND NEWS IN 👇👇👇
              </span>
            </div>
            <br />
            <div className="text-center">
              <span className="text-sm font-extrabold text-white">
                🌟universals OFFICIAL TELEGRAM🌟
              </span>

              <div className="mt-3">
                <span className=" text-white font-bold text-lg leading-[23px] tracking-[1px]">
                  📢 Important Announcement: <br /> Beware of Imitations!
                </span>
              </div>
              <div className="mt-3">
                <span className="text-[16px] font-light text-white">
                  Dear Valued Members,
                </span>
              </div>
              <div className="mt-3 mx-2 text-white">
                <span className="text-[15px] font-medium">
                  We have noticed an increase in imitation of our PLATFORM,
                  universals . To ensure you are on the legitimate universals website
                  (
                  <span>
                    <Link className="text-blue-700" to="https://universals.pro">
                      universals.pro
                    </Link>
                  </span>
                  ) please verify authenticity through our official channels.
                  Stay vigilant and report any suspicious activity.
                </span>
              </div>
              <div className="mx-3 mt-3">
                <span className="text-[15px] text-white font-extrabold">
                  Thank you for your continued trust and support
                </span>
                <span>✅</span>
              </div>
            </div>
          </div>
          <button
            className=" flex justify-center text-base w-40 m-auto text-center rounded-full p-2  tracking-widest text-[#292929] blue-linear mb-2"
            onClick={handleTopup}
          >
            Confirm
          </button>
        </div>
      )}

      {/* {topup3 && (
        <div className="absolute top-20 left-0 right-0 flex m-auto flex-col blue-linear2  mx-8 pb-2 rounded-xl z-[9999]">
          <div className="blue-linear2 text-center p-2 font-bold text-lg color-orange rounded-t-xl">
            𝕎𝕖𝕝𝕔𝕠𝕞𝕖 𝕋𝕠 universals
          </div>
          <div className=" py-2 pt-5 font-medium  text-color text-[15px] bg-light">
            <div className="text-center  text-[15px]  px-2 ">
              <span className=" text-white bg-transparent">
                👑 WELCOME TO universals 👑
              </span>
            </div>
            <br />
            <div className="text-center">
              <span className="text-sm font-extrabold text-white">
                🚨 Avoid Scams, Stay Safe 🚨
              </span>

              <div className="">
                <span className="text-[16px] font-light text-white">
                  🔐 Protect Your Personal Information 🔐
                </span>
              </div>
              <div className="">
                <span className="text-[16px] font-light text-white">
                  🎁 Enjoy the Rewards We Offer 🎁
                </span>
              </div>
              <div className="">
                <span className="text-[16px] font-light text-white">
                  ✅ Experience the Fastest and Safest Transactions ✅
                </span>
              </div>

              <div className="mx-3 mt-3 text-white mb-12">
                <span className="text-[15px]">
                  🚀 Have Fun and Good Luck! 🚀 <br />
                </span>
                <span>Welcome to universals</span>
              </div>
            </div>
          </div>
          <button
            className=" flex justify-center  text-base  w-52   m-auto text-center  rounded-full p-1  tracking-widest text-color"
            onClick={() => {
              setTopup3(false);
              setTopup2(true);
            }}
          >
            Confirm
          </button>
        </div>
      )} */}

      {topup2 && (
        <div id="popup" className="popup bg-light">
          <div className="header-section sheet_nav_bg text-white">
            <h4>Extra first deposit bonus</h4>
            <p className="mt-2">Each account can only receive rewards once</p>
          </div>
          <div className="middle-content-section">
            <ul>
              {rechargeBonusData?.map((item, i) => (
                <li key={i} onClick={() => navigate("/wallet/Recharge")}>
                  <div className="first-c">
                    <p className="gray-50 text-base">
                      First deposit{" "}
                      <span className="text-[#feaa57]">
                        {item.recAmount.toLocaleString()}
                      </span>
                    </p>
                    <p className="text-[#feaa57]">
                      +₹{item.bonus.toLocaleString()}.00
                    </p>
                  </div>
                  <p className="gray-100 text-xs">
                    Deposit {item.recAmount.toLocaleString()} for the first time
                    in your account and you can receive
                    {(
                      Number(item.recAmount) + Number(item.bonus)
                    ).toLocaleString()}
                  </p>
                  <div className="bottom-c">
                    <div className="slider-box bg-[#242424]">
                      0/{item.recAmount.toLocaleString()}
                    </div>
                    <button className="border fs-sm border-[#feaa57]">
                      Deposit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bottom-section">
            <div>
              <label className="flex items-center ">
                <input
                  type="checkbox"
                  className="hidden peer"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:border-[var(--bg-color-l)] peer-checked:bg-[var(--bg-color-l)]">
                  <svg
                    className={`w-4 h-4 text-white ${
                      isChecked ? "block" : "hidden"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414L8 11.586l6.793-6.793a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-white ms-2 mr-2 fs-sm cursor-pointer">
                  No more reminders today
                </span>
              </label>
            </div>
            <button
              className="activity blue-linear text-white"
              onClick={() => setTopup2(false)}
            >
              Activity
            </button>
          </div>
          <span
            onClick={() => {
              setTopup2(false);
              // totalCommissionData?.yesterdayBalance > 0.0 && setShowPopup(true);
            }}
          >
            <RxCrossCircled className="m-auto flex text-center absolute left-0 right-0 justify-center text-2xl mt-4 text-white" />
          </span>
        </div>
      )}
      <Apkdownload />
    </Layout>
  );
};

export default Home;
