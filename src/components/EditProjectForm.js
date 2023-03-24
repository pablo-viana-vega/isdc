import React, { useState, useEffect } from "react";
import { sanitize } from "dompurify";
import Map from "./gmaps";
import axios from "axios";
import {
  apiUrl,
  methodologies,
  states,
  mapsKey,
  projectType,
  projectStatus,
} from "../utils";
import { FileInput } from "./fileImput";
import UserPanel from "./user-panel";
import { useParams } from "react-router-dom";

export default function EditProjectForm() {
  let { id } = useParams();
  const [selectedMethodology, setSelectedMethodology] = useState("");
  const [newMethodology, setNewMethodology] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [newProjectType, setNewProjectType] = useState("");

  const [project, setProject] = useState({});
  const projectList = JSON.parse(localStorage.getItem("projects")) || [];
  /*  let projectData;
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
  } */

  const handleLatitudeChange = (event) => {
    setLatitude(event.target.value);
  };

  const handleLongitudeChange = (event) => {
    setLongitude(event.target.value);
  };

  const handleMethodologyChange = (event) => {
    setSelectedMethodology(event.target.value);
  };

  const handleNewMethodologyChange = (event) => {
    setNewMethodology(event.target.value);
  };

  const handleProjectTypeChange = (event) => {
    setSelectedProjectType(event.target.value);
  };

  const handleNewProjectTypeChange = (event) => {
    setNewProjectType(event.target.value);
  };

  const [response, setResponse] = useState({});

  const handleSubmitProjectUpdate = (event) => {
    event.preventDefault();
    console.log(event.target.title.value);
    // Obtém os valores dos campos do formulário
    const title = event.target.title.value;
    const pName = event.target.pname.value;
    const streetAddress = event.target.streetAddress.value;
    const cityAddress = event.target.cityAddress.value;
    const stateAddress = event.target.stateAddress.value;
    const description = event.target.description.value;
    const projectType =
      event.target.methodology.value === "createNew"
        ? event.target.newProjectType.value
        : event.target.projectType.value;
    const methodology =
      event.target.methodology.value === "createNew"
        ? event.target.newMethodology.value
        : event.target.methodology.value;
    const raee = event.target.raee.value;
    const latitude = event.target.latitude.value;
    const longitude = event.target.longitude.value;
    const hectares = event.target.hectares.value;
    const pStatus = event.target.proStatus.value;
    const CP = event.target.CP.value;
    // Sanitiza os valores para prevenir ataques de injeção de código
    const sanitizedTitle = sanitize(title);
    const sanitizedPname = sanitize(pName);
    const sanitizedStreetAddress = sanitize(streetAddress);
    const sanitizedCityAddress = sanitize(cityAddress);
    const sanitizedStateAddress = sanitize(stateAddress);
    const sanitizedDescription = sanitize(description);
    const sanitizedProjectType = sanitize(projectType);
    const sanitizedMethodology = sanitize(methodology);
    const sanitizedRaee = sanitize(raee);
    const sanitizedLatitude = sanitize(latitude);
    const sanitizedLongitude = sanitize(longitude);
    const sanitizedHectares = sanitize(hectares);
    const sanitizedStatus = sanitize(pStatus);
    const sanitizedCP = sanitize(CP);

    axios
      .post(`${apiUrl}/api/projects/update`, {
        user_id: localStorage.getItem("logged_id"),
        project_id: id,
        title: sanitizedTitle,
        proponent: sanitizedPname,
        street_address: sanitizedStreetAddress,
        city_address: sanitizedCityAddress,
        state_address: sanitizedStateAddress,
        description: sanitizedDescription,
        project_type: sanitizedProjectType,
        methodology: sanitizedMethodology,
        raee: sanitizedRaee,
        latitude: sanitizedLatitude,
        longitude: sanitizedLongitude,
        hectares: sanitizedHectares,
        project_status: sanitizedStatus,
        CP: sanitizedCP,
      })
      .then((response) => {
        /*  console.log(
          localStorage.getItem("logged_id"),
          id,
          sanitizedTitle,
          sanitizedPname,
          sanitizedStreetAddress,
          sanitizedCityAddress,
          sanitizedStateAddress,
          sanitizedDescription,
          sanitizedProjectType,
          sanitizedMethodology,
          sanitizedRaee,
          sanitizedLatitude,
          sanitizedLongitude,
          sanitizedHectares,
          sanitizedStatus
        ); */
        console.log(response);
        setResponse(response.data);
        // Exibe uma mensagem de sucesso ou de erro
        if (response.data.status === 1) {
          console.log(response);
          setTimeout(() => {
            window.history.back();
          }, 2000);
        } else {
          //alert("Erro ao criar o projeto");
          console.log(response.data);
        }
      })
      .catch((error) => {
        setResponse(error);
        console.error(error);
        //alert("Erro ao criar o projeto");
      });
  };

  // Função que atualiza o mapa quando os valores de latitude e longitude são alterados

  useEffect(() => {
    axios
      .post(`${apiUrl}/api/projects/get/public`, {
        project_id: id,
      })
      .then((response) => {
        // Se o projeto for encontrado, atualiza o estado do componente
        if (response.data.status === 1) {
          setProject(response.data.project[0]);
          console.log(id, localStorage.getItem("logged_id"));
          console.log(response);
        } else {
          console.log(response);
          console.log(id);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    console.log(project);
  }, []);

  // Adiciona um marcador no local especificado

  return (
    <UserPanel>
      <h2 className="text-white mb-7 text-3xl md:text-2xl xl:text-5xl lg:text-4xl sm:text-6xl text-center">
        Edite seu projeto
      </h2>
      <form
        className="w-full xs:-NOT lg:-NOT md:-NOT sm:-NOT   shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col items-center"
        onSubmit={handleSubmitProjectUpdate}
      >
        <div className="mb-6 w-full">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="title"
          >
            Nome do projeto
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Digite o nome do projeto"
            defaultValue={project.title}
            required
          />
        </div>
        <Map mapsKey={mapsKey} latitude={latitude} longitude={longitude} />
        <div className="mb-6 w-full flex justify-around sm:flex-row flex-col">
          {" "}
          <div className="mb-6">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="latitude"
            >
              Latitude
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="latitude"
              type="number"
              step="0.000001"
              placeholder="Digite a latitude do projeto"
              defaultValue={project.latitude}
              required
              onChange={handleLatitudeChange}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="longitude"
            >
              Longitude
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="longitude"
              type="number"
              step="0.000001"
              placeholder="Digite a longitude do projeto"
              defaultValue={project.longitude}
              required
              onChange={handleLongitudeChange}
            />
          </div>
        </div>

        <div className="mb-6 w-full">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="pname"
          >
            Nome do Proponente
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="pname"
            type="text"
            placeholder="Digite o nome do Proponente"
            defaultValue={project.proponent}
            required
          />
        </div>
        <div className="mb-6 w-full">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="streetAddress"
          >
            Rua/Avenida do Proponente
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="streetAddress"
            type="text"
            defaultValue={project.street_address}
            required
          />
        </div>
        <div className="mb-6 w-full">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="cityAddress"
          >
            Cidade do Proponente
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="cityAddress"
            type="text"
            defaultValue={project.city_address}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="stateAddress"
          >
            Estado do Proponente
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="stateAddress"
            required
          >
            <option value={project.state_address}>
              {project.state_address}
            </option>
            {states.map((estado, key) => (
              <option key={key} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6 w-full">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="description"
          >
            Descrição
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Digite a descrição do projeto"
            defaultValue={project.description}
            rows={10}
            required
          ></textarea>
        </div>
        <div className="mb-6 w-full">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="projectType"
          >
            Tipo de projeto:
          </label>
          <select
            id="projectType"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleProjectTypeChange}
          >
            <option value={project.project_type}>{project.project_type}</option>
            <option value="">Selecione um tipo de projeto</option>
            <option value="createNew">Criar novo tipo de projeto</option>
            {projectType.map((projectType, key) => (
              <option key={key} value={projectType}>
                {projectType}
              </option>
            ))}
          </select>
          {selectedProjectType === "createNew" && (
            <>
              <label htmlFor="newProjectType">Novo Tipo de projeto:</label>
              <input
                id="newProjectType"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={newProjectType}
                onChange={handleNewProjectTypeChange}
                placeholder="Não esqueça de anexar um arquivo sobre ele"
              />
            </>
          )}
        </div>
        <div className="mb-6 w-full">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="raee"
          >
            Reduções Anuais Estimadas de Emissões
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="raee"
            type="text"
            placeholder="Digite as Reduções Anuais Estimadas de Emissões"
            defaultValue={project.raee}
            required
          />
        </div>
        <div className="mb-6 w-full">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="CP"
          >
            Periodo de crédito
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="CP"
            type="text"
            placeholder="Digite o periodo de crédito"
            defaultValue={project.CP}
            required
          />
        </div>
        <div className="mb-6 w-full">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="hectares"
          >
            Hectares
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="hectares"
            type="text"
            placeholder="Digite o valor em hectares"
            defaultValue={project.hectares}
            required
          />
        </div>
        <div className="mb-6 w-full">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="methodology"
          >
            Metodologia:
          </label>

          <select
            id="methodology"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleMethodologyChange}
          >
            <option value={project.methodology}>{project.methodology}</option>
            <option value="createNew">Criar nova Metodologia</option>
            {methodologies.map((methodology, key) => (
              <option key={key} value={methodology}>
                {methodology}
              </option>
            ))}
          </select>
          {selectedMethodology === "createNew" && (
            <>
              <label htmlFor="newMethodology">Nova Metodologia:</label>
              <input
                id="newMethodology"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={newMethodology}
                onChange={handleNewMethodologyChange}
                placeholder="Não esqueça de anexar um arquivo sobre ela"
              />
            </>
          )}
        </div>
        <div className="mb-6 w-full">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="projectStatus"
          >
            Status:
          </label>

          <select
            id="proStatus"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value={project.project_status}>
              {project.project_status}
            </option>

            {projectStatus.map((item, key) => (
              <option key={key} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {response.status === 0 && (
          <div className="response w-full bg-red-500 flex justify-center text-lg fixed top-0 left-0">
            {response.message}
          </div>
        )}
        {response.status === 1 && (
          <div className="response w-full bg-green-500 flex justify-center text-lg fixed top-0 left-0">
            {response.message}
          </div>
        )}

        <button
          /*  onClick={handleSubmitProjectUpdate} */

          type="submit"
          className="bg-green-500 mb-5 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Salvar Projeto
        </button>
      </form>
      <h2 className="text-white mb-7 text-3xl md:text-2xl xl:text-5xl lg:text-4xl sm:text-6xl text-center">
        Gerenciar arquivos
      </h2>
      <div className="mb-6 w-full rounded-lg border-4 p-3 border-b-white flex flex-col">
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="DCCCV"
        >
          DOCUMENTOS DO CANAL CCV
        </label>
        <FileInput
          id={"DCCCV"}
          label={"DCCCV"}
          name={"DCCCV"}
          accept={".pdf, .PDF"}
          uId={project.user_id}
          pId={project.id}
        />
      </div>
      <div className="mb-6 w-full rounded-lg border-4 p-3 border-b-white flex flex-col">
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="DECCV"
        >
          DOCUMENTOS DE EMISSÃO CCV
        </label>
        <FileInput
          id={"DECCV"}
          label={"DECCV"}
          name={"DECCV"}
          accept={".pdf, .PDF"}
          uId={project.user_id}
          pId={project.id}
        />
      </div>
      <div className="mb-6 w-full rounded-lg border-4 p-3 border-b-white flex flex-col">
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="ODCCV"
        >
          CCV OUTROS DOCUMENTOS
        </label>
        <FileInput
          id={"ODCCV"}
          label={"ODCCV"}
          name={"ODCCV"}
          accept={".pdf, .PDF"}
          uId={project.user_id}
          pId={project.id}
        />
      </div>
    </UserPanel>
  );
}
