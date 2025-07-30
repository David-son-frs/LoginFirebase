import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Para navegação entre páginas
import './Login.css';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebase'; // ajuste o caminho se necessário

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aqui você colocaria a lógica real de login via email e senha
    console.log('Tentando login com:', email, password);

    // Exemplo: depois de login bem sucedido, redirecionar:
    // navigate('/dashboard');
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      console.log('Usuário:', user);
      console.log('ID Token:', idToken);

      const response = await fetch("http://localhost:8080/api/usuario", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // Envie dados adicionais, se precisar
      });

      if (!response.ok) {
        throw new Error("Erro ao autenticar no backend");
      }

      const data = await response.json();
      console.log("Resposta do backend:", data);

      alert(`Bem-vindo, ${user.displayName}!`);
      // Após login, redirecione para página principal ou dashboard
      navigate('/');
    } catch (error) {
      console.error("Erro no login com Google:", error);
      alert("Erro ao logar com Google.");
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <header className="login-header">
          <h2>Bem-vindo de volta ao ArtemiScore!</h2>
          <p>Entre na sua conta para continuar sua jornada</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="seu.email@exemplo.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              name="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Digite sua senha"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                name="password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                className="toggle-password-btn"
              >
                <i className={`ri-${showPassword ? 'eye-line' : 'eye-off-line'}`}></i>
              </button>
            </div>
          </div>

          <div className="remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" name="remember" />
              <label htmlFor="remember">Lembrar-me</label>
            </div>
            <a href="#" className="forgot-password" onClick={e => e.preventDefault()}>
              Esqueceu a senha?
            </a>
          </div>

          <button type="submit" className="login-button">Entrar</button>

          <div className="social-login">
            <p>Ou entre com o Google</p>
            <div className="social-buttons">
              <button type="button" className="social-btn google" onClick={handleGoogleLogin}>
                <i className="ri-google-fill"></i> Entrar com Google
              </button>
            </div>
          </div>

          <div className="register-link">
            <p>
              Não tem uma conta? <Link to="/cadastro">Crie agora</Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
