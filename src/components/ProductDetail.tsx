import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { addToCart } from '../hooks/cartSlice';
import type { Product, ProductColor } from '../types/types';
import ProductColors from './ProductColors';
import ProductInfo from './ProductInfo';

interface ProductDetailProp {
  product: Product;
  onUpdateProduct?: (
    productId: string,
    updates: Partial<Product>
  ) => Promise<Product | void>;
}

const buildQuantities = (colors: ProductColor[]) =>
  colors.reduce<Record<string, number>>((acc, colorObj) => {
    acc[colorObj.name] = 0;
    return acc;
  }, {});

const normalizeColorField = (value: number | string) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue >= 0
    ? numericValue
    : 0;
};

const ProductDetail: React.FC<ProductDetailProp> = ({ product, onUpdateProduct }) => {
  const dispatch = useDispatch();

  const productId = useMemo(() => {
    if (typeof product._id === 'string') return product._id;
    if (typeof product.id === 'number') return product.id.toString();
    if (typeof product.id === 'string') return product.id;
    return '';
  }, [product._id, product.id]);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [price, setPrice] = useState<number>(0);
  const [isEditingColors, setIsEditingColors] = useState(false);
  const [editableColors, setEditableColors] = useState<ProductColor[]>(
    Array.isArray(product.colores) ? product.colores : []
  );
  const [isSavingColors, setIsSavingColors] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (Array.isArray(product.colores)) {
      setQuantities(buildQuantities(product.colores));
      setEditableColors(product.colores);
    }
  }, [product]);

  const handleQuantityChange = (colorName: string, value: string) => {
    setQuantities((prev) => ({
      ...prev,
      [colorName]: Math.max(0, parseInt(value, 10) || 0),
    }));
  };

  const handleAddToCart = () => {
    if (!productId) return;

    Object.entries(quantities).forEach(([colorName, qty]) => {
      for (let i = 0; i < qty; i += 1) {
        dispatch(
          addToCart({
            name: product.name,
            id: productId,
            color: colorName,
            price: product.precio_actual,
            quantity: 1,
            image: product.imageUrl,
          })
        );
      }
    });

    setQuantities(buildQuantities(Array.isArray(product.colores) ? product.colores : []));
  };

  const totalQty = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  useEffect(() => {
    setPrice(totalQty * (product?.precio_actual ?? 0));
  }, [quantities, product?.precio_actual, totalQty]);

  const handleColorFieldChange = (
    index: number,
    field: keyof Pick<ProductColor, 'name' | 'cantidad' | 'stock'>,
    value: string
  ) => {
    setEditableColors((prev) =>
      prev.map((color, colorIndex) => {
        if (colorIndex !== index) return color;

        if (field === 'name') {
          return { ...color, name: value };
        }

        return {
          ...color,
          [field]: normalizeColorField(value),
        };
      })
    );
  };

  const handleAddColorRow = () => {
    setEditableColors((prev) => [
      ...prev,
      { name: '', cantidad: 0, stock: 0 },
    ]);
  };

  const handleRemoveColorRow = (index: number) => {
    setEditableColors((prev) => prev.filter((_, colorIndex) => colorIndex !== index));
  };

  const handleSaveColors = async () => {
    if (!onUpdateProduct || !productId) return;

    setIsSavingColors(true);

    const sanitizedColors = editableColors
      .filter((color) => color.name.trim() !== '')
      .map((color) => ({
        name: color.name.trim(),
        cantidad: normalizeColorField(color.cantidad),
        stock: normalizeColorField(color.stock),
      }));

    try {
      const updatedProduct = await onUpdateProduct(productId, {
        colores: sanitizedColors,
      });

      const nextColors =
        (updatedProduct && Array.isArray(updatedProduct.colores)
          ? updatedProduct.colores
          : sanitizedColors);

      setEditableColors(nextColors);
      setQuantities(buildQuantities(nextColors));
      setIsEditingColors(false);
      setEditError(null);
    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : 'No se pudieron actualizar los colores.'
      );
    } finally {
      setIsSavingColors(false);
    }
  };

  if (!product || !Array.isArray(product.colores)) {
    return <div>Cargando producto...</div>;
  }
  console.log("talles: ", product.tamaños.length)
  return (
    <div className="product">
      <h1>Producto Destacado</h1>
      <div className="product-details">
        <div className="product-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="product-info">
          <ProductInfo product={product} />

          <ProductColors
            colors={product.colores}
            quantities={quantities}
            onQuantityChange={handleQuantityChange}
          />

          <button onClick={handleAddToCart} disabled={totalQty === 0}>
            Añadir al carrito ({totalQty})
          </button>
          <p>
            <strong>Total: {price}</strong>
          </p>

          {onUpdateProduct && productId && (
            <section className="product-colors-editor">
              <button
                type="button"
                onClick={() => {
                  setIsEditingColors((prev) => !prev);
                  setEditError(null);
                  if (!isEditingColors && Array.isArray(product.colores)) {
                    setEditableColors(product.colores);
                  }
                }}
              >
                {isEditingColors ? 'Cancelar edición' : 'Editar colores'}
              </button>

              {isEditingColors && (
                <div className="color-editor">
                  {editableColors.map((color, index) => (
                    <div className="color-editor-row" key={`${color.name}-${index}`}>
                      <input
                        type="text"
                        value={color.name}
                        onChange={(event) =>
                          handleColorFieldChange(index, 'name', event.target.value)
                        }
                        placeholder="Nombre del color"
                      />
                      <input
                        type="number"
                        min={0}
                        value={color.cantidad}
                        onChange={(event) =>
                          handleColorFieldChange(index, 'cantidad', event.target.value)
                        }
                        placeholder="Cantidad"
                      />
                      <input
                        type="number"
                        min={0}
                        value={color.stock}
                        onChange={(event) =>
                          handleColorFieldChange(index, 'stock', event.target.value)
                        }
                        placeholder="Stock"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveColorRow(index)}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}

                  <button type="button" onClick={handleAddColorRow}>
                    Agregar color
                  </button>

                  {editError && <p className="error-message">{editError}</p>}

                  <button
                    type="button"
                    onClick={handleSaveColors}
                    disabled={isSavingColors}
                  >
                    {isSavingColors ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
