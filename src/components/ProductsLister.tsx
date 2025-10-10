import { useEffect, useState } from "react";
import type { Product, UserState } from "../types/types";
import ProductCard from "./ProductCard";

interface ProductsListerProps {
    productos: Product[]
};

const ProductsLister: React.FC<ProductsListerProps> = ( {productos} ) => {
    const [user, setUser] = useState<UserState>({
        nombre: "",
        email: "",
        password: "",
        rol: "user",
        activo: false,
    });
    
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if(userData) {
            try {
                setUser(JSON.parse(userData) as UserState);
            } catch {
                setUser({
                    nombre: "",
                    email: "",
                    password: "",
                    rol: "user",
                    activo: false,
                });
            }
        } else {
            setUser({
                nombre: "",
                email: "",
                password: "",
                rol: "user",
                activo: false,
            });
        }
    }, []);

    const isAdmin: boolean = (user.rol === "admin");
    return (
        productos.map((producto, index) => {
            const productId = typeof producto._id === "string"
                ? producto._id
                : typeof producto.id === "number"
                    ? producto.id.toString()
                    : typeof producto.id === "string"
                        ? producto.id
                        : `${producto.name}-${index}`;

            if (producto.estado === 'Inactivo') {
                return <ProductCard key={productId} producto={producto} admin={isAdmin}/>
            }
            return <ProductCard key={productId} producto={producto} admin={isAdmin}/>
        })
    );
}


export default ProductsLister;