import React, { useState, useEffect } from "react";
import CreateProjectForm from "./createProjectForm";
import EditProjectForm from "./EditProjectForm";
import ProjectDetails from "./projectDetails";
import axios from "axios";
import { apiUrl } from "../utils";

export default function ProjectForm() {
  const [hasProject, setHasProject] = useState(false);
  const [project, setProject] = useState(null);

  useEffect(() => {
    // Realiza a requisição para verificar se o usuário tem um projeto
    axios
      .post(`${apiUrl}/api/projects/get`, {
        user_id: localStorage.getItem("logged_id"),
      })
      .then((response) => {
        // Se o projeto for encontrado, atualiza o estado do componente
        if (response.data.status === 1) {
          setHasProject(true);
          setProject(response.data.project);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      {hasProject ? (
        /*  <EditProjectForm project={project} /> */
        <ProjectDetails project={project} />
      ) : (
        <CreateProjectForm />
      )}
    </>
  );
}
