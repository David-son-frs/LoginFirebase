import React, { useState, useEffect } from 'react';

const Cadastro = () => {
  // Estados
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
  const [profilePic, setProfilePic] = useState('https://raw.githubusercontent.com/Thallys-San/ArtemiScore/main/profile_pic.png');
  const [genreWarning, setGenreWarning] = useState(false);
  const [platformWarning, setPlatformWarning] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Atualiza contador de caracteres da biografia
  useEffect(() => {
    setCharCount(formData.bio.length);
  }, [formData.bio]);

  // Manipuladores de eventos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Limpa erros específicos ao modificar o campo
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleGenreSelect = (e) => {
    const options = [...e.target.selectedOptions];
    const values = options.map(opt => opt.value);
    
    if (values.length > 5) {
      setGenreWarning(true);
      return;
    }
    
    setGenreWarning(false);
    setFormData({ ...formData, favoriteGenres: values });
  };

  const handlePlatformSelect = (e) => {
    const options = [...e.target.selectedOptions];
    const values = options.map(opt => opt.value);
    
    if (values.length > 3) {
      setPlatformWarning(true);
      return;
    }
    
    setPlatformWarning(false);
    setFormData({ ...formData, preferredPlatforms: values });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validação do arquivo
    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Informe um nome de usuário';
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Informe um e-mail válido';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) return;
    
    try {
      const userData = {
        nome: formData.username,
        email: formData.email,
        senha: formData.password,
        bio: formData.bio,
        foto_perfil: profilePic,
        preferencias_jogos: formData.favoriteGenres,
        plataformas_utilizadas: formData.preferredPlatforms
      };

      const response = await fetch('http://localhost:8080/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cadastrar usuário');
      }

      alert('Cadastro realizado com sucesso!');
      // Redirecionar para login ou página inicial
      // history.push('/login');
      
    } catch (error) {
      console.error('Erro no Cadastro:', error);
      setGeneralError(error.message || 'Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="form-container">
      <h1 className="title">Crie Sua Conta</h1>
      <p className="subtitle">
        Junte-se à comunidade ArtemiScore e comece a explorar o universo dos jogos!
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <fieldset>
          <div className="input-group profile-picture-container">
            <label>Foto de Perfil</label>
            <div className="avatar-upload">
              <div className="avatar-edit">
                <input 
                  type="file" 
                  id="avatarUpload" 
                  accept=".png, .jpg, .jpeg"
                  onChange={handleImageUpload} 
                />
                <label htmlFor="avatarUpload"></label>
              </div>
              <div className="avatar-preview">
                <div 
                  id="avatarPreview" 
                  style={{ backgroundImage: `url('${profilePic}')` }}
                ></div>
              </div>
            </div>
            <small className="form-text-hint">
              Formatos suportados: JPG, PNG, JPEG (Máx. 2MB)
            </small>
          </div>

          <div className="input-group">
            <label htmlFor="username">Nome de Usuário</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Seu nome de usuário"
              value={formData.username}
              onChange={handleInputChange}
              required
              autoComplete="username"
            />
            {errors.username && (
              <p className="error-message">{errors.username}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="seuemail@exemplo.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
            />
            {errors.email && (
              <p className="error-message">{errors.email}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="8"
              autoComplete="new-password"
            />
            <small id="password-hint" className="form-text-hint">
              Use 8 ou mais caracteres, incluindo letras e números.
            </small>
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="confirm-password">Confirmar Senha</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirm-password"
              placeholder="Repita sua senha"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              minLength="8"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="bio">
              Biografia (opcional)<span id="charCount">({charCount}/300)</span>
            </label>
            <textarea
              name="bio"
              id="bio"
              rows="4"
              placeholder="Conte um pouco sobre você..."
              value={formData.bio}
              onChange={handleInputChange}
              maxLength="300"
            ></textarea>
          </div>
        </fieldset>

        <fieldset>
          <legend className="visually-hidden">Preferências de Jogo</legend>
          <br />
          <div className="input-group">
            <label htmlFor="favorite-genres">
              Gêneros Favoritos (selecione até 5 - opcional)
            </label>
            <select
              name="favorite_genres"
              id="favorite-genres"
              multiple
              size="5"
              value={formData.favoriteGenres}
              onChange={handleGenreSelect}
            >
              <option value="Ação">Ação</option>
              <option value="FPS">FPS</option>
              <option value="Battle royale">Battle royale</option>
              <option value="PVP">PVP</option>
              <option value="Super-herói">Super-herói</option>
              <option value="Aventura">Aventura</option>
              <option value="RPG">RPG</option>
              <option value="Estratégia">Estratégia</option>
              <option value="Simulação">Simulação</option>
              <option value="Indie">Indie</option>
              <option value="Esporte">Esporte</option>
              <option value="Corrida">Corrida</option>
              <option value="Luta">Luta</option>
              <option value="Terror">Terror</option>
              <option value="Puzzle">Puzzle</option>
            </select>
            {genreWarning && (
              <small id="genre-warning" style={{ color: 'red' }}>
                Você pode selecionar no máximo 5 gêneros.
              </small>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="preferred-platforms">
              Plataformas Preferidas (selecione até 3 - opcional)
            </label>
            <select
              name="preferred_platforms"
              id="preferred-platforms"
              multiple
              value={formData.preferredPlatforms}
              onChange={handlePlatformSelect}
            >
              <option value="PC">PC</option>
              <option value="PlayStation 5">PlayStation 5</option>
              <option value="Xbox Series X/S">Xbox Series X/S</option>
              <option value="Nintendo Switch">Nintendo Switch</option>
              <option value="PlayStation 4">PlayStation 4</option>
              <option value="Xbox One">Xbox One</option>
              <option value="Mobile">Mobile</option>
              <option value="Nenhuma específica">Nenhuma específica</option>
            </select>
            {platformWarning && (
              <small id="platform-warning" style={{ color: 'red' }}>
                Você pode selecionar no máximo 3 plataformas.
              </small>
            )}
          </div>
        </fieldset>

        <button className="sign" type="submit">
          Criar Conta
        </button>
        
        {generalError && (
          <p id="generalErrorMessage" className="error-message">
            {generalError}
          </p>
        )}
      </form>

      <br />
      <p className="login-link">
        Já tem uma conta?
        <a rel="noopener noreferrer" href="./login.html" className="">
          Faça Login
        </a>
      </p>
    </div>
  );
};

export default Cadastro;