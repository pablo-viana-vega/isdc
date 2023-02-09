import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout } from "../components/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { apiUrl } from "../utils";

//fontawesome.library.add(faEyeSlash, faEye);

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState({});

  useEffect(() => {
    const loggedId = localStorage.getItem("logged_id");
    if (loggedId) {
      window.location.href = "/userpanel";
    }
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post(`${apiUrl}/api/user/login`, {
        email,
        password,
      })
      .then((response) => {
        setResponse(response.data);
        if (response.data.status === 1 && response.data.logged_id) {
          const form = document.querySelector("form");
          localStorage.setItem("logged_id", response.data.logged_id);
          localStorage.setItem("user_type", response.data.user_type);
          console.log(form);
          console.log(response);

          form.style.visibility = "hidden"; // or
          form.style.display = "none"; // depending on what you're doing

          setTimeout(function () {
            window.location.href = "/userpanel";
          }, 3000);
        } else {
          console.log(response);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }
  function goToPasswordRecovery() {
    window.location.href = "/password-recovery";
  }

  return (
    <Layout>
      <div className=" w-full flex flex-col items-center justify-center text-white">
        <h2 className="mb-7 text-3xl md:text-2xl xl:text-5xl lg:text-4xl sm:text-6xl text-center">
          Faça seu login
        </h2>
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
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Senha
            </label>
            <div className="flex">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Entrar
            </button>
          </div>
        </form>
        <a href="#" onClick={goToPasswordRecovery}>
          Esqueceu a senha?
        </a>
        {response.status === 0 && (
          <div className="response bg-red-500 flex justify-center text-lg">
            {response.message}
          </div>
        )}
        {response.status === 1 && (
          <div className="response bg-green-500 flex justify-center text-lg">
            {response.message}
            <br />
            {"Entrando no painel de usuário."}
            <br />
            {"Aguarde..."}
          </div>
        )}
      </div>
    </Layout>
  );
}
