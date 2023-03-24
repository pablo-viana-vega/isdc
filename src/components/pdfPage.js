import React, { useState, useEffect, useRef } from "react";

import { apiUrl, mapsKey } from "../utils";
import { Link, useParams } from "react-router-dom";
import Map from "./gmaps";
import sitebg from "../images/sitebg.jpg";
import { jsPDF as JsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

export default function PdfPage() {
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
    const filename = `Relatório CCV`;

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
        position = heightLeft - imgHeight + 4; // adiciona margem superior e inferior de 20 mm
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
    /*  console.log(projectList[i].id); */
  }
  if (!projectData) {
    // window.location.href = "create-project";
    console.log(projectList);
    console.log(id);
  }

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

  console.log(project, project);

  return (
    <>
      <div
        id="profile" /*  className="mx-6 my-8 p-6 bg-white shadow-lg rounded-lg" */
      >
        <h1 className=" underline text-4xl font-bold mb-4 text-center">
          Relatório CCV
        </h1>
        <h1 className="text-4xl font-bold mb-4">
          Nome do projeto: {project.title}
        </h1>
        <div className="w-4/6 mx-auto flex justify-center items-center align-middle">
          <img className="reponsiveImage" src={sitebg} />
        </div>
        <div className="mb-4">
          <span className="text-3xl font-bold">Código:</span>
          <span className="text-3xl font-bold">{project.code}</span>
        </div>
        <Map
          mapsKey={mapsKey}
          latitude={project.latitude}
          longitude={project.longitude}
          controls={false}
        />

        <div className="mb-4">
          <span className="text-3xl font-bold">Proponente:</span>
          <span className="text-3xl">{project.proponent}</span>
        </div>
        <div className="mb-4">
          <span className="text-3xl font-bold">Endereço:</span>
          <span className="text-3xl">
            {project.city_address}, {project.state_address}
          </span>
        </div>
        <div className="mb-4">
          <span className="text-3xl font-bold">Descrição:</span>
          <span className="text-3xl">
            {" "}
            {project.description &&
              project.description.split(" ").map((word, index) => {
                if (index === 300) {
                  return (
                    <React.Fragment key={index}>
                      {word}
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <div className="w-4/6 mx-auto flex justify-center items-center align-middle">
                        <img className="responsiveImage mywid" src={sitebg} />
                      </div>
                    </React.Fragment>
                  );
                } else {
                  return <span key={index}>{word} </span>;
                }
              })}
          </span>
        </div>
        <div className="mb-4">
          <span className="text-3xl font-bold">Tipo de projeto:</span>
          <span className="text-3xl">{project.project_type}</span>
        </div>
        <div className="mb-4">
          <span className="text-3xl font-bold">Metodologia:</span>
          <span className="text-3xl">{project.methodology}</span>
        </div>
        <div className="mb-4">
          <span className="text-3xl font-bold">
            Reduções Anuais Estimadas de Emissões:
          </span>
          <span className="text-3xl">{project.raee}</span>
        </div>
        <div className="mb-4">
          <span className="text-3xl font-bold">Hectares:</span>
          <span className="text-3xl">{project.hectares}</span>
        </div>
        <div className="mb-4">
          <span className="text-3xl font-bold">Período de crédito:</span>{" "}
          <span className="text-3xl">{project.CP}</span>
        </div>
        <div className="mb-4">
          <span className="text-3xl font-bold">Status:</span>
          <span className="text-3xl">{project.project_status}</span>{" "}
        </div>
        <div className="mb-4">
          <span className="text-3xl font-bold">
            {`Latitude:${project.latitude} e longitude: ${project.longitude}`}
          </span>{" "}
        </div>
      </div>

      <button onClick={handleClick}>Gerar PDF</button>
    </>
  );
}
