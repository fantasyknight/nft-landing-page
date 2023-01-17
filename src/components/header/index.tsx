import React, {
  Component,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useWindowSize from "../../utils/useWindowSize";
import useOutsideClick from "../../utils/useOutsideClick";
import { LanguageContext } from "../../App";
import { toast } from "react-toastify";

import { SolanaNetworkType } from "../../App";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { shortenAddress } from "../../utils/general";

interface HeaderProps {
  solanaNetwork: SolanaNetworkType;
}

const Header = ({ solanaNetwork }: HeaderProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileClicked, setMobileClicked] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [langNum, setLangNum] = useState(0);
  const { language, setLanguage } = useContext(LanguageContext);
  const location = useLocation();
  const navigate = useNavigate();
  const size = useWindowSize();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const wallet = useWallet();

  useEffect(() => {
    if (wallet.publicKey) {
      setIsWalletConnected(true);
    } else {
      setIsWalletConnected(false);
    }
  }, [wallet]);

  useEffect(() => {
    if (isWalletConnected) {
      toast("Wallet connected!");
    } else {
      toast("Wallet disconnected!");
    }
  }, [isWalletConnected]);

  const renderWalletButton = () => {
    return <WalletMultiButton className="bg-secondary hover:bg-[#15539a]" />;
  };

  const mobileMenuHandler = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  const renderMobileMenuButton = () => {
    return (
      <button
        type="button"
        className="text-4xl text-secondary sm:hidden"
        onClick={mobileMenuHandler}
      >
        {isMobileMenuOpen ? (
          <i className="bi bi-x-lg" />
        ) : (
          <i className="bi bi-list" />
        )}
      </button>
    );
  };

  useEffect(() => {
    if (size.width < 1024) setIsMobile(true);
    else setIsMobile(false);
  }, [size]);

  useEffect(() => {
    if (mobileClicked) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [mobileClicked]);

  const ref = useRef<HTMLHeadingElement>(null);
  useOutsideClick(ref, () => {
    if (mobileClicked) {
      setMobileClicked(false);
    }
  });

  const ref2 = useRef<HTMLHeadingElement>(null);
  useOutsideClick(ref2, () => {
    if (languageOpen) {
      setLanguageOpen(false);
    }
  });

  return (
    <div className="relative" ref={ref}>
      <div className="fixed top-0 px-[48px] w-[calc(100vw-220px)] h-[83px] bg-[#141414] flex flex-row items-center justify-between z-10">
        <div
          className="flex flex-row cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <div className="bg-hidden bg-cover bg-center w-[30px] h-[30px]" />
        </div>
        <div className="flex items-center">
          <div className="bg-user bg-cover w-[32px] h-[32px] mr-[33px] cursor-pointer"></div>
          {renderWalletButton()}
        </div>
      </div>
    </div>
  );
};

export default Header;
