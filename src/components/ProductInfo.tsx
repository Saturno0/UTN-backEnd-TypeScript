import type { Product } from "../types/types";

interface ProductInfoProps {
    product: Product
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    return (
        <>
            <h2>{product.name}</h2>
            <div className="product-rating">
                ⭐⭐⭐⭐☆ ({product.calificacion}) · {product.opiniones} opiniones
            </div>
            <p>{product.description}</p>

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

            <label htmlFor="size">Tamaño:</label>
            <select id="size" name="size">
                {product.tamaños.map((t) => (
                    <option key={t}>{t}</option>
                ))}
            </select>

            <ul className="specs">
                <li>Material: {product.especificaciones.material}</li>
                <li>Peso: {product.especificaciones.peso}</li>
                <li>Fabricado en: {product.especificaciones.fabricado_en}</li>
            </ul>
        </>
    )
}

export default ProductInfo;