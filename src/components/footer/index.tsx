import React, {
  Component,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import useWindowSize from "../../utils/useWindowSize";
import useOutsideClick from "../../utils/useOutsideClick";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const size = useWindowSize();

  useEffect(() => {
    if (size.width < 1024) setIsMobile(true);
    else setIsMobile(false);
  }, [size]);

  return (
    <div className="w-full bg-[#7C98A9]">
      <div className="w-[85vw] h-[77px] m-auto text-[#FFFFFF] flex justify-between items-center">
        <div className="font-['Roboto'] font-[800] text-[26px] leading-[30px]">
          Copyright © 2022
        </div>
        <div className="font-['Roboto'] font-[800] text-[26px] leading-[30px]">
          Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default Footer;
