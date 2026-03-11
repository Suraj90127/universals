import React, { useEffect, useState } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

import { MdDashboard } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { addusdt } from "../../store/reducer/userReducer";
import CustomeNavbar from "../../components/CustomeNavbar";
import { useNavigate } from "react-router-dom";
import FilterName from "../../components/FilterName";

const AddUSDT = () => {
  const [alerts, setAlerts] = useState(false);
  const [successMessage, setsuccessMessage] = useState("");
  const [open, setOpne] = useState(false);
  const navigate = useNavigate();
  const [state, setState] = useState({
    sdt: "",
    remarkType: "",
  });
  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const dispatch = useDispatch();
  const handleSubmit = async () => {
    dispatch(addusdt(state)).then((res) => {
      setAlerts(true);
      setsuccessMessage(res.payload.message);
      setTimeout(() => {
        if (res.payload.status) {
          navigate("/wallet/Withdraw");
        }
        setsuccessMessage("");
        setAlerts(false);
      }, 2000);
    });
  };

  const handleTogle = () => {
    setOpne(!open);
  };

  const items = [{ name: "BEP20", icon: <MdDashboard /> }];

  const handleFilterChange = (name) => {
    console.log("Selected Active Name:", name);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <CustomeNavbar name="Add USDT Address" />
      <div className="container-section">
        <div className="flex items-center p-1 px-3 rounded-full bg-body mt-2">
          <span>
            <AiOutlineExclamationCircle className="color-red-200 text-lg" />
          </span>
          <p className="text-sm ms-2 leading-4  color-red-200">
            To ensure the safety of your founds, please link your wallet
          </p>
        </div>

        <FilterName
          items={items}
          onActiveChange={handleFilterChange}
          openAll={open}
          setOpenAll={setOpne}
        />

        <div className="mt-7">
          <div className="flex ">
            <span>
              <svg data-v-24736190 className="svg-icon icon-usdt1 icon icon">
                <use xlinkHref="#icon-usdt1" />
              </svg>
            </span>
            <p className="text-sm text-whites">Select main network</p>
          </div>
          <input
            type="text"
            className="w-full mt-2 bg-body  text-whites white-color rounded-md p-2 focus:border-slate-700 ps-6 flex items-center focus:border focus:outline-none cursor-pointer   placeholder:text-sm placeholder:text-slate-500"
            placeholder="BEP20"
            name="name_bank"
            value="BEP20"
            onClick={handleTogle}
          />
        </div>
        <div className="mt-7">
          <div className="flex ">
            <span>
              <svg data-v-24736190 className="svg-icon icon-usdt2 icon icon">
                <use xlinkHref="#icon-usdt2" />
              </svg>
            </span>
            <p className="text-sm text-whites">USDT Address</p>
          </div>
          <input
            type="text"
            className="w-full mt-2 bg-body  rounded-md p-2 focus:border-slate-700 ps-6 flex items-center focus:border focus:outline-none  placeholder:text-sm placeholder:text-slate-500"
            placeholder="Please enter the USDT address"
            name="sdt"
            onChange={inputHandle}
            value={state.sdt}
          />
        </div>
        <div className="mt-7">
          <div className="flex ">
            <span>
              <svg data-v-24736190 className="svg-icon icon-usdt3 icon icon">
                <use xlinkHref="#icon-usdt3" />
              </svg>
            </span>
            <p className="text-sm text-whites">Address Alias</p>
          </div>
          <input
            type="text"
            className="w-full mt-2 bg-body rounded-md p-2 focus:border-slate-700 ps-6 flex items-center focus:border focus:outline-none  placeholder:text-sm placeholder:text-slate-500"
            placeholder="Please enter a remark of the withdrawal address"
            name="remarkType"
            onChange={inputHandle}
            value={state.remarkType}
          />
        </div>

        <button
          className={
            state?.sdt?.length > 0
              ? "blue-linear text-white w-full rounded-full p-2 mt-14"
              : "bg-[#cacada] text-white w-full rounded-full p-2 mt-14"
          }
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

export default AddUSDT;
