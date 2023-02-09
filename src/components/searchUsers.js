import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserPanel from "./user-panel";
import axios from "axios";
import { apiUrl } from "../utils";

export default function UserFilter() {
  const [selectedFirstName, setFirstName] = useState("");
  const [selectedLastName, setLastName] = useState("");
  const [selectedMobile, setMobile] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("");
  const [selectedActive, setSelectedActive] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${apiUrl}/api/users/search`, {
      firstName: selectedFirstName,
      lastName: selectedLastName,
      mobile: selectedMobile,
      email: selectedEmail,
      user_type: selectedUserType,
      active: selectedActive,
    });

    const data = response.data;
    if (data.message) {
      alert(data.message);
    } else {
      setFilteredUsers(data);
    }
  };

  return (
    <UserPanel>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Nome"
          value={selectedFirstName}
          onChange={(event) => setFirstName(event.target.value)}
          className="mb-2 p-2 border border-gray-400 rounded w-full"
        />
        <input
          type="text"
          placeholder="Sobrenome"
          value={selectedLastName}
          onChange={(event) => setLastName(event.target.value)}
          className="mb-2 p-2 border border-gray-400 rounded w-full"
        />
        <input
          type="text"
          placeholder="Telefone"
          value={selectedMobile}
          maxLength={11}
          onChange={(event) => setMobile(event.target.value)}
          className="mb-2 p-2 border border-gray-400 rounded w-full"
        />
        <input
          type="text"
          placeholder="Email"
          value={selectedEmail}
          onChange={(event) => setSelectedEmail(event.target.value)}
          className="mb-2 p-2 border border-gray-400 rounded w-full"
        />

        <div>
          <select
            value={selectedUserType}
            onChange={(event) => setSelectedUserType(event.target.value)}
            className="mb-2 p-2 border border-gray-400 rounded w-full"
          >
            <option value="">Selecione o tipo de usuário</option>
            <option value="UF">Usuário Final</option>
            <option value="AT">Auditor Técnico</option>
          </select>
          <select
            value={selectedActive}
            onChange={(event) => setSelectedActive(event.target.value)}
            className="mb-2 p-2 border border-gray-400 rounded w-full"
          >
            <option value="">Selecione o tipo de status</option>
            <option value="yes">Ativo</option>
            <option value="no">Bloqueado</option>
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
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="mb-2 p-2 border border-gray-400 rounded"
            >
              <div className="flex">
                Nome:
                <Link to={`/edit_user_adm/${user.id}`}>
                  <h4 className=" underline font-bold">
                    {user.firstName} {user.lastName}
                  </h4>
                </Link>
              </div>

              <p>Telefone: {user.mobile}</p>
              <p>Email: {user.email}</p>
              <p>Tipo de Usuário: {user.user_type}</p>
              <p>
                Ativo:
                {user.active === "yes" && "Ativo"}
                {user.active === "no" && "Bloqueado"}
              </p>
            </div>
          ))}
        </div>
      </form>
    </UserPanel>
  );
}
