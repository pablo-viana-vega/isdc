import React, { useState, useEffect } from "react";
import axios from "axios";
import UserPanel from "./user-panel";
import { apiUrl } from "../utils";

export default function EditUserForm() {
  const [userInfo, setUserInfo] = useState({});
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user_data"));

  useEffect(() => {
    setUserInfo(user);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    for (let entry of formData.entries()) {
      data[entry[0]] = entry[1];
    }

    axios
      .post(`${apiUrl}/api/user/update`, data)
      .then((response) => {
        console.log(response.data);
        setMessage(response.data);
        localStorage.setItem("user_data", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error(error);
        setMessage({ status: 0, message: error });
      });
  };

  return (
    <UserPanel>
      <h1 className="text-4xl text-white font-bold mb-4 text-center">
        Perfil do usuário
      </h1>
      {message.status === 0 && (
        <div className="response w-full bg-red-500 flex justify-center text-lg fixed top-0 left-0">
          {message.message}
        </div>
      )}
      {message.status === 1 && (
        <div className="response w-full bg-green-500 flex justify-center text-lg fixed top-0 left-0">
          {message.message}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-10/12"
      >
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-gray-700 font-medium mb-2"
          >
            Nome:
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            defaultValue={userInfo.firstName}
            className="border border-gray-400 p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-gray-700 font-medium mb-2"
          >
            Sobrenome:
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            defaultValue={userInfo.lastName}
            className="border border-gray-400 p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={userInfo.email}
            className="border border-gray-400 p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="block text-gray-700 font-medium mb-2"
          >
            Telefone:
          </label>
          <input
            type="mobile"
            id="mobile"
            name="mobile"
            defaultValue={userInfo.mobile}
            className="border border-gray-400 p-2 w-full"
            maxLength={11}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2"
          >
            Senha:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Digite a nova senha"
          />
          <input
            type="hidden"
            id="user_id"
            name="user_id"
            value={userInfo.id}
            readOnly
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Atualizar Usuário
        </button>
      </form>
    </UserPanel>
  );
}
