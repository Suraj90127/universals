import React, { useEffect, useState } from "react";
import "./navbar.css";
import { RiHomeSmileLine } from "react-icons/ri";
import {
  MdDiamond,
  MdOutlineAccountBox,
  MdOutlineLocalActivity,
} from "react-icons/md";
import { BiWallet } from "react-icons/bi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ServiceImg from "../assets/icon_sevice.png";
import WheelSpinImg from "../assets/wheelspin.8ec6f252ec6ce93fb9fd.8ec6f252ec6ce93fb9fd.png";
import dragonImg from "../assets/changlong.de82cd2c25a08dc22ccd.png";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

const Navbar = () => {
  const [activeItem, setActiveItem] = useState("/");

  const { userInfo } = useSelector((state) => state.auth);

  const naviaget = useNavigate();
  const handleClick = (item) => {
    setActiveItem(item);
    naviaget(`/${item}`);
  };
  let location = useLocation();
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [activeItem]);
  return (
    <>
      <div
        style={{
          position: "fixed",
          // left: position.x,
          // top: position.y,
          zIndex: 500,
          // cursor: dragging ? "grabbing" : "pointer",
          // transition: dragging ? "none" : "all 0.2s ease-out",
        }}
        // onMouseDown={handleStartDragging}
        // onTouchStart={handleStartDragging}
        // onMouseMove={(e) => e.preventDefault()}
        className="flex flex-col right-0 bottom-20"
      >
        {/* <div
          onClick={() => handleClick("WheelSpin")}
          style={{ display: "inline-block" }}
        >
          <img src={WheelSpinImg} alt="Service" className="w-14  " />
        </div> */}
        {/* <div style={{ display: "inline-block" }}>
          <img src={dragonImg} alt="Service" className="w-14" />
        </div> */}

        {userInfo ? (
          <Link
            to={`https://h5.workorder.support.aaladin.pro?token=${Cookies.get(
              "auth"
            )}`}
            style={{ display: "inline-block" }}
          >
            <img src={ServiceImg} alt="Service" className="w-14" />
          </Link>
        ) : (
          <div
            onClick={() => handleClick("main/CustomerService")}
            style={{ display: "inline-block" }}
          >
            <img src={ServiceImg} alt="Service" className="w-14" />
          </div>
        )}
      </div>
      <div className="navbar-section">
        <div
          className={`flex justify-center items-center flex-col p-2 pb-5 ${
            activeItem === "/" || activeItem === "//" ? "active" : ""
          }`}
          onClick={() => handleClick("/")}
        >
          <svg
            data-v-cbfefb2b=""
            className={`size-7 ${
              activeItem === "/" || activeItem === "//"
                ? "svg-icon"
                : "svg-icons"
            }`}
          >
            <use href="#icon-home"></use>
          </svg>

          <span
            className={`text-[11px] font-medium ${
              activeItem === "/" || activeItem === "//" ? "active" : "gray-50"
            }`}
          >
            Home
          </span>
        </div>

        <div
          className={`flex justify-center items-center flex-col p-2 pb-5 ${
            activeItem === "/activity" ? "active" : ""
          }`}
          onClick={() => handleClick("activity")}
        >
          <svg
            data-v-cbfefb2b=""
            className={`size-7 ${
              activeItem === "/activity" ? "svg-icon" : "svg-icons"
            }`}
          >
            <use href="#icon-activity"></use>
          </svg>

          <span
            className={`text-[11px] font-medium ${
              activeItem === "/activity" ? "active" : "gray-50"
            }`}
          >
            Activity
          </span>
        </div>

        <div className="p-2 pb-4" onClick={() => handleClick("promotion")}>
          <div className="nav-promotion">
            <svg
              data-v-cbfefb2b
              xmlns="http://www.w3.org/2000/svg"
              width={130}
              height={60}
              viewBox="0 0 130 108"
              fill="none"
            >
              <g clipPath="url(#clip0_1_9417)" data-v-cbfefb2b>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M107.494 0C110.5 0 113.181 1.53134 114.725 4.11045L128.862 28.1284C130.569 31.1105 130.325 41.1851 128.212 43.8448L74.8312 103.325C70.5249 108.645 62.6437 109.531 57.1999 105.26C56.4687 104.696 55.8187 104.051 55.2499 103.325L1.78745 43.8448C-0.406302 41.1851 -0.650052 31.0299 1.13745 28.1284L15.2749 4.11045C16.8187 1.53134 19.5812 0 22.5062 0H107.494Z"
                  fill="#3B3B3B"
                  data-v-cbfefb2b
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M98.6375 15.3135C100.994 15.3135 103.106 16.4418 104.244 18.3762L115.294 36.2687C116.675 38.4448 116.431 41.2657 114.725 43.2L72.9625 90.8329C69.55 94.7821 63.4562 95.4269 59.2312 92.2836C58.6625 91.8806 58.175 91.3971 57.6875 90.8329L16.0875 43.2C14.3812 41.1851 14.2187 38.4448 15.5187 36.2687L26.5687 18.3762C27.7062 16.5224 29.9 15.3135 32.175 15.3135H98.6375ZM77.7562 52.6299L67.6 67.1374C67.1125 67.8627 65.2437 68.0239 64.5125 67.4597C64.35 67.3791 64.2687 67.218 64.1062 67.1374L53.1375 52.6299C51.5937 50.5344 48.5062 50.0508 46.3125 51.5821C44.1187 53.0329 43.6312 55.9344 45.175 58.0299L56.1437 72.5374C60.3687 77.6956 63.05 79.7911 65.8937 79.7911C69.0625 79.7911 71.7437 76.2448 74.75 72.5374L85.7187 58.0299C87.2625 55.9344 86.775 53.0329 84.5812 51.5821C82.3875 50.0508 79.3 50.5344 77.7562 52.6299Z"
                  fill="url(#paint0_linear_1_9417)"
                  data-v-cbfefb2b
                />
              </g>
              <defs data-v-cbfefb2b>
                <linearGradient
                  id="paint0_linear_1_9417"
                  x1="65.4231"
                  y1="15.3135"
                  x2="65.4231"
                  y2="94.2758"
                  gradientUnits="userSpaceOnUse"
                  data-v-cbfefb2b
                >
                  <stop stopColor="#FAE59F" data-v-cbfefb2b />
                  <stop offset={1} stopColor="#C4933F" data-v-cbfefb2b />
                </linearGradient>
                <clipPath id="clip0_1_9417" data-v-cbfefb2b>
                  <rect width={130} height={108} fill="white" data-v-cbfefb2b />
                </clipPath>
              </defs>
            </svg>
          </div>
          <span
            className={`text-[11px] font-medium pb-2 ${
              activeItem === "/promotion" ? "active" : "gray-50"
            }`}
          >
            Promotion
          </span>
        </div>
        <div
          className={`flex justify-center items-center flex-col p-2 pb-5 ${
            activeItem === "/wallet" ? "active" : ""
          }`}
          onClick={() => handleClick("wallet")}
        >
          <svg
            data-v-cbfefb2b=""
            className={`size-7 ${
              activeItem === "/wallet" ? "svg-icon" : "svg-icons"
            }`}
          >
            <use href="#icon-wallet"></use>
          </svg>

          <span
            className={`text-[11px] font-medium ${
              activeItem === "/wallet" ? "active" : "gray-50"
            }`}
          >
            Wallet
          </span>
        </div>

        <div
          className={`flex justify-center items-center flex-col p-2 pb-5 ${
            activeItem === "/main" ? "active" : ""
          }`}
          onClick={() => handleClick("main")}
        >
          <svg
            data-v-cbfefb2b=""
            className={`size-7 ${
              activeItem === "/main" ? "svg-icon" : "svg-icons"
            }`}
          >
            <use href="#icon-main"></use>
          </svg>

          <span
            className={`text-[11px] font-medium ${
              activeItem === "/main" ? "active" : "gray-50"
            }`}
          >
            Account
          </span>
        </div>
      </div>
    </>
  );
};

export default Navbar;
