import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cadastro = () => {
  const navigate = useNavigate();

  // Estado
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    favoriteGenres: [],
    preferredPlatforms: []
  });

  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(formData.bio.length);
  }, [formData.bio]);

  // Manipuladores de entrada
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar e enviar dados
  };

  return (
    <div className="form-container">
      <h1 className="title">Crie Sua Conta</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Nome de Usuário</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Outros campos */}

        <button type="submit">Criar Conta</button>
      </form>
    </div>
  );
};

export default Cadastro;
