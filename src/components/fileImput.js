import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../utils";

export const FileInput = ({
  label,
  name,
  accept,
  id,
  placeholder,
  uId,
  pId,
  visibilityType,
}) => {
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]); // Adicione essa linha para armazenar os arquivos enviados
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Adicione essa função para obter a lista de arquivos enviados assim que o componente for montado

    axios
      .post(`${apiUrl}/api/projects/${id}/get/${uId}/${pId}`)
      .then((response) => {
        setUploadedFiles(response.data.files); // Aqui deve ser passado res.data em vez de uploadedFiles
        setIsLoaded(true);
      })
      .catch((error) => {
        setIsLoaded(false);
        console.error(error);
      });

    console.log(uploadedFiles);
    console.log(response);
  }, [id, uId, response, pId]); // Apenas execute a função uma vez, quando o componente for montado
  /* const fetchFiles = async () => {
    const res = await axios(`${apiUrl}/api/projects/${id}/get/${uId}/${pId}`);
    setUploadedFiles(res.data.files); // Aqui deve ser passado res.data em vez de uploadedFiles
    setIsLoaded(true);

    console.log(uploadedFiles);
    console.log(res);
  }; */
  //fetchFiles();
  const handleChange = (event) => {
    // Valide se o arquivo é um PDF
    //if (event.target.files[0].type === "application/pdf") {
    setFiles(event.target.files);
    if (event.target.files.length > 0) {
      handleSubmit(event);
    } else {
      console.log(files);
    }
    //} else {
    // Exiba uma mensagem de erro caso o arquivo não seja um PDF
    //console.log("O arquivo deve ser um PDF");
    //}
  };
  const handleRename = async (fileId) => {
    // Solicitar ao usuário um novo nome para o arquivo
    let newName = window.prompt("Insira o novo nome do arquivo:");
    newName = newName.replace(/[/\\]/g, "-"); // Substitua barras e contra-barras por sublinhados

    // Verifique se o nome do arquivo já possui a extensão .pdf
    if (!newName.endsWith(".pdf") || !newName.endsWith(".PDF")) {
      // Adicione a extensão .pdf ao nome do arquivo
      newName += ".pdf";
    }

    // Enviar uma requisição para atualizar o nome do arquivo
    try {
      const res = await axios.post(
        `${apiUrl}/api/projects/${id}/rename/${uId}/${fileId}/${pId}`,
        {
          name: newName,
        }
      );
      setResponse(res.data);
      console.log(res);

      // Atualizar a lista de arquivos
      window.fetchFiles();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (fileId) => {
    // Enviar uma requisição para excluir o arquivo
    try {
      const res = await axios.post(
        `${apiUrl}/api/projects/${id}/delete/${uId}/${fileId}/${pId}`
      );
      setResponse(res.data);
      console.log(res.data, fileId);

      // Atualizar a lista de arquivos
      window.fetchFiles();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(response);
    const formData = new FormData();
    formData.append("files", files[0]);

    axios
      .post(`${apiUrl}/api/projects/${id}/files/upload/${uId}/${pId}`, formData)
      .then((response) => {
        setResponse(response.data);
        console.log(pId);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
        console.log(formData);
      });
  };

  return (
    <>
      {visibilityType === "all" && (
        <form onSubmit={handleSubmit} id={id}>
          {response.status === 0 && (
            <div className="response bg-red-500 flex justify-center my-3 text-lg b-0">
              {response.message}
            </div>
          )}
          {response.status === 1 && (
            <div className="response bg-green-500 flex justify-center my-3 text-lg b-0">
              {response.message}
            </div>
          )}

          {/* Adicione essa parte para exibir a lista de arquivos enviados */}
          <div className="mt-5 text-white">
            <h3 className="text-xl text-white underline">
              Arquivos enviados {/* {JSON.stringify(uploadedFiles)} */}
            </h3>
            {!uploadedFiles ||
            uploadedFiles.length === 0 ||
            uploadedFiles[1] === "pasta nao encontrada" ? (
              <p>Não há arquivos enviados</p>
            ) : (
              <ul>
                {uploadedFiles.map((file, key) => (
                  <li
                    key={key}
                    className="my-2 flex items-center text-center gap-2"
                  >
                    <div className="w-1/2 truncate">
                      <a
                        className="underline"
                        href={`${apiUrl}/usersDocs/${uId}/${pId}/${id}/${file}`}
                        target="_blank"
                        download
                      >
                        {file} ( ver/baixar )
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>
      )}
      {isLoaded && (
        <>
          {!visibilityType && (
            <form onSubmit={handleSubmit} id={id}>
              <input
                className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                type="file"
                label={label}
                id={id}
                name={name}
                accept={accept}
                onChange={handleChange}
                placeholder={placeholder}
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Upload
              </button>
              {response.status === 0 && (
                <div className="response bg-red-500 flex justify-center my-3 text-lg b-0">
                  {response.message}
                </div>
              )}
              {response.status === 1 && (
                <div className="response bg-green-500 flex justify-center my-3 text-lg b-0">
                  {response.message}
                </div>
              )}

              {/* Adicione essa parte para exibir a lista de arquivos enviados */}
              <div className="mt-5 text-white">
                <h3 className="text-xl text-white underline">
                  Arquivos enviados {/* {JSON.stringify(uploadedFiles)} */}
                </h3>
                {!uploadedFiles ||
                uploadedFiles.length === 0 ||
                uploadedFiles[1] === "pasta nao encontrada" ? (
                  <p>Não há arquivos enviados</p>
                ) : (
                  <ul>
                    {uploadedFiles.map((file, key) => (
                      <li
                        key={key}
                        className="my-2 flex items-center text-center gap-2"
                      >
                        <div className="w-1/2 truncate">
                          <a
                            className="underline"
                            href={`${apiUrl}/usersDocs/${uId}/${pId}/${id}/${file}`}
                            target="_blank"
                            download
                          >
                            {file} ( ver/baixar )
                          </a>
                        </div>
                        <div className="w-1/4">
                          <div
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => handleRename(file)}
                          >
                            Renomear
                          </div>
                        </div>
                        <div className="w-1/4">
                          <div
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => handleDelete(file)}
                          >
                            Excluir
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </form>
          )}
        </>
      )}
    </>
  );
};
