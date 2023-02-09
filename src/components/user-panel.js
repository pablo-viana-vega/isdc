import Footer from "./Footer";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../utils";
import { NavLink } from "react-router-dom";

export default function UserPanel({ children }) {
  const [response, setResponse] = useState({});
  const [action, setAction] = useState("");
  const [hasProject, setHasProject] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [active, setActive] = useState("");
  /*  const [project, setProject] = useState(null); */

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .post(`${apiUrl}/api/projects/get`, {
        user_id: localStorage.getItem("logged_id"),
      })
      .then((response) => {
        if (response.data.status === 1) {
          setHasProject(true);
          setProjects(response.data.project);
          localStorage.setItem(
            "projects",
            JSON.stringify(response.data.project)
          );
          console.log(response);
        } else {
          console.log(response);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .post(`${apiUrl}/api/projects/get`, {
        user_id: 0,
      })
      .then((response) => {
        if (response.data.status === 1) {
          setHasProject(true);
          setProjects(response.data.project);
          localStorage.setItem(
            "projectsAll",
            JSON.stringify(response.data.project)
          );
          console.log(response);
        } else {
          localStorage.setItem("projectsAll", null);
          console.log(response);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .post(`${apiUrl}/api/projects/get`, {
        all: true,
      })
      .then((response) => {
        if (response.data.status === 1) {
          setHasProject(true);
          //setAll(response.data.project);
          localStorage.setItem("all", JSON.stringify(response.data.project));
          console.log(response);
        } else {
          localStorage.setItem("all", null);
          console.log(response);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [userType, setUserType] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("logged_id");
    const user_type = localStorage.getItem("user_type");
    if (id) {
      axios
        .post(`${apiUrl}/api/user/get`, id)
        .then((response) => {
          setResponse(response.data);
          setUserType(user_type);
          setActive(response.data.user_data.active);
          console.log(response.data);
          console.log(active);
          localStorage.setItem(
            "user_data",
            JSON.stringify(response.data.user_data)
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      window.location.href = "/home";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("logged_id");
    localStorage.removeItem("projects");
    localStorage.removeItem("user_type");
    localStorage.removeItem("projectsAll");
    localStorage.removeItem("user_data");
    window.location.href = "/home";
  };

  /* if (!id || id === undefined || id === null) {
    window.location.href = "/home";
  } else {
    axios
      .post("apiUrl/api/user/get", {
        id:id,
      })
      .then((response) => {
        setResponse(response.data);
        console.log(response)
      })
      .catch((error) => {
        // handle error
      });
  } */
  //const [panel, setPanel] = useState("");
  return (
    <>
      {active === "no" && (
        <h2 className="text-xl text-green-600 font-semibold text-center w-full">
          Conta Bloqueada.
        </h2>
      )}
      {active === "yes" && (
        <div className="xs:h-max lg:h-max md:h-max sm:h-max h-max bg-no-repeat bg-center bg-cover flex sm:flex-row flex-col justify-start items-start gap-y-4 z-5">
          <div className="xs:h-max lg:h-max md:h-max sm:h-max h-max sm:w-1/6 w-full bg-gray-200 flex flex-col">
            <div className="text-center bg-gray-300 h-20 flex items-center justify-top">
              <h2 className="text-xl text-green-600 font-semibold text-center w-full">
                Olá {response.nome}
              </h2>
            </div>
            <div className="leftBar flex-1 py-4 flex flex-col gap-y-10 justify-start items-center">
              {userType === "UF" && (
                <>
                  <NavLink
                    to="/edit_user"
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Perfil
                  </NavLink>
                  <NavLink
                    to="/project_list_uf"
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Meus projetos
                  </NavLink>
                  <NavLink
                    to="/send_project"
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Solicitar projeto
                  </NavLink>
                </>
              )}
              {userType === "AT" && (
                <>
                  <NavLink
                    to="/edit_user"
                    className="px-4 py-2 text-green-600 hover:text-green-800 shadow text-center"
                  >
                    Perfil
                  </NavLink>
                  <NavLink
                    to={"/project_list"}
                    className="px-4 py-2 text-green-600 hover:text-green-800   shadow text-center"
                  >
                    Listar Projetos Gerenciados por mim.
                  </NavLink>
                  <NavLink
                    to={"/project_list_all"}
                    className="px-4 py-2 text-green-600 hover:text-green-800  shadow text-center"
                  >
                    Listar Projetos não atribuidos.
                  </NavLink>
                  <NavLink
                    exact="true"
                    to={"/create-user"}
                    className="px-4 py-2 text-green-600 hover:text-green-800   shadow text-center"
                  >
                    Adicionar Projeto
                  </NavLink>
                </>
              )}
              {userType === "ADM" && (
                <>
                  <NavLink
                    to="/edit_user"
                    className="px-4 py-2 text-green-600 hover:text-green-800 shadow text-center"
                  >
                    Perfil
                  </NavLink>
                  <NavLink
                    exact="true"
                    to={"/create-user"}
                    className="px-4 py-2 text-green-600 hover:text-green-800   shadow text-center"
                  >
                    Adicionar Usuário Final
                  </NavLink>
                  <NavLink
                    exact="true"
                    to={"/create-user-at"}
                    className="px-4 py-2 text-green-600 hover:text-green-800   shadow text-center"
                  >
                    Adicionar Auditor Técnico
                  </NavLink>
                  <NavLink
                    exact="true"
                    to={"/search-panel"}
                    className="px-4 py-2 text-green-600 hover:text-green-800   shadow text-center"
                  >
                    Pesquisar Projeto
                  </NavLink>
                  <NavLink
                    exact="true"
                    to={"/search-user"}
                    className="px-4 py-2 text-green-600 hover:text-green-800   shadow text-center"
                  >
                    Pesquisar Usuário
                  </NavLink>
                </>
              )}

              <div className="text-center p-6 bg-gray-300 w-full">
                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-yellow-300 font-semibold text-green-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
          <div className="sm:w-5/6 w-full flex justify-top items-center relative flex-col xs:h-max lg:h-max md:h-max sm:h-max h-max">
            <h1 className="text-4xl text-white font-bold my-4">
              Painel do Usuário
            </h1>
            {window.location.href === "/userpanel" && (
              <h1 className="text-3xl text-white font-bold m-auto">
                Bem vindo ao gerenciamento de projetos.
                <br />
                Utilize o menu para navegar e realizar seu trabalho.
              </h1>
            )}

            {children}
          </div>
        </div>
      )}
    </>
  );
}
