import React, { useState, useEffect } from "react";
import UserPanel from "./user-panel";
import { FileInput } from "./fileImput";
import { mapsKey } from "../utils";
import { Link, useParams } from "react-router-dom";
import { apiUrl } from "../utils";
import axios from "axios";
import Map from "./gmaps";

export default function ProjectDetailsUf({ setGlobalProject }) {
  let { id } = useParams();
  const [loggedId, setLoggedId] = useState("");
  const [project, setProject] = useState({});
  const [userType, setUserType] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const projectList = JSON.parse(localStorage.getItem("all")) || [];
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

  useEffect(() => {
    setLoggedId(user_id);
    setProject(projectData);
    setUserType(localStorage.getItem("user_type"));
  }, []);

  console.log(project, project);

  return (
    <UserPanel>
      <div className="p-6 rounded-lg shadow-lg text-white relative">
        {project.project_status === "Em validação" && (
          <>
            <h1>Projeto em validação. Aguarde.</h1>
          </>
        )}
        {project.project_status !== "Em validação" && (
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
              <span className="font-bold">Proponente:</span> {project.proponent}
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
              <span className="font-bold">Período de crédito:</span>{" "}
              {project.CP}
            </div>
            <div className="mb-4">
              <span className="font-bold">Status:</span>{" "}
              {project.project_status}
            </div>
            <div className="mb-4">
              <span className="font-bold">Latitude e longitude</span>{" "}
              {`${project.latitude} ${project.longitude}`}
            </div>
            <Link
              to={`/pdf-page/${id}`}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Relatório
            </Link>
          </>
        )}
      </div>
    </UserPanel>
  );
}
