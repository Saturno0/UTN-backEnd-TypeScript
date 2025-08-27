import type { Product } from "../types/types";
import ProductCard from "./ProductCard";

interface ProductsListerProps {
    productos: Product[]
};

const ProductsLister: React.FC<ProductsListerProps> = ( {productos} ) => {
    return (
        productos.map((producto) => (
             <ProductCard key={producto.id} producto={producto} />
        ))
    );
}


export default ProductsLister;