import type { Product } from "../types/types";
import ProductCard from "./ProductCard";

interface ProductsListerProps {
    productos: Product[]
};

const ProductsLister: React.FC<ProductsListerProps> = ( {productos} ) => {
    return (
        productos.map((producto, index) => {
            const productId = typeof producto._id === "string"
                ? producto._id
                : typeof producto.id === "number"
                    ? producto.id.toString()
                    : typeof producto.id === "string"
                        ? producto.id
                        : `${producto.name}-${index}`;

            return <ProductCard key={productId} producto={producto} />
        })
    );
}


export default ProductsLister;