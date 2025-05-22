import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.scss';
import '../styles/modal.scss';
import { login } from '../utils/auth';  // Esta es la función modificada con el usuario de prueba

// Importamos los íconos
import logo from '../assets/logo.svg';
import userIcon from '../assets/user.svg';
import keyIcon from '../assets/key.svg';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const result = login(username, password);
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="form-container">
      <div className="container-logo">
        <img src={logo} alt="Logo" className="logo-container" />
      </div>

      <div className="form-container">
        {/* Input de usuario */}
        <div className="input-group">
          <div className="input-line">
            <img src={userIcon} alt="User Icon" className="input-icon" />
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="username-input"
            />
          </div>
        </div>

        {/* Input de contraseña */}
        <div className="input-group">
          <div className="input-line">
            <img src={keyIcon} alt="Key Icon" className="input-icon" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
            />
          </div>
          <span
            className="forgot-password"
            onClick={() => navigate('/ForgotPassword')}
            data-testid="forgot-password-link"
          >
            Restablecer tu contraseña
          </span>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="modal" data-testid="error-modal">
            <div className="modal-content">
              <p data-testid="error-message">{error}</p>
              <button
                onClick={() => setError('')}
                data-testid="close-error-button"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={handleLogin}
            data-testid="login-button"
          >
            Iniciar Sesión
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/register')}
            data-testid="register-button"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;