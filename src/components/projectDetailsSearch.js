import React, { useState, useEffect } from "react";
import UserPanel from "./user-panel";
import { FileInput } from "./fileImput";
import { mapsKey } from "../utils";
import { Link, useParams } from "react-router-dom";
import { apiUrl } from "../utils";
import axios from "axios";
import Map from "./gmaps";

export default function ProjectDetailsSearch({ setGlobalProject }) {
  /* const [loggedId, setLoggedId] = useState(""); */
  const [project, setProject] = useState({});
  /*  const [userType, setUserType] = useState(""); */
  /*  const [responseMessage, setResponseMessage] = useState(""); */
  let { pid, uid } = useParams();
  useEffect(() => {
    axios
      .post(`${apiUrl}/api/projects/get/public/${pid}/${uid}`, {

      })
      .then((response) => {
        // Se o projeto for encontrado, atualiza o estado do componente
        if (response.data.status === 1) {
          setProject(response.data.project);

          console.log(response);
        } else {
          console.log(response);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    console.log(project);
  }, []);

  return (
    <UserPanel>
      <div className="p-6 w-10/12 rounded-lg shadow-lg text-white relative">
        <>
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
            <span className="font-bold">Descrição:</span> {project.description}
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
            <span className="font-bold">Período de crédito:</span> {project.CP}
          </div>
          <div className="mb-4">
            <span className="font-bold">Status:</span> {project.project_status}
          </div>
          <div className="mb-4">
            <span className="font-bold">Latitude e longitude</span>{" "}
            {`${project.latitude} ${project.longitude}`}
          </div>
        </>
        <Link
          to={`/pdf-page/${pid}/`}
          className="text-green-600 hover:text-green-800 font-medium"
        >
          Relatório
        </Link>
      </div>
    </UserPanel>
  );
}
