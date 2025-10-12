import { useEffect, useState } from "react";
import ProductsLister from "./ProductsLister";
import type { Product } from "../types/types";

interface NewInProps {
    products: Product[];
    onUpdateProduct?: (id: string, changes: Partial<Product>) => void;
    onDeleteProduct?: (id: string) => void;
}

const resolveProductId = (product: Product): string => {
    if (typeof product._id === "string" && product._id.trim().length > 0) {
        return product._id;
    }

    if (typeof product.id === "number") {
        return product.id.toString();
    }

    if (typeof product.id === "string" && product.id.trim().length > 0) {
        return product.id;
    }

    return product.name;
};

const NewIn:  React.FC<NewInProps> = ({products, onUpdateProduct, onDeleteProduct}) => {
    const [productsFiltered, setProductsFiltered] = useState<Product[]>(products.filter((product) => product.ingreso === "nuevo"));

    useEffect(() => {
        setProductsFiltered(products.filter((product) => product.ingreso === "nuevo"))
    }, [products]);

    const handleStatusChange = (id: string, changes: Partial<Product>) => {
        setProductsFiltered((prevProducts) =>
            prevProducts.map((product) =>
                resolveProductId(product) === id ? { ...product, ...changes } : product
            )
        );
        onUpdateProduct?.(id, changes);
    };

    const handleDelete = (id: string) => {
        setProductsFiltered((prevProducts) =>
            prevProducts.filter((product) => resolveProductId(product) !== id)
        );
        onDeleteProduct?.(id);
    };

    return(
        <main style={{ margin: '6rem auto', maxWidth: '1200px', padding: '0 1rem' }}>
            <div className="cards-container">
                <ProductsLister
                    productos={productsFiltered}
                    onUpdateProduct={handleStatusChange}
                    onDeleteProduct={handleDelete}
                />
            </div>
        </main>
    );
}

export default NewIn;