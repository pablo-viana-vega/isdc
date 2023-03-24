import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserPanel from "./user-panel";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const projectsFromStorage = JSON.parse(localStorage.getItem("projects"));
    if (Array.isArray(projectsFromStorage) && projectsFromStorage.length > 0) {
      setProjects(projectsFromStorage);
    } else {
      setProjects(null);
    }
  }, []);

  /* const handleSort = (sortType) => {
    const copyOfProjects = [...projects];
    const sortedProjects = copyOfProjects.sort((a, b) => {
      switch (sortType) {
        case "name":
          return a.title.localeCompare(b.title);
        case "date":
          return new Date(a.created_at) - new Date(b.created_at);
        default:
          return a.title.localeCompare(b.title);
      }
    });
    setProjects(sortedProjects);
  }; */

  return (
    <UserPanel>
      <div className="px-5 w-full">
        <h1 className="text-4xl text-white font-bold mb-4 text-center">
          Projetos
        </h1>
        {projects === null ? (
          <h1 className="text-3xl text-white font-bold mb-4">
            Nenhum projeto encontrado.
          </h1>
        ) : (
          <>
            {/* <div className="text-center">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-l"
                onClick={() => handleSort("name")}
              >
                Ordenar por nome
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-r"
                onClick={() => handleSort("date")}
              >
                Ordenar por data
              </button>
            </div> */}

            <table className="mt-4 text-white w-full">
              <thead>
                <tr className="text-white">
                  <th>Nome</th>
                  <th>Proponent</th>
                  <th>Code</th>
                  <th>Data de criação</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr
                    key={project.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "green" : "gray  ",
                    }}
                  >
                    <td>
                      <Link
                        to={`/project-details-panel/${project.id}`}
                        className="text-white underline font-medium"
                      >
                        {project.title}
                      </Link>
                    </td>
                    <td>{project.proponent}</td>
                    <td>{project.code}</td>

                    <td>
                      {
                        /* new Date */ project.created_at /* .toLocaleDateString() */
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </UserPanel>
  );
}
