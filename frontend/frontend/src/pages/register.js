import React, { useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/LoginForm.css';
import * as api from '../utils/api';

function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden.')
      return;
    }

    try {
      const response = await api.post('/user/register', { email, password });

      if (response.token) {
        localStorage.setItem('token', response.token);
        router.push('/dashboard');
      }

    } catch (error) {
      if (error.message === '409') {
        setError('Usuario ya existe.');
      } else {
        setError('Error al registrarse. Por favor, intente nuevamente.');
      }
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="login-container">
      <div className="horizontal-menu">
        <button className="horizontal-button" type="button" onClick={handleLogin}>Iniciar Sesión</button>
        <button className="horizontal-button" type="button">Registrate</button>
      </div>
      <img src="/images/logo.png" alt="ULINK" className="logo-name" />
      <form className="login-form" onSubmit={handleRegister}>
        <img src="/images/simbolo.png" alt="Logo" className="logo-symbol" />

        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="contraseña"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="confirmación de la contraseña"
            required
          />
        </div>
        <button className="login-button" type="submit">Registrarse</button>
        <button className="register-button" type="button" onClick={handleLogin}>Iniciar Sesión</button>

        <p className="error-message">{error}</p>
      </form>
    </div>
  );
}

export default Register;
