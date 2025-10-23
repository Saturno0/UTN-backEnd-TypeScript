import type { Product } from "../types/types";

interface ProductInfoProps {
    product: Product
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const sizes = Array.isArray(product.talles) ? product.talles : [];
    const specs = product.especificaciones ?? { material: '', peso: '', fabricado_en: '' };

    return (
        <>
            <h2>{product.name}</h2>

            {product.stock ? <p className="stock">En stock</p> : <p className="stock">Sin stock</p>}
            {product.descuento > 0 && (
                <p className="discount">¡{product.descuento}% de descuento por tiempo limitado!</p>
            )}

            <p className="price">
                ${product.precio_actual}{" "}
                {product.precio_actual !== product.precio_original && (
                    <del style={{ color: "#888", fontSize: "1rem" }}>${product.precio_original}</del>
                )}
            </p>

            <h4>{product.description}</h4>

            <label htmlFor="size">Tamaño:</label>
            <select id="size" name="size">
                {sizes.map((t) => (
                    <option key={t}>{t}</option>
                ))}
            </select>

            <ul className="specs">
                <li>Material: {specs.material}</li>
                <li>Peso: {specs.peso}</li>
                <li>Fabricado en: {specs.fabricado_en}</li>
            </ul>
        </>
    )
}

export default ProductInfo;