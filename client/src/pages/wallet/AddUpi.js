import React, { useEffect, useState } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BsBank2 } from "react-icons/bs";
import { FaMobileAlt, FaUser } from "react-icons/fa";
import { HiKey } from "react-icons/hi";
import { MdOutlineCreditCard, MdVerifiedUser } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { addBank, addupi } from "../../store/reducer/userReducer";
import CustomeNavbar from "../../components/CustomeNavbar";
import { useNavigate } from "react-router-dom";

const AddUpi = () => {
  // const { successMessage } = useSelector((state) => state.user);
  const [alerts, setAlerts] = useState(false);
  const [open, setOpne] = useState(false);
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState('')
  const [countdown, setCountdown] = useState(0);
  const [state, setState] = useState({
    name_bank: "0",
    name_user: "",
    upi: "", ////account number
    email: "0", // ifsc code
    tinh: "", //phone number
    sdt: "0", //usdt
    otp: "0",
    cupi: ""
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const dispatch = useDispatch();
  const handleSubmit = async () => {
    if(state.upi !== state.cupi){
      setAlerts(true);
      setSuccessMessage("UPI ID and Confirm UPI ID do not match");
      return;
    }
    dispatch(addupi(state)).then((res) => {
      setAlerts(true);
      setSuccessMessage(res.payload.message);
      setTimeout(() => {
        if (res.payload.status) {
          navigate("/wallet/Withdraw")
        }
        setAlerts(false);
      }, 2000);
    });
  };


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])



  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); // Clean up
    }
  }, [countdown]);
  return (
    <>
      <CustomeNavbar name="Add Bank" />
      <div className="container-section">
          <div className="">
          <div className="flex items-center ">
            <span>
             <img src="https://res.cloudinary.com/deicpupph/image/upload/v1769508973/R_movpit.png" alt="upi" className="w-14 h-5"/>
            </span>
          <p className="text-lg font-semibold ms-2 text-white">
            Information UPI
          </p>
          </div>
        </div>

       
        <div className="mt-7">
          <div className="flex ">
           
            <p className="text-sm text-white">UPI Name</p>
          </div>
          <input
            type="text"
            className="w-full mt-2 bg-body rounded-md p-2 focus:border-slate-700 ps-6 flex items-center focus:border focus:outline-none  placeholder:text-sm placeholder:text-slate-500"
            placeholder="Please enter the recipient's name"
            name="name_user"
            onChange={inputHandle}
            value={state.name_user}
          />
        </div>
         <div className="mt-7">
          <div className="flex ">
           
            <p className="text-sm text-white">Phone number</p>
          </div>
          <input
            type="number"
            className="w-full mt-2 bg-body rounded-md p-2 focus:border-slate-700 ps-6 flex items-center focus:border focus:outline-none  placeholder:text-sm placeholder:text-slate-500 placeholder:font-bold"
            placeholder="Please enter the phone number"
            name="tinh"
            onChange={inputHandle}
            value={state.tinh}
          />
        </div>
        <div>
           <div className="flex mt-2">
          <span>
            <AiOutlineExclamationCircle className="color-red-200 text-lg" />
          </span>
          <p className="text-[10px] ms-2 leading-4  text-yellow-700">
            For the security of your account, please fill in your real mobile phone number
          </p>
        </div>
        </div>
        <div className="mt-7">
          <div className="flex ">
          
            <p className="text-sm text-white">UPI ID</p>
          </div>
          <input
            type="text"
            className="w-full mt-2 bg-body rounded-md p-2 focus:border-slate-700 ps-6 flex items-center focus:border focus:outline-none  placeholder:text-sm placeholder:text-slate-500"
            placeholder="Please enter your UPI ID"
            name="upi"
            onChange={inputHandle}
            value={state.upi}
          />
        </div>
       
        <div className="mt-7">
          <div className="flex ">
        
            <p className="text-sm text-white">Confirm UPI ID</p>
          </div>
          <input
            type="text"
            className="w-full mt-2 bg-body rounded-md p-2 focus:border-slate-700 ps-6 flex items-center focus:border focus:outline-none  placeholder:text-sm placeholder:text-slate-500"
            placeholder="Please enter your UPI ID"
            name="cupi"
            onChange={inputHandle}
            value={state.cupi}
          />
        </div>
      
        <button
          className="blue-linear text-white w-full rounded-full p-2 mt-4"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>

      <div className={`place-bet-popup ${alerts ? "active" : ""}`}>
        <div className="text-sm">{successMessage} </div>
      </div>
    </>
  );
};

export default AddUpi;
