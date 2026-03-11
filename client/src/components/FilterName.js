import React, { useRef, useState } from "react";
import styled from "styled-components";

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
  top: 33%;
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

const FilterName = ({ items, onActiveChange, openAll, setOpenAll }) => {
  const pickerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index) => {
    setActiveIndex(index);

    const selectedItem = items[index];

    if (onActiveChange) {
      onActiveChange(selectedItem.name, selectedItem.level);
    }

    if (pickerRef.current) {
      const itemHeight = pickerRef.current.children[0].clientHeight;
      const translateY =
        -(index * itemHeight) +
        pickerRef.current.clientHeight / 1.2 -
        itemHeight / 1.2;
      pickerRef.current.style.transform = `translateY(${translateY}px)`;
    }
  };

  const handleConfirm = () => {
    setOpenAll(false);
  };

  const handleCancel = () => {
    setOpenAll(false);
  };

  return (
    <>
      <div className={openAll ? "overlay-section block" : "hidden"}></div>
      <div className={openAll ? "block" : "hidden"}>
        <Container className="bg-body rounded-t-xl filter-section z-20">
          <div className="sheet_nav_bg rounded-t-xl flex justify-between p-2 px-3 relative z-10">
            <button className="text-white" onClick={handleCancel}>
              Cancel
            </button>
            <button className="text-blue" onClick={handleConfirm}>
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
                {item.name}
              </Item>
            ))}
          </Picker>
          <div className="picker-botom-hilight"></div>
        </Container>
      </div>
    </>
  );
};

export default FilterName;
