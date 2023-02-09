import React from "react";
import { NavBarDown, NavBarUp } from "./Nav";
export default function Header() {
  return (
    <header className=" w-full my-6 font-extrabold flex justify-center items-center flex-col top-0 text-white underline z-90">
      <NavBarUp />
      <h1 className="logo md:text-5xl lg:text-6xl xl:text-7xl sm:text-8xl text-5xl">
        Geo&#127758;ne
      </h1>
      {/*  <h1 className="logo md:text-5xl xl:text-8xl lg:text-7xl sm:text-9xl text-6xl">
        Geo&#127758;ne
      </h1> */}
      <NavBarDown />
    </header>
  );
}
