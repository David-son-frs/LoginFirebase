import React, { useState } from 'react';
import './Login.css';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebase'; // certifique-se que o caminho esteja correto

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // aqui vai a lógica para login com e-mail e senha, se necessário
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      console.log('Usuário:', user);
      console.log('ID Token:', idToken);

      // Aqui você pode enviar o token pro seu backend
      // await fetch("http://localhost:8080/api/usuario", {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${idToken}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

      alert(`Bem-vindo, ${user.displayName}!`);
    } catch (error) {
      console.error("Erro no login com Google:", error);
      alert("Erro ao logar com Google.");
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <div className="login-header">
          <h2>Bem-vindo de volta ao ArtemiScore!</h2>
          <p>Entre na sua conta para continuar sua jornada</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="seu.email@exemplo.com"
              required
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
              />
              <i
                className={`ri-${showPassword ? 'eye-line' : 'eye-off-line'} toggle-password`}
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <div className="remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Lembrar-me</label>
            </div>
            <a href="#" className="forgot-password">Esqueceu a senha?</a>
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
            <p>Não tem uma conta? <a href="#">Crie agora</a></p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
