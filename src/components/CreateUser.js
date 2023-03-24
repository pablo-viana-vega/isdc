import React, { useState } from "react";
import axios from "axios";
import { Layout } from "../components/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { apiUrl } from "../utils";
import UserPanel from "./user-panel";

export default function CreateUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [usetype, setUserType] = useState("");

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mobile.length !== 11) {
      alert("O número de celular deve conter 11 dígitos");
      return;
    }
    /*  axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*"; */
    axios
      .post(`${apiUrl}/api/user/create`, {
        firstName: firstName,
        lastName: lastName,
        mobile: mobile,
        email: email,
        password: password,
        user_type: "UF",
        active: "yes",
      })
      .then((response) => {
        setResponse(response.data);
        if (response.data.status === 1) {
          const fields = document.querySelectorAll(".flex.flex-wrap.-mx-3");
          console.log(fields);
          console.log(response);
          for (var i = 0; i < fields.length; i++) {
            fields[i].style.visibility = "hidden"; // or
            fields[i].style.display = "none"; // depending on what you're doing
          }
          setTimeout(function () {
            window.location.href = "/create-project";
          }, 2000);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <UserPanel>
      <div className="register self-center  flex flex-col mx-5 justify-center items-center text-white">
        {}
        <h2 className="mb-7 text-3xl md:text-2xl xl:text-5xl lg:text-4xl sm:text-6xl text-center">
          Faça o cadastro do seu cliente ele irá receber um email com acesso
          para acompanhar os projetos.
        </h2>
        <form className="w-full max-w-lg self-center " onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-xs font-bold mb-2"
                htmlFor="firstName"
              >
                Primeiro Nome
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="firstName"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-xs font-bold mb-2"
                htmlFor="lastName"
              >
                Sobrenome
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="lastName"
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-xs font-bold mb-2"
                htmlFor="mobile"
              >
                Telefone
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="mobile"
                type="text"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                maxLength="11"
                minLength="11"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-xs font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block text-sm font-bold mb-2"
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
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full px-3">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Inscreva-se
              </button>
            </div>
          </div>
          {response.status === 0 && (
            <div className="response bg-red-500 flex justify-center text-lg">
              {response.message}
            </div>
          )}
          {response.status === 1 && (
            <div className="response bg-green-500 flex justify-center text-lg">
              {response.message}
              <br />
              {"Você irá cadastrar o projeto deste usuário ."}
              <br />
              {"Aguarde..."}
            </div>
          )}
        </form>
      </div>
    </UserPanel>
  );
}

/* import { Layout } from "../components/layout";
import React, { useState } from "react";
/* import ReactDOM from "react-dom";
import axios from "axios";

export default function Register() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // User Login info
  const database = [
    {
      username: "user1",
      password: "pass1",
    },
    {
      username: "user2",
      password: "pass2",
    },
  ];

  const errors = {
    uname: "invalid username",
    pass: "invalid password",
  };

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    // Find user login info
    const userData = database.find((user) => user.username === uname.value);

    // Compare user info
    if (userData) {
      if (userData.password !== pass.value) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        setIsSubmitted(true);
      }
    } else {
      // Username not found
      setErrorMessages({ name: "uname", message: errors.uname });
    }
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label className="text-white font-semibold">Nome </label>
          <input
            type="text"
            name="firstName"
            className="w-full p-2 rounded-xl my-2"
            required
          />
          {renderErrorMessage("firstName")}
        </div>
        <div className="input-container">
          <label className="text-white font-semibold">Sobrenome </label>
          <input
            type="text"
            name="lastName"
            className="w-full p-2 rounded-xl my-2"
            required
          />
          {renderErrorMessage("lastName")}
        </div>
        <div className="input-container">
          <label className="text-white font-semibold">Telefone </label>
          <input
            type="number"
            name="mobile"
            className="w-full p-2 rounded-xl my-2"
            required
          />
          {renderErrorMessage("mobile")}
        </div>
        <div className="input-container">
          <label className="text-white font-semibold">Email </label>
          <input
            type="text"
            name="email"
            className="w-full p-2 rounded-xl my-2"
            required
          />
          {renderErrorMessage("email")}
        </div>
        <div className="input-container">
          <label className="text-white font-semibold">Password </label>
          <input
            type="password"
            name="password"
            className="w-full p-2 rounded-xl my-2"
            required
          />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input
            className="bg-gray-500 rouded-xl mt-2 py-2 px-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-green-300 hover:-tranlate-y-1"
            type="submit"
            value={"Cadastrar"}
          />
        </div>
      </form>
    </div>
  );

  return (
    <Layout>
      <div className="register  w-full flex flex-col items-center text-white">
        <div className="login-form flex justify-evenly items-center flex-col gap-y-4 xl:text-3xl lg:text-2xl">
          <div className="title text-white font-semibold">
            Faça Seu Cadastro
          </div>
          {isSubmitted ? <div>Registrado com sucesso</div> : renderForm}
        </div>
      </div>
    </Layout>
  );
}
 */
