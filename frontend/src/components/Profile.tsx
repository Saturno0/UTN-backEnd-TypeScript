import { useState, useEffect } from "react";
import { logout, register } from "../hooks/userSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../hooks/store";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFormData({
      nombre: user.nombre,
      email: user.email,
      password: "", // por seguridad no mostramos password
    });
  }, [user]);

  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    setIsEditing(false);
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    dispatch(register(formData)); // actualiza redux y localStorage
    setIsEditing(false);
  };

  return (
    <div className="profile-container" id="main">
      <h2>Perfil de Usuario</h2>
      <div className="profile-field">
        <label>Nombre de usuario:</label>
        {isEditing ? (
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        ) : (
          <span>{user.nombre}</span>
        )}
      </div>
      <div className="profile-field">
        <label>Email:</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        ) : (
          <span>{user.email}</span>
        )}
      </div>
      <div className="profile-field">
        <label>Contraseña:</label>
        {isEditing ? (
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nueva contraseña"
            autoComplete="new-password"
          />
        ) : (
          <span>{user.password ? "•".repeat(user.password.length) : "********"}</span>
        )}
      </div>
      <div className="profile-buttons">
        {isEditing ? (
          <>
            <button onClick={handleSave}>Guardar</button>
            <button onClick={() => setIsEditing(false)}>Cancelar</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>Editar Perfil</button>
            <button onClick={handleLogout}>Cerrar sesion</button>
          </>
        )}
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default Profile;
