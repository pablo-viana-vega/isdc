import React from "react";
import ProgressBar from "./progressbar";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col items-center justify-between h-screen">
        <h1 className="absolute top-40 underline text-4xl font-bold mb-4 text-center">
          Aguarde. Seu Relatório está sendo gerado. Ele pode demorar um pouco,
          dependendo da quantidade de arquivos anexados. Aguarde. Seu Relatório
          está sendo gerado. Ele pode demorar um pouco, dependendo da quantidade
          de arquivos anexados. ATENÇÃO!!! CERTIFIQUE-SE DE QUE SEU BLOQUEADOR
          DE POPUP ESTEJA DESATIVADO PARA ABRIR O ARQUIVO AUTOMATICAMENTE. CASO
          ELE NAO ABRA, ELE VAI ESTAR EM UM LINK NA PÁGINA DE DETALHES DO
          PROJETO NO PRIMEIRO CAMPO DE ENVIAR ARQUIVOS "Último Relatório
          Completo"
        </h1>
        <div className="loader">
          <div className="line line1"></div>
          <div className="line line2"></div>
          <div className="line line3"></div>
          <div className="line line4"></div>
        </div>
      </div>
      <ProgressBar />
    </>
  );
}
