import type React from "react";
import type { FormData } from "../types/types";

interface CheckOutFormProps {
    handleSubmit: (e: React.FormEvent) => void,
    formData: FormData,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

const CheckOutForm: React.FC<CheckOutFormProps> = ({ handleSubmit, formData, handleInputChange }) => {
    return(
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="nombre">Nombre completo</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="direccion">Dirección de envío</label>
                <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="ciudad">Ciudad</label>
                    <input
                        type="text"
                        id="ciudad"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="codigoPostal">Código Postal</label>
                    <input
                        type="text"
                        id="codigoPostal"
                        name="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="metodoPago">Método de pago</label>
                <select
                    id="metodoPago"
                    name="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleInputChange}
                    required
                >
                    <option value="tarjeta">Tarjeta de crédito</option>
                    <option value="transferencia">Transferencia bancaria</option>
                </select>
            </div>
            <button type="submit" className="checkout-button">
                Confirmar Compra
            </button>
        </form>
    );
}

export default CheckOutForm;