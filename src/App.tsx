import React, { FC, createContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { history } from "./utils/history";
import logo from "./logo.svg";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./containers/home";
import Profile from "./containers/profile";
import Sidebar from "./components/sidebar";

import WalletContextProvider from "./components/WalletContextProvider";

import "./App.css";

declare global {
  interface LanguageType {
    language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>;
  } // sample code include set function
}

export type SolanaNetworkType = "mainnet-beta" | "devnet";

export const LanguageContext = createContext<LanguageType>({
  language: "english",
  setLanguage: () => {},
});

const App = () => {
  const [language, setLanguage] = useState("english");
  const [solanaNetwork] = useState<SolanaNetworkType>("devnet");

  return (
    <WalletContextProvider solanaNetwork={solanaNetwork}>
      <LanguageContext.Provider
        value={{ language: language, setLanguage: setLanguage }}
      >
        <BrowserRouter>
          <div className="w-full flex bg-[#1E1E1E] font-['Roboto'] text-[#FFFFFF]">
            <Sidebar />
            <div className="ml-[220px] w-[calc(100vw-220px)] overflow-auto">
              <Header solanaNetwork={solanaNetwork} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
              <ToastContainer />
            </div>
          </div>
        </BrowserRouter>
      </LanguageContext.Provider>
    </WalletContextProvider>
  );
};

export default App;
