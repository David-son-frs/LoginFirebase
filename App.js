import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Cadastro from './components/Cadastro';  // cuidado com o "C" maiúsculo

function App() {
  return (
    <Router>
      <Routes>
        {/* Defina a rota padrão para Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Redireciona "/" para "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Opcional: rota para páginas não encontradas */}
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
