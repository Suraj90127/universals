

import React from "react";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const TelegramPage = () => {
  const navigate = useNavigate();

  const { bannergetData } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.auth);

  console.log("userInfo",userInfo);
  

  const telegramLinks = [
    {
      name: "Official Telegram",
      link: "https://t.me/UniversalGameIndiaOfficial",
    },
    {
      name: "Teacher Telegram",
      link: "https://t.me/OfficialGameAgent",
    },
    {
      name: "Bot",
      link: "",
    },
  ];

  const openTelegram = (link) => {
    if (link && link.trim() !== "") {
      window.open(link, "_blank");
    }
  };

  return (
    <Layout>
      {/* HEADER */}
      <div className="sticky top-0 z-20 top_bg">
        <div className="flex items-center justify-between px-3 py-2">

          {/* Logo */}
          <div
            className="logo cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={bannergetData?.gameall?.logo}
              alt="logo"
              className="w-[100px]"
            />
          </div>

          {/* Notification */}
          <div
            className="relative text-white cursor-pointer"
            onClick={() => navigate("/home/Messages")}
          >
            <svg className="svg-icon icon-notification w-8 h-8">
              <use xlinkHref="#icon-notification" />
            </svg>

            <div className="absolute top-0.5 right-2">
              <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75 animate-ping"></span>
              <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-600"></span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container-section py-5">
        <h2 className="text-center text-white text-xl font-bold mb-5">
          Join Our Telegram
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {telegramLinks.map((item, index) => {
            const isAvailable = item.link && item.link.trim() !== "";

            return (
              <div
                key={index}
                onClick={() => isAvailable && openTelegram(item.link)}
                onKeyDown={(e) =>
                  e.key === "Enter" && isAvailable && openTelegram(item.link)
                }
                tabIndex={isAvailable ? 0 : -1}
                className={`flex items-center justify-between bg-[#1e1e2d] p-4 rounded-xl border border-[#2a2a3c] transition ${
                  isAvailable
                    ? "cursor-pointer hover:bg-[#252538]"
                    : "cursor-not-allowed opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/telegram.png"
                    alt="telegram"
                    className="w-10"
                  />

                  <span className="text-white text-sm font-semibold">
                    {item.name}
                  </span>
                </div>

                <button
                  className="blue-linear px-4 py-1 rounded-full text-black text-sm"
                  disabled={!isAvailable}
                  type="button"
                >
                  {isAvailable ? "Join" : "Unavailable"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default TelegramPage;