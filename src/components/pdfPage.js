import React, { useState, useEffect, useRef } from "react";

import { mapsKey } from "../utils";
import { Link, useParams } from "react-router-dom";

import Map from "./gmaps";
import sitebg from "../images/sitebg.jpg";
import { jsPDF as JsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function PdfPage({ setGlobalProject }) {
  let { id } = useParams();
  const [loggedId, setLoggedId] = useState("");
  const [project, setProject] = useState({});
  const [userType, setUserType] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const projectList = JSON.parse(localStorage.getItem("all")) || [];
  const user_id = localStorage.getItem("logged_id"); //
  let projectData;

  const [pdf, setPdf] = useState(null);
  const componentRef = useRef(null);

  const handleClick = async () => {
    const htmlSource = document.getElementById("profile");
    const filename = `Relatório VCS`;

    if (!htmlSource) {
      return;
    }

    html2canvas(htmlSource, { allowTaint: true, useCORS: true }).then(function (
      canvas
    ) {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 180;
      const pageHeight = 297;

      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 5;
      const pdf = new JsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(filename);
    });
  };

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
    <>
      <div id="profile" class="mx-6 my-8 p-6 bg-white shadow-lg rounded-lg">
        <h1 class="text-3xl font-bold mb-4">
          Nome do projeto: {project.title}
        </h1>
        <div className="w-4/6 mx-auto flex justify-center items-center align-middle">
          <img className="reponsiveImage" src={sitebg} />
        </div>
        <Map
          mapsKey={mapsKey}
          latitude={project.latitude}
          longitude={project.longitude}
          controls={false}
        />
        <div class="mb-4">
          <span class="font-bold">Código:</span> {project.code}
        </div>
        <div class="mb-4">
          <span class="font-bold">Proponente:</span> {project.proponent}
        </div>
        <div class="mb-4">
          <span class="font-bold">Endereço:</span> {project.street_address},
          {project.city_address}, {project.state_address}
        </div>
        <div class="mb-4">
          <span class="font-bold">Descrição:</span> {project.description}
        </div>
        <div class="mb-4">
          <span class="font-bold">Tipo de projeto:</span> {project.project_type}
        </div>
        <div class="mb-4">
          <span class="font-bold">Metodologia:</span> {project.methodology}
        </div>
        <div class="mb-4">
          <span class="font-bold">Reduções Anuais Estimadas de Emissões:</span>{" "}
          {project.raee}
        </div>
        <div class="mb-4">
          <span class="font-bold">Hectares:</span> {project.hectares}
        </div>
        <div class="mb-4">
          <span class="font-bold">Período de crédito:</span> {project.CP}
        </div>
        <div class="mb-4">
          <span class="font-bold">Status:</span> {project.project_status}
        </div>
        <div class="mb-4">
          <span class="font-bold">Latitude e longitude:</span>{" "}
          {`${project.latitude} ${project.longitude}`}
        </div>
      </div>

      <button onClick={handleClick}>Gerar PDF</button>
    </>
  );
}
