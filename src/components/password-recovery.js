import React, { useState } from "react";
import axios from "axios";
import { apiUrl } from "../utils";
import { Layout } from "./layout";

export default function PassRec() {
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post(`${apiUrl}/api/user/forgot`, {
        email,
      })
      .then((response) => {
        setResponse(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-md w-full pt-8 ">
        <h2 className="text-2xl font-bold mb-4 text-white">Recuperar senha</h2>
        {response.status === 1 && (
          <p className="text-green-500 mb-4">{response.message}</p>
        )}
        {response.status === 0 && (
          <p className="text-red-500 mb-4">{response.message}</p>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
