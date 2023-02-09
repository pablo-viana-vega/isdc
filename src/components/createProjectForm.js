import React, { useState, useEffect } from "react";
import { sanitize } from "dompurify";
import axios from "axios";
import { apiUrl, methodologies, states, mapsKey, projectType } from "../utils";
import UserPanel from "./user-panel";
import Map from "./gmaps";

export default function CreateProjectForm() {
  const [selectedMethodology, setSelectedMethodology] = useState("");
  const [newMethodology, setNewMethodology] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [project_id, setProjectId] = useState("");
  const [response, setResponse] = useState({});
  const [messageTimer, setMessageTimer] = useState(null);
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [newProjectType, setNewProjectType] = useState("");

  const handleProjectTypeChange = (event) => {
    setSelectedProjectType(event.target.value);
  };

  const handleNewProjectTypeChange = (event) => {
    setNewProjectType(event.target.value);
  };

  useEffect(() => {
    if (response.status === 1) {
      clearTimeout(messageTimer);
      setMessageTimer(
        setTimeout(() => setResponse({ status: 1, message: "" }), 3000)
      );
    }
  }, [response]);

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
  //  const [response, setResponse] = useState({});

  const handleSubmitProject = (event) => {
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
    const sanitizedCP = sanitize(CP);

    // Envia os dados para a API

    axios
      .post(`${apiUrl}/api/projects/create`, {
        user_id: localStorage.getItem("logged_id"),
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
        CP: sanitizedCP,
      })
      .then((response) => {
        setResponse(response.data);
        // Exibe uma mensagem de sucesso ou de erro
        if (response.data.status === 1) {
          //alert("Projeto criado com sucesso");
          setProjectId(response.data.project_id);
          axios
            .post(`${apiUrl}/api/projects/get`, {
              user_id: localStorage.getItem("logged_id"),
            })
            .then((response) => {
              if (response.data.status === 1) {
                /*  setHasProject(true);
                setProjects(response.data.project); */
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
          setTimeout(function () {
            window.location.href = `/project/edit/${response.data.project_id}`;
          }, 3000);
          console.log(response);
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

  return (
    <UserPanel>
      <h1 className="text-3xl text-white font-bold my-4">Inserir Projeto</h1>
      <h1 className="text-2xl text-white font-bold m-4">
        (Após inserir os dados básicos, você sera redirecionado para a pagina de
        edição. Podendo fazer upload dos arquivos.)
      </h1>
      <form
        id="projects"
        className="w-full xs:-NOT lg:-NOT md:-NOT sm:-NOT   shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col items-center"
        onSubmit={handleSubmitProject}
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
              defaultValue={11}
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
              defaultValue={15}
              step="0.000001"
              placeholder="Digite a longitude do projeto"
              required
              onChange={handleLongitudeChange}
            />
          </div>
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
            rows={10}
            required
          ></textarea>
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
            placeholder="Digite a Rua/Avenida do Proponente"
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
            placeholder="Digite a Cidade do Proponente"
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
            <option value="">Selecione o Estado</option>
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
            htmlFor="hectares"
          >
            Hectares
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="hectares"
            type="text"
            placeholder="Digite o valor em hectares"
            required
          />
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
            required
          />
        </div>
        <div className="mb-6 w-full">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="CP"
          >
            Periodo de cédito
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="CP"
            type="text"
            placeholder="Digite o periodo de cédito"
            required
          />
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
              <label htmlFor="newProjectType">Novo tipo de projeto:</label>
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
            htmlFor="project_type"
          >
            Metodologia:
          </label>
          <select
            id="methodology"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleMethodologyChange}
          >
            <option value="">Selecione uma metodologia de projeto</option>
            <option value="createNew">Criar nova metodologia</option>
            {methodologies.map((methodologie, key) => (
              <option key={key} value={methodologie}>
                {methodologie}
              </option>
            ))}
          </select>
          {selectedMethodology === "createNew" && (
            <>
              <label htmlFor="new">Nova metodologia:</label>
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
      </form>

      {response.status === 0 && (
        <div className="response w-full bg-red-500 flex justify-center text-lg fixed top-0 left-0">
          {response.message}
        </div>
      )}

      {response.status === 1 && (
        <>
          <div className="response w-full bg-green-500 flex justify-center text-lg fixed top-0 left-0">
            {response.message}
            Aguarde. Você será redirecionado para página de edição...
          </div>
        </>
      )}

      <button
        /*   onClick={handleSubmitProject} */
        form="projects"
        type="submit"
        className="bg-green-500 mb-5 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Salvar Projeto
      </button>
    </UserPanel>
  );
}
