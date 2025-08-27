import { useEffect, useState } from "react";
import ProductsLister from "./ProductsLister";
import type { Product } from "../types/types";

interface NewInProps {
    products: Product[]
}

const NewIn:  React.FC<NewInProps> = ({products}) => {
    const [productsFiltered, setProductsFiltered] = useState<Product[]>(products.filter((product) => product.ingreso === "nuevo"));
    
    useEffect(() => {
        setProductsFiltered(products.filter((product) => product.ingreso === "nuevo"))
    }, [products]);

    return(
        <main style={{ margin: '6rem auto', maxWidth: '1200px', padding: '0 1rem' }}>
            <div className="cards-container">
                <ProductsLister productos={productsFiltered}/>
            </div>
        </main>
    );
}

export default NewIn;