import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import {
  apiUrl,
  methodologies as availableMethodologies,
  states as availableStates,
  projectType as availableProjectTypes,
  projectStatus as availableProjectStatuses,
} from "../utils";

import sitebg from "../images/sitebg.jpg";

export default function ProjectFilterPanel() {
  const [selectedCode, setCode] = useState("");
  const [selectedTitle, setTitle] = useState("");
  const [selectedProponent, setProponent] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [selectedMethodology, setSelectedMethodology] = useState("");
  const [selectedProjectStatus, setSelectedProjectStatus] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${apiUrl}/api/projects/search`, {
      code: selectedCode,
      title: selectedTitle,
      proponent: selectedProponent,
      state_address: selectedState,
      project_type: selectedProjectType,
      methodology: selectedMethodology,
      project_status: selectedProjectStatus,
      CP: "",
    });

    const data = response.data;
    if (data.message) {
      alert(data.message);
    } else {
      setFilteredProjects(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 w-10/12 m-auto">
      <div className="sm:w-4/6 flex flex-col xs: md:-NOT m-auto">
        <img className="reponsiveImage" src={sitebg} />
      </div>
      <input
        type="text"
        placeholder="Código"
        value={selectedCode}
        onChange={(event) => setCode(event.target.value)}
        className="mb-2 p-2 border border-gray-400 rounded w-full"
      />
      <input
        type="text"
        placeholder="Nome do projeto"
        value={selectedTitle}
        onChange={(event) => setTitle(event.target.value)}
        className="mb-2 p-2 border border-gray-400 rounded w-full"
      />
      <input
        type="text"
        placeholder="Proponente"
        value={selectedProponent}
        onChange={(event) => setProponent(event.target.value)}
        className="mb-2 p-2 border border-gray-400 rounded w-full"
      />

      <div>
        <select
          value={selectedState}
          onChange={(event) => setSelectedState(event.target.value)}
          className="mb-2 p-2 border border-gray-400 rounded w-full"
        >
          <option value="">Selecione o estado</option>
          {availableStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          value={selectedProjectType}
          onChange={(event) => setSelectedProjectType(event.target.value)}
          className="mb-2 p-2 border border-gray-400 rounded w-full"
        >
          <option value="">Selecione o tipo de projeto</option>
          {availableProjectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={selectedMethodology}
          onChange={(event) => setSelectedMethodology(event.target.value)}
          className="mb-2 p-2 border border-gray-400 rounded w-full"
        >
          <option value="">Selecione o status do projeto</option>
          {availableMethodologies.map((methodology) => (
            <option key={methodology} value={methodology}>
              {methodology}
            </option>
          ))}
        </select>

        <select
          value={selectedProjectStatus}
          onChange={(event) => setSelectedProjectStatus(event.target.value)}
          className="mb-2 p-2 border border-gray-400 rounded w-full"
        >
          <option value="">Selecione o status do projeto</option>
          {availableProjectStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600"
      >
        Filtrar projetos
      </button>
      <div className="mt-4">
        <h3 className="mb-2 font-bold">Resultados</h3>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="mb-2 p-2 border border-gray-400 rounded"
          >
            <p>Código: {project.code}</p>
            <Link to={`/project-details-search/${project.id}`}>
              <h4 className="font-bold">{project.title}</h4>
            </Link>
            <p>Proponente: {project.proponent}</p>
            <p>Estado: {project.state_address}</p>
            <p>Tipo de projeto: {project.project_type}</p>
            <p>Metodologia: {project.methodology}</p>
            <p>Status do projeto: {project.project_status}</p>
          </div>
        ))}
      </div>
    </form>
  );
}

/* import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import sitebg from "../images/sitebg.jpg";

import axios from "axios";
import {
  apiUrl,
  methodologies as availableMethodologies,
  states as availableStates,
  projectType as availableProjectTypes,
  projectStatus as availableProjectStatuses,
} from "../utils";

export default function ProjectFilter() {
  const [selectedCode, setCode] = useState("");
  const [selectedTitle, setTitle] = useState("");
  const [selectedProponent, setProponent] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [selectedMethodology, setSelectedMethodology] = useState("");
  const [selectedProjectStatus, setSelectedProjectStatus] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios(`${apiUrl}/api/projects/search`, {
      code: selectedCode,
      title: selectedTitle,
      proponent: selectedProponent,
      state_address: selectedState,
      project_type: selectedProjectType,
      methodology: selectedMethodology,
      project_status: selectedProjectStatus,
      CP: "",
    });

    const data = response.data;
    if (data.message) {
      alert(data.message);
    } else {
      setFilteredProjects(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 w-10/12 m-auto">
      <div className="sm:w-4/6 flex flex-col xs: md:-NOT m-auto">
        <img className="reponsiveImage" src={sitebg} />
      </div>
      <h2 className="text-white mb-7 text-3xl md:text-2xl xl:text-5xl lg:text-4xl sm:text-6xl text-center m-5">
        Edite seu projeto
      </h2>
      <input
        type="text"
        placeholder="Código"
        value={selectedCode}
        onChange={(event) => setCode(event.target.value)}
        className="mb-2 p-2 border border-gray-400 rounded w-full"
      />
      <input
        type="text"
        placeholder="Nome do projeto"
        value={selectedTitle}
        onChange={(event) => setTitle(event.target.value)}
        className="mb-2 p-2 border border-gray-400 rounded w-full"
      />
      <input
        type="text"
        placeholder="Proponente"
        value={selectedProponent}
        onChange={(event) => setProponent(event.target.value)}
        className="mb-2 p-2 border border-gray-400 rounded w-full"
      />

      <div>
        <select
          value={selectedState}
          onChange={(event) => setSelectedState(event.target.value)}
          className="mb-2 p-2 border border-gray-400 rounded w-full"
        >
          <option value="">Selecione o estado</option>
          {availableStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          value={selectedProjectType}
          onChange={(event) => setSelectedProjectType(event.target.value)}
          className="mb-2 p-2 border border-gray-400 rounded w-full"
        >
          <option value="">Selecione o tipo de projeto</option>
          {availableProjectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={selectedMethodology}
          onChange={(event) => setSelectedMethodology(event.target.value)}
          className="mb-2 p-2 border border-gray-400 rounded w-full"
        >
          <option value="">Selecione o status do projeto</option>
          {availableMethodologies.map((methodology) => (
            <option key={methodology} value={methodology}>
              {methodology}
            </option>
          ))}
        </select>

        <select
          value={selectedProjectStatus}
          onChange={(event) => setSelectedProjectStatus(event.target.value)}
          className="mb-2 p-2 border border-gray-400 rounded w-full"
        >
          <option value="">Selecione o status do projeto</option>
          {availableProjectStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600"
      >
        Filtrar projetos
      </button>
      <div className="mt-4">
        <h3 className="mb-2 font-bold">Resultados</h3>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="mb-2 p-2 border border-gray-400 rounded"
          >
            <p>Código: {project.code}</p>
            <Link to={`/project-details-search/${project.id}`}>
              <h4 className="font-bold">{project.title}</h4>
            </Link>
            <p>Proponente: {project.proponent}</p>
            <p>Estado: {project.state_address}</p>
            <p>Tipo de projeto: {project.project_type}</p>
            <p>Metodologia: {project.methodology}</p>
            <p>Status do projeto: {project.project_status}</p>
          </div>
        ))}
      </div>
    </form>
  );
}
 */
