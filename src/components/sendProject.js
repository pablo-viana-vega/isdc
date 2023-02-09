import UserPanel from "./user-panel";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../utils";

export default function SendProject() {
  const [response, setResponse] = useState({});
  const [userType, setUserType] = useState("");
  const [title, setTitle] = useState("");
  const [proponent, setProponent] = useState("");
  const [description, setDescription] = useState("");
  const [userData, setUserData] = useState({});
  const [id, setUserId] = useState("");

  useEffect(() => {
    setUserId(localStorage.getItem("logged_id"));
    setUserData(JSON.parse(localStorage.getItem("user_data")));
    const user_type = localStorage.getItem("user_type");
    console.log(userData);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post(`${apiUrl}/api/projects/sendnew`, {
        title: event.target.title.value,
        proponent: event.target.proponent.value,
        description: event.target.description.value,
      })
      .then((response) => {
        setResponse(response.data);
        // Exibe uma mensagem de sucesso ou de erro
        if (response.data.status === 1) {
          alert("Projeto solicitado com sucesso");
          window.location.href = "/userpanel";
        } else {
          alert("Erro ao criar o projeto");
          console.log(response.data);
        }
      })
      .catch((error) => {
        setResponse(error);
        console.error(error);
        alert("Erro ao criar o projeto");
      });
  };

  return (
    <UserPanel>
      <div className="p-5 m-5 w-11/12  bg-white shadow-md rounded-lg">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block font-medium text-gray-700 mb-2"
              htmlFor="proponent"
            >
              Nome de Proponente
            </label>
            <input
              type="text"
              id="proponent"
              name="proponent"
              className="w-full border border-gray-400 p-2 rounded-lg"
              value={`${userData.firstName} ${userData.lastName}`}
              readOnly
            />
          </div>
          <div className="mb-6 w-full">
            <label className="block text-sm font-bold mb-2" htmlFor="title">
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
          <div className="mb-4">
            <label
              className="block font-medium text-gray-700 mb-2"
              htmlFor="description"
            >
              Detalhes do Projeto, e dados de contato para podermos solicitar
              todas as informações pertinentes.
            </label>
            <textarea
              rows={20}
              id="description"
              name="description"
              className="w-full border border-gray-400 p-2 rounded-lg h-32"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
          >
            Enviar
          </button>
        </form>
      </div>
    </UserPanel>
  );
}
