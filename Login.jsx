import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../components/layout/css/Login.css";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, provider } from "../components/firebase";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const resetEmailInputRef = useRef(null);

  // Foco automático no input do modal de recuperação de senha
  useEffect(() => {
    if (showResetPassword && resetEmailInputRef.current) {
      resetEmailInputRef.current.focus();
    }
  }, [showResetPassword]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Validação de formato de email em tempo real
  const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setError("");
    setIsLoading(true);

    if (!validateEmailFormat(email)) {
      setEmailError("Por favor, insira um email válido.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      navigate("/home");
    } catch (error) {
      setIsLoading(false);
      switch (error.code) {
        case "auth/user-not-found":
          setError("O email não está cadastrado.");
          break;
        case "auth/wrong-password":
          setError("Senha incorreta. Tente novamente.");
          break;
        case "auth/invalid-email":
          setEmailError("Email inválido. Verifique o formato.");
          break;
        case "auth/too-many-requests":
          setError("Muitas tentativas. Tente novamente mais tarde.");
          break;
        default:
          setError("Erro ao fazer login. Tente novamente.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("user", JSON.stringify({ uid: user.uid, email: user.email }));
      navigate("/");
    } catch (error) {
      setError("Erro ao logar com Google. Tente novamente.");
      console.error("Erro no login com Google:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setEmailError("");
    setError("");

    if (!email) {
      setShowResetPassword(true);
      return;
    }

    if (!validateEmailFormat(email)) {
      setEmailError("Por favor, insira um email válido.");
      setShowResetPassword(true);
      return;
    }

    setIsLoading(true);
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        setEmailError("Este email não está cadastrado.");
        setShowResetPassword(true);
        setIsLoading(false);
        return;
      }

      await sendPasswordResetEmail(auth, email);
      setShowResetPassword(false);
      setError("Email de recuperação enviado com sucesso. Verifique sua caixa de entrada.");
      setTimeout(() => navigate("/reset-password", { state: { email } }), 2000);
    } catch (error) {
      setIsLoading(false);
      console.error("Erro ao verificar email:", error);
      setEmailError(
        error.code === "auth/invalid-email"
          ? "Email inválido. Verifique o formato."
          : "Erro ao processar solicitação. Tente novamente."
      );
      setShowResetPassword(true);
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <div className="title-container">
          <h2>Bem-vindo ao ArtemiScore!</h2>
          <p>Entre na sua conta para continuar sua jornada</p>
        </div>

        {(error || emailError) && (
          <div className="error-message">
            {error || emailError}
            {(error.includes("não está cadastrado") || emailError.includes("não está cadastrado")) && (
              <Link to="/cadastro" className="register-link-text">
                Cadastre-se
              </Link>
            )}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="seu.email@exemplo.com"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
                setError("");
              }}
              autoComplete="email"
              aria-describedby="email-error"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="form-input"
                placeholder="Digite sua senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                className="toggle-password"
              >
                <i className={`ri-${showPassword ? "eye-line" : "eye-off-line"}`}></i>
              </button>
            </div>
          </div>

          <div className="remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" name="remember" />
              <label htmlFor="remember">Lembrar-me</label>
            </div>
            <button
              type="button"
              onClick={handlePasswordReset}
              className="forgot-password"
              disabled={isLoading}
            >
              Esqueceu a senha?
            </button>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={!email || !password || isLoading}
          >
            {isLoading ? "Carregando..." : "Entrar"}
          </button>

          <div className="social-login">
            <p>Ou entre com</p>
            <button
              type="button"
              className="google-btn"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <img
                src="data:image/png;base64,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"
                alt="Google logo"
                className="google-logo"
              />
              Entrar com Google
            </button>
          </div>

          <div className="register-link">
            <p>
              Não tem uma conta? <Link to="/cadastro">Crie agora</Link>
            </p>
          </div>
        </form>

        {showResetPassword && (
          <div className="reset-password-modal">
            <div className="modal-content">
              <h3>Recuperação de Senha</h3>
              <p>Insira seu email para receber um link de redefinição:</p>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="seu.email@exemplo.com"
                className="form-input"
                ref={resetEmailInputRef}
                aria-describedby="reset-email-error"
              />
              {emailError && (
                <p className="error-message">
                  {emailError}
                  {emailError.includes("não está cadastrado") && (
                    <Link to="/cadastro" className="register-link-text">
                      Cadastre-se
                    </Link>
                  )}
                </p>
              )}
              <div className="modal-buttons">
                <button
                  className="login-button"
                  onClick={() => {
                    setShowResetPassword(false);
                    handlePasswordReset();
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar"}
                </button>
                <button
                  className="forgot-password"
                  onClick={() => setShowResetPassword(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Login;
