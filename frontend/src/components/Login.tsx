import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUser } from "../hooks/users";
import { register } from "../hooks/userSlice";
import type { AppDispatch } from "../hooks/store";
import type { LoginUserData } from "../hooks/users/useLoginUser";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loginUser, loading, error } = useLoginUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isSubmitDisabled = useMemo(() => {
    return loading || !email || !password;
  }, [email, loading, password]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await loginUser({ email, password });

    if (!response) {
      return;
    }

    const userData: LoginUserData | undefined = response.user;
    const resolvedNombre = userData?.nombre ?? '';
    const resolvedEmail = userData?.email ?? email;
    const resolvedRol = userData?.rol ?? "user";
    const resolvedActivo = userData?.activo ?? true;

    dispatch(
      register({
        nombre: resolvedNombre,
        email: resolvedEmail,
        password,
        activo: resolvedActivo,
        rol: resolvedRol,
      })
    );
    navigate(-1);
  };

  return (
    <main className="login-page-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Iniciar sesión</h2>

        <label htmlFor="login-email" className="login-label">
          Email
        </label>
        <input
          className="login-input"
          type="email"
          id="login-email"
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

        {error && <p className="login-error">{error}</p>}

        <button className="login-button" type="submit" disabled={isSubmitDisabled}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>

        <p className="login-helper-text">
          ¿No tenés cuenta? <Link to="/register">Crear una cuenta</Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
