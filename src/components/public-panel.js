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

export default function PublicPanel({ children }) {
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
    <>
      <div className="xs:h-max lg:h-max md:h-max sm:h-max h-max bg-no-repeat bg-center bg-cover flex sm:flex-row flex-col justify-start items-start gap-y-4 z-5">
        <div className="xs:h-max lg:h-max md:h-max sm:h-max h-max sm:w-1/6 w-full bg-gray-200 flex flex-col">
          <div className="text-center bg-gray-300 h-20 flex items-center justify-top">
            <h2 className="text-xl text-green-600 font-semibold text-center w-full">
              Filtros
            </h2>
          </div>
          <div className="leftBar flex-1 p-4 flex flex-col gap-y-10 justify-start items-center">
            <form onSubmit={handleSubmit} className="mb-6">
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
                  onChange={(event) =>
                    setSelectedProjectType(event.target.value)
                  }
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
                  onChange={(event) =>
                    setSelectedMethodology(event.target.value)
                  }
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
                  onChange={(event) =>
                    setSelectedProjectStatus(event.target.value)
                  }
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
            </form>

            <div className="text-center p-6 bg-gray-300 w-full"></div>
          </div>
        </div>
        <div className="sm:w-5/6 w-full flex justify-top items-center relative flex-col xs:h-max lg:h-max md:h-max sm:h-max h-max">
          <h1 className="text-4xl text-white font-bold my-4">
            Pesquisar Projetos
          </h1>

          <div className="mt-4">
            <h3 className="mb-2 font-bold">Resultados</h3>
            {filteredProjects.length === 0 && (
              <h2>Faça sua pesquisa no painel de filtros</h2>
            )}
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="mb-2 p-2 border border-gray-400 rounded"
              >
                <p>Código: {project.code}</p>
                <Link
                  to={`/project-details-search/${project.id}`} /* /${project.user_id} */
                >
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
        </div>
      </div>
    </>
  );
}
