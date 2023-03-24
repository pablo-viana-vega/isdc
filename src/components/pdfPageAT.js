import React, { useState, useEffect, useRef } from "react";

import { apiUrl, mapsKey } from "../utils";
import { Link, useParams } from "react-router-dom";
import Map from "./gmaps";
import sitebg from "../images/sitebg.jpg";
import { jsPDF as JsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import UserPanel from "./user-panel";
import Loading from "./loader";
import { FileInput } from "./fileImput";

export default function PdfPage() {
  let { id } = useParams();
  const [loggedId, setLoggedId] = useState("");
  const [project, setProject] = useState({});
  const [userType, setUserType] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const projectList = JSON.parse(localStorage.getItem("all")) || [];
  const user_id = localStorage.getItem("logged_id"); //
  const [loading, setLoading] = useState(false);
  let projectData;

  const [pdf, setPdf] = useState(null);
  const componentRef = useRef(null);

  const handleClick = async () => {
    setLoading(true);
    const htmlSource = document.getElementById("profile");
    const filename = `Relatório-UF-CCV.pdf`;

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
      const file = pdf.output("blob");
      const formData = new FormData();
      console.log(file);
      formData.append("files", file, filename);
      axios
        .post(
          `${apiUrl}/api/projects/clientPdf/files/upload/${project.user_id}/${project.id}`,
          formData
        )
        .then((response) => {
          console.log(response);
          if (response.data.status === 1) {
            axios
              .post(
                `${apiUrl}/api/projects/pdfbuild/${project.user_id}/${project.id}`
              )
              .then((response) => {
                setLoading(false);
                console.log(response);
                const fileURL = `/${response.data.pathPdf}`;
                window.open(fileURL);
                var a = document.createElement("a");
                a.href = fileURL;
                a.target = "_blank";
                a.click();
              })
              .catch((error) => {
                setLoading(false);
                console.error(error);
              });
          }

          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
      //pdf.save(filename);
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
      {loading ? (
        <Loading />
      ) : (
        <UserPanel>
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
                            <img
                              className="responsiveImage mywid"
                              src={sitebg}
                            />
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

          <h2 className="text-white mb-7 text-3xl md:text-2xl xl:text-5xl lg:text-4xl sm:text-6xl text-center">
            Gerenciar arquivos
          </h2>
          <div className="mb-6 w-full rounded-lg border-4 p-3 border-b-white flex flex-col">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="final"
            >
              Último Relatório Completo
            </label>
            <FileInput
              id={"final"}
              label={"final"}
              name={"final"}
              accept={".pdf, .PDF"}
              uId={project.user_id}
              pId={project.id}
              visibilityType={"all"}
            />
          </div>
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

          <button
            className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600"
            onClick={handleClick}
          >
            Gerar PDF
          </button>
        </UserPanel>
      )}
    </>
  );
}
