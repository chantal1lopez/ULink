import React, { useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/LoginForm.css';
import * as api from '../utils/api';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../store/userSlice';

function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post('/user/login', { email, password });

      if (response.token) {
        localStorage.setItem('token', response.token);
        dispatch(setUserInfo(response.user));
        router.push('/dashboard');
      }

    } catch (error) {
      if (error.message === '404') {
        setError('Usuario no existe.');
      } else if (error.message === '401') {
        setError('Contraseña incorrecta.');
      } else {
        setError('Error al iniciar sesión.');
      }
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <div className="login-container">
      <div className="horizontal-menu">
        <button className="horizontal-button" type="button">Iniciar Sesión</button>
        <button className="horizontal-button" type="button" onClick={handleRegister}>Registrate</button>
      </div>
      <img src="/images/logo.png" alt="ULINK" className="logo-name" />
      <form className="login-form" onSubmit={handleLogin}>
        <img src="/images/simbolo.png" alt="Logo" className="logo-symbol" />

        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@gmail.com"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>
        <button className="login-button" type="submit">Iniciar Sesión</button>
        <button className="register-button" type="button" onClick={handleRegister}>Registrate</button>

        <p className="error-message">{error}</p>
      </form>
    </div>
  );
}

export default Login;
