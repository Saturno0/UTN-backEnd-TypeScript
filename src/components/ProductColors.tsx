import type React from "react";
import type { Product } from "../types/types";

interface ProductColorsProps {
    product: Product,
    quantities: Record<string, number>,
    onQuantityChange: (nombre: string, value: string) => void
}

const ProductColors: React.FC<ProductColorsProps> = ({ product, quantities, onQuantityChange }) => {
    const availableColors = Array.isArray(product.colores) ? product.colores : [];

    if (availableColors.length === 0) {
        return <p>No hay colores disponibles para este producto.</p>;
    }

    return(
        <table className="color-table">
            <thead>
                <tr>
                    <th>COLOR</th>
                    <th>CANTIDAD</th>
                    <th>STOCK DISPONIBLE</th>
                </tr>
            </thead>
            <tbody>
                {availableColors.map(({ nombre, stock }) => (
                    <tr key={nombre}>
                        <td>{nombre}</td>
                        <td>
                            <input
                                type="number"
                                min="0"
                                max={stock}
                                value={quantities[nombre] ?? 0}
                                onChange={(e) => onQuantityChange(nombre, e.target.value)}
                            />
                        </td>
                        <td>{stock}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default ProductColors;