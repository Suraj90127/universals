import React, { useEffect } from "react";
import "./activity.css";
import Layout from "../../layout/Layout";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";

const InvitationImg = "https://i.ibb.co/60fp56NM/activity-Reward.png";
const bettingImg = 'https://i.ibb.co/Kz8vtWT/Betting-Rebate.png"';
const SupperImg = "https://i.ibb.co/1MbggqG/super-Jackpot.png";
const MemberGiftImg = "https://i.ibb.co/Hg13hYF/member-Gift.png";

const GiftImg = "https://i.ibb.co/GkJh6My/sign-In-Banner.png";
const AttendanceImg = "https://i.ibb.co/PCm07tj/gift-Redeem.png";

const Activity = () => {
  const { loader, bannergetData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Layout>
      <div className="flex justify-center nav-bg sticky top-0">
        <img
          src={bannergetData?.gameall?.logo1}
          alt=""
          loading="lazy"
          className="w-36"
        />
      </div>

      {loader && <Loader />}
      <div className="bg-body p-5">
        <h3 className="heading-h3 font-medium mb-2 text-white">Activity</h3>
        <p className="fs-sm pb-1 text-white">
          Please remember to follow the event page
        </p>
        <p className="fs-sm text-white">
          We will launch user feedback activities from to time
        </p>
      </div>
      <div className="container-section mt-3">
        <div className="flex justify-around items-center">
          <div
            className=" flex flex-col justify-center items-center "
            onClick={() => navigate("/main/InvitationBonus")}
          >
            <img src={InvitationImg} alt="" loading="lazy" className="w-10" />
            <p className="fs-sm gray-50 text-center leading-3 mt-2">
              Invitation <br /> Bonus
            </p>
          </div>

          <div
            className=" flex flex-col justify-center items-center"
            onClick={() => navigate("/main/Laundry")}
          >
            <img src={bettingImg} alt="" loading="lazy" className="w-10" />
            <p className="fs-sm gray-50 text-center leading-3 mt-2">
              Betting <br /> rebate
            </p>
          </div>
          <div
            className=" flex flex-col justify-center items-center"
            onClick={() => navigate("/main/SuperJackpot")}
          >
            <img src={SupperImg} alt="" loading="lazy" className="w-10" />
            <p className="fs-sm gray-50 text-center leading-3 mt-2">
              Super
              <br />
              Jackpot
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 mt-5">
          <div
            className="col-span-6 bg-body rounded-md"
            onClick={() => navigate("/main/RedeemGift")}
          >
            <img src={GiftImg} alt="" loading="lazy" />
            <div className="p-2 mb-3">
              <h3 className="heading-h3 text-white mb-1 text-base font-bold">
                Gift
              </h3>
              <p className="gray-50 fs-sm">
                Enter the redemption code to recieve gift rewards
              </p>
            </div>
          </div>
          <div
            className="col-span-6 bg-body rounded-md"
            onClick={() => navigate("/activity/DailySignIn")}
          >
            <img src={AttendanceImg} alt="" loading="lazy" />
            <div className="p-2 mb-3">
              <h3 className="heading-h3 text-white mb-1 text-base font-bold">
                Attendance bonus
              </h3>
              <p className="gray-50 fs-sm">
                The more consecutive days you sign in, the higher the reward
                will be.
              </p>
            </div>
          </div>
        </div>

        <div
          className="bg-body mt-3 rounded-xl"
          onClick={() => navigate("/activity/DepositBouns")}
        >
          <img
            src={bannergetData?.activity?.ban1}
            alt=""
            loading="lazy"
            className="rounded-t-xl h-44 w-full"
          />
          <h3 className="heading-h3 gray-text font-bold p-2">Recharge bonus</h3>
        </div>

        <div
          className="bg-body mt-3 rounded-xl"
          onClick={() => navigate("/activity/ActivityDetail?id=2")}
        >
          <img
            src={bannergetData?.activity?.ban2}
            alt=""
            loading="lazy"
            className="rounded-t-xl h-44 w-full"
          />
          <h3 className="heading-h3 gray-text font-bold p-2">VIP bonus</h3>
        </div>
        <div
          className="bg-body mt-3 rounded-xl"
          onClick={() => navigate("/activity/ActivityDetail?id=3")}
        >
          <img
            src={bannergetData?.activity?.ban3}
            alt=""
            loading="lazy"
            className="rounded-t-xl h-44 w-full"
          />
          <h3 className="heading-h3 gray-text font-bold p-2">Winning Streak</h3>
        </div>
        <div
          className="bg-body mt-3 rounded-xl"
          onClick={() => navigate("/activity/ActivityDetail?id=4")}
        >
          <img
            src={bannergetData?.activity?.ban4}
            alt=""
            loading="lazy"
            className="rounded-t-xl h-44 w-full"
          />
          <h3 className="heading-h3 gray-text font-bold p-2">
            AVIATOR ADDITIONAL BONUS
          </h3>
        </div>
        <div
          className="bg-body mt-3 rounded-xl"
          onClick={() => navigate("/activity/ActivityDetail?id=5")}
        >
          <img
            src={bannergetData?.activity?.ban5}
            alt=""
            loading="lazy"
            className="rounded-t-xl h-44 w-full"
          />
          <h3 className="heading-h3 gray-text font-bold p-2">Loss bonus</h3>
        </div>
        <div
          className="bg-body mt-3 rounded-xl"
          onClick={() => navigate("/activity/ActivityDetail?id=6")}
        >
          <img
            src={bannergetData?.activity?.ban6}
            alt=""
            loading="lazy"
            className="rounded-t-xl h-44 w-full"
          />
          <h3 className="heading-h3 gray-text font-bold p-2">Lucky 10 Days</h3>
        </div>
        <div
          className="bg-body mt-3 rounded-xl"
          onClick={() => navigate("/activity/ActivityDetail?id=7")}
        >
          <img
            src={bannergetData?.activity?.ban7}
            alt=""
            loading="lazy"
            className="rounded-t-xl h-44 w-full"
          />
          <h3 className="heading-h3 gray-text font-bold p-2">
            PARTNER REWARDS BONUS
          </h3>
        </div>

        <div
          className="bg-body mt-3 rounded-xl"
          onClick={() => navigate("/activity/ActivityDetail?id=8")}
        >
          <img
            src={bannergetData?.activity?.ban8}
            alt=""
            loading="lazy"
            className="rounded-t-xl h-44 w-full"
          />
          <h3 className="heading-h3 gray-text font-bold p-2">
            VIDEO CONTENT BONUS
          </h3>
        </div>

        <div
          className="bg-body mt-3 rounded-xl"
          onClick={() => navigate("/activity/ActivityDetail?id=9")}
        >
          <img
            src={bannergetData?.activity?.ban9}
            alt=""
            loading="lazy"
            className="rounded-t-xl h-44 w-full"
          />
          <h3 className="heading-h3 gray-text font-bold p-2">
            WEEKLY DEPOSIT BONUS FOR AGENT
          </h3>
        </div>

        <div
          className="bg-body mt-3 rounded-xl"
          onClick={() => navigate("/activity/ActivityDetail?id=10")}
        >
          <img
            src={"https://res.cloudinary.com/dnawxpdib/image/upload/v1773468965/comm_pesxsp.jpg"}
            alt=""
            loading="lazy"
            className="rounded-t-xl h-44 w-full"
          />
          <h3 className="heading-h3 gray-text font-bold p-2">
            Commission Chart
          </h3>
        </div>
      </div>
    </Layout>
  );
};

export default Activity;
