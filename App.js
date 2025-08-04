import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import RecuperarSenha from '../pages/RecuperarSenha';  // importe o componente

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} /> {/* rota para recuperação */}
    </Routes>
  );
};

export default App;
