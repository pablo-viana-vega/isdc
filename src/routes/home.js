import { Layout } from "../components/layout";
import { useEffect } from "react";
import { apiUrl } from "../utils";

export default function Home() {
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };
  useEffect(() => {
    var addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);
  return (
    <Layout>
      {``}
      <div
        id="google_translate_element"
        className="home justify-center  w-full flex flex-col items-center align-center text-white"
      >
        <div className=" flex flex-col justify-center">
          <h1 className="text-4xl md:text-4xl xl:text-7xl lg:text-6xl sm:text-8xl text-center">
            Bem vindo
          </h1>

          <h2 className="text-3xl md:text-2xl xl:text-5xl lg:text-4xl sm:text-6xl text-center">
            Cadastre seus projetos aqui
          </h2>
        </div>
      </div>
    </Layout>
  );
}
