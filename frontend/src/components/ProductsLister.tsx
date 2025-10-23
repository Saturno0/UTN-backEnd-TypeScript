import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { Product } from "../types/types";
import type { RootState } from "../hooks/store";
import ProductCard from "./ProductCard";

interface ProductsListerProps {
    productos: Product[];
    onUpdateProduct?: (id: string, changes: Partial<Product>) => void;
    onDeleteProduct?: (id: string) => void;
};

const ProductsLister: React.FC<ProductsListerProps> = ({
  productos,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const user = useSelector((state: RootState) => state.user);
  const isAdmin = user.rol === "admin";

  const visibleProducts = useMemo(() => {
    if (isAdmin) {
      return productos;
    }

    return productos.filter((producto) => producto.estado !== "Inactivo");
  }, [isAdmin, productos]);

  if (visibleProducts.length === 0) {
    return <p>No hay productos para mostrar con el filtro actual.</p>;
  }

  return visibleProducts.map((producto, index) => {
    const productId =
      typeof producto._id === "string"
        ? producto._id
        : typeof producto.id === "number"
        ? producto.id.toString()
        : typeof producto.id === "string"
        ? producto.id
        : `${producto.name}-${index}`;

    return (
      <ProductCard
        key={productId}
        producto={producto}
        admin={isAdmin}
        onStatusChange={onUpdateProduct}
        onDelete={onDeleteProduct}
      />
    );
  });
};

export default ProductsLister;