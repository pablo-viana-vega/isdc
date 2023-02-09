import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserPanel from "./user-panel";

export default function ProjectListUf() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const projectsFromStorage = JSON.parse(localStorage.getItem("all"));
    const getUserData = JSON.parse(localStorage.getItem("user_data"));
    if (Array.isArray(projectsFromStorage) && projectsFromStorage.length > 0) {
      setUser(getUserData);


      setProjects(projectsFromStorage);
    } else {
      setProjects(null);
    }
  }, []);

   let filteredProjects = projects.filter((project, index) => {
     return project.proponent == `${user.firstName} ${user.lastName}`;
   });


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
            <table className="mt-4 text-white w-full text-center">
              <thead>
                <tr className="text-white">
                  <th>Nome</th>
                  <th>Proponente</th>
                  <th>Status</th>
                  <th>Data de criação</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => (
                  <tr
                    key={project.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "green" : "gray",
                    }}
                  >
                    <td>
                      <Link
                        to={`/project-details-uf/${project.id}`}
                        className="text-white font-medium"
                      >
                        {project.title}
                      </Link>
                    </td>
                    <td>{project.proponent}</td>
                    <td>{project.project_status}</td>

                    <td>{new Date(project.created_at).toLocaleDateString()}</td>
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
