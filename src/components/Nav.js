import { useState } from "react";
import { NavLink } from "react-router-dom";

export function NavBarDown() {
  const [navbar, setNavbar] = useState(false);

  return (
    <nav className="w-full bg-lightgray-300 shadow">
      <div className="justify-center px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
        <div>
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            <div className="md:hidden">
              <button
                className="menubutton p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:block  ${
              navbar ? "block" : "hidden"
            }`}
          >
            <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0 xl:text-lg lg:text-base">
              <li className="text-white hover:text-indigo-200">
                <NavLink
                  exact="true"
                  to={`/home`}
                  style={{ marginRight: "10px" }}
                >
                  Home
                </NavLink>
              </li>

              <li className="text-white hover:text-indigo-200">
                <NavLink
                  exact="true"
                  to={`/aboutus`}
                  style={{ marginRight: "10px" }}
                >
                  Sobre Nós
                </NavLink>
              </li>
              <li className="text-white hover:text-indigo-200">
                <NavLink
                  exact="true"
                  to={`/contact`}
                  style={{ marginRight: "10px" }}
                >
                  Contato
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function NavBarUp() {
  return (
    <div className="sm:justify-center gap-3 flex justify-center w-full my-9">
      <div className=" gap-5 flex flex-col right-3 md:text-base lg:text-lg xl:text-xl">
        <NavLink
          exact="true"
          to={"/login"}
          className="px-4 py-2 text-white bg-gray-600 rounded-md shadow hover:bg-gray-800"
        >
          Entrar
        </NavLink>
        <NavLink
          exact="true"
          to={"/register"}
          className=" self-center px-4 py-2 text-gray-800 bg-white rounded-md shadow hover:bg-gray-100"
        >
          Inscrever-se
        </NavLink>
        <NavLink
          exact="true"
          to={"/search"}
          className="self-end px-4 py-2 text-gray-800 bg-white rounded-md shadow hover:bg-gray-100"
        >
          Pesquisar Projetos
        </NavLink>
      </div>
    </div>
  );
}
