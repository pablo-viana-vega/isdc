import React, { useState, useEffect } from "react";
import UserPanel from "./user-panel";
import { FileInput } from "./fileImput";
import { mapsKey } from "../utils";
import { Link, useParams } from "react-router-dom";
import { apiUrl } from "../utils";
import axios from "axios";
import Map from "./gmaps";

export default function MyProjectDetails({ setGlobalProject }) {
  let { id } = useParams();
  const [loggedId, setLoggedId] = useState("");
  const [project, setProject] = useState({});
  const [userType, setUserType] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const projectList = JSON.parse(localStorage.getItem("projects")) || [];
  const user_id = localStorage.getItem("logged_id"); //
  let projectData;

  for (let i = 0; i < projectList.length; i++) {
    if (projectList[i].id == id) {
      projectData = projectList[i];
    }
    console.log(projectList[i].id);
  }
  if (!projectData) {
    // window.location.href = "create-project";
    console.log(projectList);
    console.log(id);
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
      })
      .catch((error) => {
        console.log(error);
        setResponseMessage(error);
      });
  };

  const handleDelete = () => {
    axios
      .post(`${apiUrl}/api/projects/delete/${id}`)
      .then((response) => {
        if (response.data.status === 1) {
          localStorage.removeItem("project");
          //window.location.href = "create-project";
          setResponseMessage(response.data);
          console.log(response);
          setTimeout(() => {
            window.location.href = "/project_list";
          }, 3000);
        } else {
          setResponseMessage(response.data);
          alert(projectData.id);
          console.log(response);
        }
      })
      .catch((error) => {
        setResponseMessage(error);
        console.log(error);
      });
  };

  useEffect(() => {
    setLoggedId(user_id);
    setProject(projectData);
    setUserType(localStorage.getItem("user_type"));
  }, []);

  console.log(project);

  return (
    <UserPanel>
      <div className="p-6 rounded-lg shadow-lg text-white relative w-10/12">
        {userType === "AT" && (
          <>
            <button className="top-0 right-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full text-center inline-block mx-auto my-2">
              <Link to={`/project/edit/${id}`} className="text-white">
                Editar Projeto
              </Link>
            </button>
            <button
              className="top-0 left-0 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full text-center inline-block mx-auto my-2"
              onClick={handleDelete}
            >
              Excluir Projeto
            </button>
          </>
        )}
        {project.status === "Em validação" && userType === "UF" && (
          <>
            <h1>Em validação. aguarde.</h1>
          </>
        )}
        {(project.status !== "Em validação" && userType === "z") ||
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
            </>
          ))}
      </div>
    </UserPanel>
  );
}
