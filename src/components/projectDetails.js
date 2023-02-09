import React, { useState, useEffect } from "react";
import UserPanel from "./user-panel";
import { FileInput } from "./fileImput";
import { mapsKey } from "../utils";
import { Link, useParams } from "react-router-dom";
import { apiUrl } from "../utils";
import axios from "axios";
import Map from "./gmaps";

export default function ProjectDetails({ setGlobalProject }) {
  let { id } = useParams();
  const [loggedId, setLoggedId] = useState("");
  const [project, setProject] = useState({});
  const [userType, setUserType] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const projectList = JSON.parse(localStorage.getItem("projectsAll")) || [];
  const user_id = localStorage.getItem("logged_id"); //
  let projectData;

  for (let i = 0; i < projectList.length; i++) {
    if (projectList[i].id == id) {
      projectData = projectList[i];
    }
    console.log(projectList[i].id);
    console.log(typeof +id);
  }
  if (!projectData) {
    // window.location.href = "create-project";
    console.log(projectList);
  }

  const handleAssign = () => {
    console.log(`projectId: ${id} , userId: ${user_id} `);
    axios
      .post(`${apiUrl}/api/projects/assign`, {
        projectId: id,
        userId: user_id,
      })
      .then((response) => {
        console.log(response);
        setResponseMessage(response.data);
        if (response.data.status === 1) {
          setTimeout(() => {
            window.location.href = `/project/edit/${projectData.id}`;
          }, 3000);
        }
        if (response.data.status === 0) {
          console.log(response);
        }

        axios
          .post(`${apiUrl}/api/projects/get`, {
            user_id: localStorage.getItem("logged_id"),
          })
          .then((response) => {
            if (response.data.status === 1) {
              //setHasProject(true);
              //setProjects(response.data.project);
              localStorage.setItem(
                "projects",
                JSON.stringify(response.data.project)
              );
              axios
                .post(`${apiUrl}/api/projects/get`, {
                  user_id: 0,
                })
                .then((response) => {
                  if (response.data.status === 1) {
                    //setHasProject(true);
                    //setProjects(response.data.project);
                    localStorage.setItem(
                      "projectsAll",
                      JSON.stringify(response.data.project)
                    );
                    console.log(response);
                  } else {
                    localStorage.setItem("projectsAll", JSON.stringify(null));
                    console.log(response);
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
              console.log(response);
            } else {
              console.log(response);
            }
          })
          .catch((error) => {
            console.error(error);
          });

        const id = localStorage.getItem("logged_id");
        const user_type = localStorage.getItem("user_type");
        if (id) {
          axios
            .post(`${apiUrl}/api/user/get`, id)
            .then((response) => {
              //setResponse(response.data);
              setUserType(user_type);
              console.log(response.data);
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

        axios
          .post(`${apiUrl}/api/projects/get`, {
            user_id: localStorage.getItem("logged_id"),
          })
          .then((response) => {
            // Se o projeto for encontrado, atualiza o estado do componente
            if (response.data.status === 1) {
              //setHasProject(true);
              //setProject(response.data.project);
              /* if (localStorage.getItem("project") === null) {
            localStorage.setItem(
              "project",
              JSON.stringify(response.data.project)
            );
          } */

              console.log(response);
            } else {
              console.log(response);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.log(error);
        setResponseMessage(error);
      });
  };

  useEffect(() => {
    setLoggedId(user_id);
    setProject(projectData);
    setUserType(localStorage.getItem("user_type"));
  }, []);

  console.log(project, project);

  return (
    <UserPanel>
      <div className="p-6 rounded-lg shadow-lg text-white relative">
        {}
        {userType === "AT" && (
          <>
            <button
              className="top-0 left-0 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full text-center inline-block mx-auto my-2"
              onClick={handleAssign}
            >
              Atribuir a mim
            </button>
          </>
        )}
        {project.project_status === "Em validação" && userType === "UF" && (
          <>
            <h1>Projeto em validação. Aguarde.</h1>
          </>
        )}
        {(project.project_status !== "Em validação" && userType === "z") ||
          (userType === "AT" && (
            <>
              {responseMessage.status === 0 && (
                <div className="fixed-top bg-red-600 text-white text-center p-3">
                  {responseMessage.message}
                </div>
              )}
              {responseMessage.status === 1 && (
                <div className="fixed-top bg-green-600 text-white text-center p-3">
                  {responseMessage.message}
                  Por favoe aguarde...
                </div>
              )}
              <h1 className="text-3xl font-bold mb-4">
                Nome do projeto: {project.title}
              </h1>
              <Map
                mapsKey={mapsKey}
                latitude={project.latitude}
                longitude={project.longitude}
              />{" "}
              <div className="mb-4">
                <span className="font-bold">Codigo:</span> {project.code}
              </div>
              <div className="mb-4">
                <span className="font-bold">Proponente:</span>{" "}
                {project.proponent}
              </div>
              <div className="mb-4">
                <span className="font-bold">Endereço:</span>{" "}
                {project.street_address}, {project.city_address},{" "}
                {project.state_address}
              </div>
              <div className="mb-4">
                <span className="font-bold">Descrição:</span>{" "}
                {project.description}
              </div>
              <div className="mb-4">
                <span className="font-bold">Tipo de projeto:</span>{" "}
                {project.project_type}
              </div>
              <div className="mb-4">
                <span className="font-bold">Metodologia:</span>{" "}
                {project.methodology}
              </div>
              <div className="mb-4">
                <span className="font-bold">
                  Reduções Anuais Estimadas de Emissões:
                </span>{" "}
                {project.raee}
              </div>
              <div className="mb-4">
                <span className="font-bold">Hectares:</span> {project.hectares}
              </div>
              <div className="mb-4">
                <span className="font-bold">Status:</span>{" "}
                {project.project_status}
              </div>
              <div className="mb-4">
                <span className="font-bold">Latitude e longitude</span>{" "}
                {`${project.latitude} ${project.longitude}`}
              </div>
              <div className="mb-4">
                <span className="font-bold">Período de crédito</span>{" "}
                {`${project.CP}`}
              </div>
            </>
          ))}
      </div>
    </UserPanel>
  );
}
