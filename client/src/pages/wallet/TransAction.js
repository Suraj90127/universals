import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  transactionHistory,
  transactionCategory,
} from "../../store/reducer/promotionReducer";
import Calendar from "../../Calender";
import CustomeNavbar from "../../components/CustomeNavbar";
import EmptyData from "../activity/EmptyData";

const Container = styled.div`
  position: fixed;
  width: 25.7rem;
  height: 300px;
  overflow: hidden;
  margin: 0 auto;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Picker = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateY(${(props) => props.translateY}px);
  transition: transform 0.3s ease-out;
  z-index: 2;
  position: relative;
`;

const Item = styled.div`
  height: 40.67px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.active ? "#fff" : "#606877")};
  transition: color 0.3s;
  cursor: pointer;
  font-weight: 700;
`;

const TransAction = () => {
  const { transactionHistoryData, transactionCategoryData } = useSelector(
    (state) => state.promotion
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const pickerRef = useRef(null);
  const [openAll, setOpenAll] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchLevel, setSearchLevel] = useState(null);
  const [dataAll, setDataAll] = useState("All");

  const dispatch = useDispatch();

  const handleOpenAll = () => {
    setOpenAll(!openAll);
  };

  const items = Array.isArray(transactionCategoryData)
    ? transactionCategoryData
    : [];

  const getCategoryName = (item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") {
      return (
        item.name ||
        item.category ||
        item.detail ||
        item.title ||
        item.label ||
        JSON.stringify(item)
      );
    }
    return String(item);
  };

  const handleClick = (index) => {
    setActiveIndex(index);
    const selectedItem = items[index];
    const categoryName = getCategoryName(selectedItem);
    setDataAll(categoryName);

    if (index === 0) {
      setSearchLevel(null);
      dispatch(transactionHistory());
    } else {
      setSearchLevel(categoryName);
      dispatch(transactionHistory(categoryName));
    }

    // ✅ Proper centering logic
    if (pickerRef.current && pickerRef.current.children.length > 0) {
      const itemHeight = pickerRef.current.children[0].clientHeight;
      const containerHeight = 300; // same as Container height
      const centerOffset = containerHeight / 2 - itemHeight / 2;
      const translateY = -index * itemHeight + centerOffset;

      pickerRef.current.style.transform = `translateY(${translateY}px)`;
    }
  };

  useEffect(() => {
    dispatch(transactionHistory());
    dispatch(transactionCategory());
    window.scrollTo(0, 0);
  }, [dispatch]);

  useEffect(() => {
    // Set initial center position
    if (pickerRef.current && pickerRef.current.children.length > 0) {
      const itemHeight = pickerRef.current.children[0].clientHeight;
      const containerHeight = 300;
      const centerOffset = containerHeight / 2 - itemHeight / 2 - 25;
      const translateY = -activeIndex * itemHeight + centerOffset;
      pickerRef.current.style.transform = `translateY(${translateY}px)`;
    }
  }, [activeIndex, items]);

  const filteredData =
    transactionHistoryData?.filter((item) => {
      const itemDate = item?.time?.split(" ")[0];
      const matchesDate =
        selectedDate !== null ? itemDate === selectedDate : true;
      const matchesLevel =
        searchLevel !== null ? item?.detail === searchLevel : true;
      return matchesLevel && matchesDate;
    }) || [];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <CustomeNavbar name="Transaction history" />

      <div className="container-section">
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div
            className="col-span-6 bg-body flex cursor-pointer justify-between items-center p-2 rounded-md"
            onClick={handleOpenAll}
          >
            <span className="text-base gray-50">{dataAll}</span>
            <IoIosArrowDown className="text-base gray-50" />
          </div>
          <div className="col-span-6 bg-body">
            <Calendar
              onDateSelect={handleDateSelect}
              onValueChange={handleDateSelect}
            />
          </div>
        </div>
      </div>

      <div className="container-section mt-5">
        {filteredData.length > 0 ? (
          filteredData.map((item, i) => (
            <div
              className="bg-body rounded-lg mt-3 pb-4 text-gray-200"
              key={i}
            >
              <div className="w-full p-2 color-orange font-medium rounded-t-md blue-linear">
                {item.detail}
              </div>

              <div className="mt-3 flex justify-between items-center rounded-sm mx-2 px-3 py-1 gray-50 text-sm sheet_nav_bg">
                <span className="fs-sm font-medium">Detail</span>
                <span className="fs-sm font-medium">{item.detail}</span>
              </div>

              <div className="mt-1 flex justify-between items-center rounded-sm mx-2 px-3 py-1 gray-50 text-sm sheet_nav_bg">
                <span className="fs-sm font-medium">Time</span>
                <span className="fs-sm font-medium">{item.time}</span>
              </div>

              <div className="mt-1 flex justify-between items-center rounded-sm mx-2 px-3 py-1 gray-50 text-sm sheet_nav_bg">
                <span className="fs-sm font-medium">Balance</span>
                <span className="text-sm font-medium color-green">
                  ₹
                  {Number(item?.balance || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="rounded-md w-[95%] h-16 border border-color-slat m-2 mt-3 ps-2 text-sm overflow-hidden font-medium color-yellow-200">
                {item.type === 0 ? "" : item.type}
              </div>
            </div>
          ))
        ) : (
          <EmptyData />
        )}
      </div>

      {/* Filter bottom */}
      {openAll && <div className="overlay-section block"></div>}
      {openAll && (
        <Container className="bg-body rounded-t-xl filter-section z-[20]">
          <div className="bg-body rounded-t-xl flex justify-between p-2 px-3 relative z-10">
            <button className="gray-50" onClick={handleOpenAll}>
              Cancel
            </button>
            <button className="text-blue" onClick={handleOpenAll}>
              Confirm
            </button>
          </div>
          <Picker ref={pickerRef} translateY={-(activeIndex * 66.67)}>
            {items.map((item, index) => (
              <Item
                className="text-sm"
                key={index}
                active={index === activeIndex}
                onClick={() => handleClick(index)}
              >
                {getCategoryName(item)}
              </Item>
            ))}
          </Picker>
          <div className="picker-botom-hilight"></div>
        </Container>
      )}
    </>
  );
};

export default TransAction;










