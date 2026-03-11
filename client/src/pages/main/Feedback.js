import React, { useEffect } from "react";

import FeedbackImg from "../../assets/feedbackImg.png";
import CustomeNavbar from "../../components/CustomeNavbar";
const Feedback = () => {
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])
  return (
    <>
      <CustomeNavbar name="Feedback"/>

      <div className="container-section mt-5">
        <div className="bg-body">
          <textarea
            name=""
            id=""
            className="w-full h-52 p-4 gray-text fs-sm bg-transparent focus:outline-none placeholder:text-gray-text rounded-md"
            placeholder="Welcome to feedback, please give feedback-please describe the problem in detail when providing feedback, preferably attach a screenshot of the problme you accountered, we will immediately process your feddback!"
          ></textarea>
        </div>
        <div className="mt-10 flex flex-col justify-center items-center">
          <p className="text-sm text-whites font-medium">
            Send helpful feedback
          </p>
          <p className="text-sm text-whites font-medium">
            Chance to win Mystery Rewards
          </p>
          <img src={FeedbackImg} alt="" className="w-52 my-5" />

          <button className="blue-linear flex justify-center color-orange text-lg  w-full  m-auto font-medium text-center  rounded-full p-2 mt-5 ">
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Feedback;
