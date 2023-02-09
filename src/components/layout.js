import React from "react";
import Footer from "./Footer";
import sitebg from "../images/sitebg.jpg";
import { NavBarUp } from "./Nav";

export function Layout({ children }) {
  return (
    <>
      <div className="rightBar xs: md:  bg-no-repeat bg-center bg-cover font-mono flex flex-col sm:flex-row justify-center items-center sm:gap-y-4 z-5">
        <div className="sm:w-4/6 flex flex-col xs: md:-NOT ">
          <img className="reponsiveImage" src={sitebg} />
        </div>

        <div className="rightBar default-blue justify-center align-middle items-center /* xs: md:  */ sm:w-2/6 w-full flex flex-col">
          <NavBarUp />
          {children}
        </div>
      </div>
    </>
  );
}
