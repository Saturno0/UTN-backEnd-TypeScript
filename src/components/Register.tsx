import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../hooks/userSlice";
import type { AppDispatch } from "../hooks/store";
import useUsers from "../hooks/useUser.ts";

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const {
    createUser,
    loading: { create: loadingCreate },
    error: { create: errorCreate },
  } = useUsers();

  const [email, setEmail] = useState("");
  const [nombre, setnombre] = useState("");
  const [password, setPassword] = useState("");

  const isSubmitDisabled = useMemo(() => {
    return loadingCreate || !email || !nombre || !password;
  }, [email, loadingCreate, password, nombre]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await createUser({
      nombre: nombre,
      email: email,
      password: password,
    });

    if (!response) {
      return;
    }

    dispatch(register({ nombre, email, password, activo: true, rol: "user" }));
    navigate(-1);
  };

  return (
    <main className="login-page-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Crear cuenta</h2>

        <label className="login-label">Nombre de usuario</label>
        <input
          className="login-input"
          type="text"
          value={nombre}
          onChange={(event) => setnombre(event.target.value)}
          placeholder="Ingrese su nombre de usuario"
          required
        />

        <label htmlFor="email" className="login-label">
          Email
        </label>
        <input
          className="login-input"
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Ingrese su email"
          required
        />

        <label className="login-label">Contraseña</label>
        <input
          className="login-input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Ingrese su contraseña"
          required
        />

        {errorCreate && <p className="login-error">{errorCreate}</p>}

        <button className="login-button" type="submit" disabled={isSubmitDisabled}>
          {loadingCreate ? "Creando cuenta..." : "Registrarse"}
        </button>

        <p className="login-helper-text">
          ¿Ya tenés una cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </form>
    </main>
  );
};

export default Register;
