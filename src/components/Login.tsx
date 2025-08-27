import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../hooks/userSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({ username, email }));
    dispatch(register({ username, email, password }));
    navigate(-1)
  };

  return (
    <main className="login-page-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Crear cuenta</h2>

          <label className="login-label">Nombre de usuario</label>
          <input
            className="login-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Ingrese su nombre de usuario'
            required
          />

          <label htmlFor='email' className='login-label'>Email</label>
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Ingrese su email'
            required
          />

          <label className="login-label">Contraseña</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Ingrese su contraseña'
            required
          />

          <button className="login-button" type="submit">
            Registrarse
          </button>
        </form>
    </main>
  );
};

export default Login;
