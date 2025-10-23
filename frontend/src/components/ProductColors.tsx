import type React from "react";

interface ProductColorsProps {
    colors: Array<{ name: string; stock: number, id?: string, _id?: string }>,
    quantities: Record<string, number>,
    onQuantityChange: (nombre: string, value: string) => void
}

const ProductColors: React.FC<ProductColorsProps> = ({ colors, quantities, onQuantityChange }) => {

    if (colors.length === 0) {
        return <p>No hay colores disponibles para este producto.</p>;
    }

    return(
        <table className="color-table">
            <thead>
                <tr>
                    <th>COLOR</th>
                    <th>CANTIDAD A COMPRAR</th>
                    <th>STOCK DISPONIBLE</th>
                </tr>
            </thead>
            <tbody>
                {colors.map(({ name, stock }, index) => (
                    <tr key={index}>
                        <td>{name}</td>
                        <td>
                            <input
                                type="number"
                                min="0"
                                max={stock}
                                value={quantities[name] ?? 0}
                                onChange={(e) => onQuantityChange(name, e.target.value)}
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