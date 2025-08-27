import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../hooks/cartSlice';
import ProductColors from './ProductColors';
import ProductInfo from './ProductInfo';
import type { Product } from '../types/types';

interface ProductDetailProp {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProp> = ({ product }) => {
  const dispatch = useDispatch();

  // Tipamos quantities: Record<string, number>
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (product?.colores && Array.isArray(product.colores)) {
      const initialQuantities = product.colores.reduce<Record<string, number>>(
        (acc, colorObj) => {
          acc[colorObj.nombre] = 0;
          return acc;
        },
        {}
      );
      setQuantities(initialQuantities);
    }
  }, [product]);

  // Tipamos parámetros: colorName es string, value es string (por ser valor de input)
  const handleQuantityChange = (colorName: string, value: string) => {
    setQuantities({
      ...quantities,
      [colorName]: Math.max(0, parseInt(value) || 0),
    });
    console.log(`precio: ${price}`);
  };

  const handleAddToCart = () => {
    Object.entries(quantities).forEach(([colorName, qty]) => {
      for (let i = 0; i < qty; i++) {
        dispatch(
          addToCart({
            name: product.name,
            id: product.id,
            color: colorName,
            price: product.precio_actual,
            quantity: totalQty,
            image: product.image
          })
        );
      }
    });

    // Reset quantities
    const resetQuantities = product.colores.reduce<Record<string, number>>(
      (acc, colorObj) => {
        acc[colorObj.nombre] = 0;
        return acc;
      },
      {}
    );
    setQuantities(resetQuantities);
  };

  const totalQty:number = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  useEffect(() => {
    if (product?.precio_actual) {
      setPrice(totalQty * product.precio_actual);
    }
  }, [quantities, product?.precio_actual, totalQty]);

  if (!product || !product.colores || Object.keys(quantities).length === 0) {
    return <div>Cargando producto...</div>;
  }

  return (
    <div className="product">
      <h1>Producto Destacado</h1>
      <div className="product-details">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          <ProductInfo product={product} />

          <ProductColors
            product={product}
            quantities={quantities}
            onQuantityChange={handleQuantityChange}
          />

          <button onClick={handleAddToCart} disabled={totalQty === 0}>
            Añadir al carrito ({totalQty})
          </button>
          <p>
            <strong>Total: {price}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
