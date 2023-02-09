import React from "react";
import { Layout } from "../components/layout";

export default function AboutUs() {
  return (
    <Layout>
      <div className="home  w-full flex flex-col items-center text-white">
        <div className="flex flex-col items-center justify-center p-8">
          <h1 className="text-5xl font-bold text-center">Sobre nós</h1>
          <p className="text-lg mt-8 py-4 px-8">
            Nós somos uma plataforma de cadastro de projetos desenvolvida para
            ajudar empreendedores e profissionais a gerenciar seus projetos de
            maneira mais eficiente. Com a nossa ferramenta, é possível criar,
            atualizar e acompanhar o progresso de projetos de forma rápida e
            intuitiva.
          </p>
          <div className="bg-gray-800 rounded-lg mt-8 py-4 px-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Como funciona</h2>
            <p className="text-lg">
              Para começar a usar a nossa plataforma, basta se cadastrar e criar
              um novo projeto.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
