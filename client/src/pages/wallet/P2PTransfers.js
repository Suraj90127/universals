import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CustomeNavbar from "../../components/CustomeNavbar";
import { useDispatch, useSelector } from "react-redux";
import { getP2PByPhone, getP2PByTransfer, p2p } from "../../store/reducer/userReducer";

const P2PTransfers = () => {
    const {p2ploader, loader, P2PByTransferData, P2PByPhoneData } = useSelector((state) => state.user)
    console.log("loading",p2ploader);
    
    const [activeTab, setActiveTab] = useState("sent");
    const [transactions, setTransactions] = useState([]);

    const [phone, setPhone] = useState("9876543210"); // Replace with auth user phone
    const [money, setMoney] = useState("");
    const [userId, setUserId] = useState("");
    const [message, setMessage] = useState("Please enter both amount and user ID");
    const [messages, setMessages] = useState("");
    const [Alert, setAlert] = useState(false)
    const dispatch = useDispatch()
    // Fetch transactions

    const totalAmount = P2PByTransferData?.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalAmount2 = P2PByPhoneData?.reduce((sum, item) => sum + Number(item.amount || 0), 0);



    const debouncedDispatch = useCallback(
        () => {
            dispatch(getP2PByPhone());
        },
        [dispatch]
    );
    const debouncedTransfer = useCallback(() => {
        dispatch(getP2PByTransfer());
    },
        [dispatch]
    );
    // Handle money transfer
    const handleTransfer = async (e) => {
        e.preventDefault();
        if (!money || !userId) {
            setMessages("Please enter both amount and user ID");
            return;
        }
           dispatch(p2p({money,userId})).then((res) => {
                console.log("money",money)
           setAlert(true);
                if (res.payload.status) {
                    setMessages(res.payload.message);
                   

                    setMoney("");
                    setUserId("");


                } else {
                    setMessages(res.payload.message || "Transfer failed");
                }
                setTimeout(() => {
                 
                      setAlert(false)
                }, 3000);
                // setTimeout(() => {
                //       setMessages("");
                // }, 4000);
            });

    };
useEffect(() => {
  debouncedTransfer(dispatch)
}, [])

    
    useEffect(() => {

   if(activeTab==="sent"){
         debouncedDispatch(dispatch);
   }
    }, [activeTab, debouncedDispatch, Alert]);

    return (
        <>
            <CustomeNavbar name="P2P Transfer" />
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-3 text-center text-white">💸 P2P Money Transfer</h1>

                {/* Transfer Form */}
                <div className="nav-bg text-white  rounded-md p-6 mb-4">
                    <h2 className="text-xl font-semibold mb-4">Send Money</h2>
                    {/* {message && (
                        <p className="mb-4 text-sm text-center text-white blue-linear py-1 rounded">
                            {message}
                        </p>
                    )} */}
   {/* === Transfer Summary === */}
  <div className="nav-bg text-white  rounded-2xl  mb-6">
    <div className="flex flex-col md:flex-row justify-around items-center gap-4">
      <div className="text-center p-4 bg-[#2e2e2e] rounded-md w-full md:w-1/2">
        <h4 className="text-2xl font-semibold text-blue-400">₹{totalAmount2||0}</h4>
        <p className="fs-sm text-gray-300 mt-1">Total Transfer Amount</p>
      </div>
      <div className="text-center p-4 bg-[#2e2e2e] rounded-md w-full md:w-1/2">
        <h4 className="text-2xl font-semibold text-green-400">₹{totalAmount||0}</h4>
        <p className="fs-sm text-gray-300 mt-1">Total Received Amount</p>
      </div>
    </div>
  </div>

                    <form onSubmit={handleTransfer} className="flex flex-col gap-4 md:flex-row md:items-end">
                        <div className="flex-1 flex flex-col">
                            <label className="mb-1 font-medium">Amount</label>
                            <input
                                type="number"
                                className="w-full mt-2 bgs-body border border-[--bgbody]  rounded-md p-2 focus:[var(--grey-100)] ps-6 flex items-center focus:border focus:outline-none  placeholder:text-sm  placeholder:text-[var(--grey-200)] placeholder:font-medium"
                                placeholder="Amount"
                                value={money}
                                onChange={(e) => setMoney(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label className="mb-1 font-medium">User ID</label>
                            <input
                                type="text"
                                className="w-full mt-2 bgs-body border border-[--bgbody]  rounded-md p-2 focus:[var(--grey-100)] ps-6 flex items-center focus:border focus:outline-none  placeholder:text-sm  placeholder:text-[var(--grey-200)] placeholder:font-medium"
                                placeholder="User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                            />
                        </div>
                       
                        <button
                        disabled={p2ploader}
                            type="submit"
                            className="blue-linear text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                          {p2ploader?"Loading":"Send"}  
                        </button>
                    </form>
                </div>

                {/* Tabs */}
                <div className="flex mb-4">
                    <button
                        onClick={() => setActiveTab("sent")}
                        className={`flex-1 text-white py-2 rounded-t-md ${activeTab === "sent" ? "blue-linear text-white" : "nav-bg"
                            }`}
                    >
                        Sent
                    </button>
                    <button
                        onClick={() => {setActiveTab("received");debouncedTransfer()}}
                        className={`flex-1 text-white py-2 rounded-t-md ${activeTab === "received" ? "blue-linear text-white" : "nav-bg"
                            }`}
                    >
                        Received
                    </button>
                </div>

                {/* Transaction Table */}
                <div className="text-white p-4 rounded-b-lg nav-bg shadow">

                {activeTab==="sent"?(
                    ( P2PByPhoneData?.length === 0||P2PByPhoneData===null) ? (
                        <p>No {activeTab} transactions found.</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-sm">
                                    {/* <th className="border border-gray-500 p-2">ID</th> */}
                                    <th className="border border-gray-500 p-2 text-center">{activeTab === "sent" ? "To" : "From"}</th>
                                    <th className="border border-gray-500 p-2  text-center">Amount</th>
                                    <th className="border border-gray-500 p-2 text-center">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {P2PByPhoneData &&P2PByPhoneData?.map((t) => (
                                    <tr key={t.id} className="fs-sm">
                                        {/* <td className="border border-gray-500 p-2">{t.id}</td> */}
                                        <td className="border border-gray-500 p-2 text-center">
                                           { t.transferId}
                                        </td>
                                        <td className="border border-gray-500 p-2 text-center">{t.amount}</td>
                                        <td className="border border-gray-500 p-2 text-center">{t.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                ):(
                    // trasfer
                   (P2PByTransferData?.length === 0|| P2PByTransferData===null) ? (
                        <p>No {activeTab} transactions found.</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-sm">
                                    {/* <th className="border border-gray-500 p-2">ID</th> */}
                                    <th className="border border-gray-500 p-2 text-center">{activeTab === "sent" ? "To" : "From"}</th>
                                    <th className="border border-gray-500 p-2 text-center">Amount</th>
                                    <th className="border border-gray-500 p-2 text-center">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {P2PByTransferData &&P2PByTransferData?.map((t) => (
                                    <tr key={t.id} className="fs-sm">
                                        {/* <td className="border border-gray-500 p-2">{t.id}</td> */}
                                        <td className="border border-gray-500 p-2 text-center">
                                            {t.userId}
                                        </td>
                                        <td className="border border-gray-500 p-2 text-center">{t.amount}</td>
                                        <td className="border  border-gray-500 p-2 text-center">{t.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )  
                )}
                </div>
            </div>
            <div className={`place-bet-popup ${Alert ? "active" : ""}`}>
                <div className="text-sm">{messages} </div>
            </div>
        </>
    );
};

export default P2PTransfers;
