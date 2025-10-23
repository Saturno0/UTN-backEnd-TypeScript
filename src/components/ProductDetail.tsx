import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addToCart } from "../hooks/cartSlice";
import type { Product, ProductColor } from "../types/types";
import ProductColors from "./ProductColors";
import ProductInfo from "./ProductInfo";
import type { RootState } from "../hooks/store";
import useProducts from "../hooks/useProducts";
import EditingProduct from "./EditingProductColors";
import EditingProductData from "./EditingProductData";

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
  return Number.isFinite(numericValue) && numericValue >= 0 ? numericValue : 0;
};

const ProductDetail: React.FC<ProductDetailProp> = ({
  product,
  onUpdateProduct,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const isAdmin = user.rol === "admin";
  const { updateProduct } = useProducts();

  const [currentProduct, setCurrentProduct] = useState<Product>(product);

  const productId = useMemo(() => {
    const p = currentProduct;
    if (typeof p._id === "string") return p._id;
    if (typeof p.id === "number") return p.id.toString();
    if (typeof p.id === "string") return p.id;
    return "";
  }, [currentProduct._id, (currentProduct as any).id]);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [price, setPrice] = useState<number>(0);
  const [isEditingColors, setIsEditingColors] = useState(false);
  const [editableColors, setEditableColors] = useState<ProductColor[]>(
    Array.isArray(currentProduct.colores) ? currentProduct.colores : []
  );
  const [isSavingColors, setIsSavingColors] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [isSavingAll, setIsSavingAll] = useState(false);

  // Admin: edición de info general
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editableInfo, setEditableInfo] = useState({
    name: currentProduct.name || "",
    description: currentProduct.description || "",
    precio_original: currentProduct.precio_original || 0,
    descuento: currentProduct.descuento || 0,
    precio_actual: currentProduct.precio_actual || 0,
    stock: Boolean(currentProduct.stock),
    estado: currentProduct.estado || "Activo",
  });

  useEffect(() => {
    setCurrentProduct(product);
  }, [product]);

  useEffect(() => {
    if (Array.isArray(currentProduct.colores)) {
      setQuantities(buildQuantities(currentProduct.colores));
      if (!isEditingColors) {
        setEditableColors(currentProduct.colores);
      }
    }
    setEditableInfo({
      name: currentProduct.name || "",
      description: currentProduct.description || "",
      precio_original: currentProduct.precio_original || 0,
      descuento: currentProduct.descuento || 0,
      precio_actual: currentProduct.precio_actual || 0,
      stock: Boolean(currentProduct.stock),
      estado: currentProduct.estado || "Activo",
    });
  }, [currentProduct, isEditingColors]);

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
            name: currentProduct.name,
            id: productId,
            color: colorName,
            price: currentProduct.precio_actual,
            quantity: 1,
            image: currentProduct.imageUrl,
          })
        );
      }
    });

    setQuantities(
      buildQuantities(
        Array.isArray(currentProduct.colores) ? currentProduct.colores : []
      )
    );
  };

  const totalQty = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  useEffect(() => {
    setPrice(totalQty * (currentProduct?.precio_actual ?? 0));
  }, [quantities, currentProduct?.precio_actual, totalQty]);

  // Recalcular precio_actual cuando cambian precio_original o descuento en modo edición
  useEffect(() => {
    if (!isEditingInfo) return;
    const base = Number(editableInfo.precio_original) || 0;
    const off = Number(editableInfo.descuento) || 0;
    const final = base - base * (off / 100);
    setEditableInfo((prev) => ({
      ...prev,
      precio_actual: Math.max(0, Number(final.toFixed(2))),
    }));
  }, [editableInfo.precio_original, editableInfo.descuento, isEditingInfo]);

  const handleColorFieldChange = (
    index: number,
    field: keyof Pick<ProductColor, "name" | "cantidad" | "stock">,
    value: string | number
  ) => {
    setEditableColors((prev) =>
      prev.map((color, colorIndex) => {
        if (colorIndex !== index) return color;

        if (field === "name") {
          return { ...color, name: String(value) };
        }

        return {
          ...color,
          [field]: normalizeColorField(value),
        };
      })
    );
  };

  const handleAddColorRow = () => {
    setEditableColors((prev) => [...prev, { name: "", cantidad: 0, stock: 0 }]);
  };

  const handleRemoveColorRow = (index: number) => {
    setEditableColors((prev) =>
      prev.filter((_, colorIndex) => colorIndex !== index)
    );
  };

  const handleSaveColors = async () => {
    if (!productId) return;

    setIsSavingColors(true);

    const sanitizedColors = editableColors
      .filter((color) => color.name.trim() !== "")
      .map((color) => ({
        name: color.name.trim(),
        cantidad: normalizeColorField(color.cantidad),
        stock: normalizeColorField(color.stock),
      }));

    try {
      const updater = onUpdateProduct
        ? onUpdateProduct
        : async (id: string, updates: Partial<Product>) => {
            const res = await updateProduct(id, updates);
            alert(res.message);
            return { ...currentProduct, ...(updates as any) } as Product;
          };

      const updatedProduct = await updater(productId, {
        colores: sanitizedColors,
      });

      const nextColors =
        updatedProduct && Array.isArray((updatedProduct as any).colores)
          ? (updatedProduct as any).colores
          : sanitizedColors;

      setEditableColors(nextColors);
      setQuantities(buildQuantities(nextColors));
      setCurrentProduct((prev) => ({ ...prev, colores: nextColors }));
      setIsEditingColors(false);
      setEditError(null);
    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : "No se pudieron actualizar los colores."
      );
    } finally {
      setIsSavingColors(false);
    }
  };

  const handleInfoFieldChange = (
    field: keyof typeof editableInfo,
    value: string | number | boolean
  ) => {
    setEditableInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveInfo = async () => {
    if (!productId) return;

    try {
      const payload: Partial<Product> = {
        name: editableInfo.name,
        description: editableInfo.description,
        precio_original: Number(editableInfo.precio_original) || 0,
        descuento: Number(editableInfo.descuento) || 0,
        precio_actual: Number(editableInfo.precio_actual) || 0,
        stock: Boolean(editableInfo.stock),
        estado: editableInfo.estado,
      };

      const updater = onUpdateProduct
        ? onUpdateProduct
        : async (id: string, updates: Partial<Product>) => {
            await updateProduct(id, updates);
            return { ...currentProduct, ...(updates as any) } as Product;
          };

      const updated = await updater(productId, payload);
      if (updated) setCurrentProduct(updated as Product);
      else setCurrentProduct((prev) => ({ ...prev, ...(payload as any) }));
      setIsEditingInfo(false);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "No se pudo guardar el producto."
      );
    }
  };

  const handleSaveAll = async () => {
    if (!productId) return;
    try {
      setIsSavingAll(true);
      const colorsSanitized = editableColors
        .filter((c) => (c.name ?? "").trim() !== "")
        .map((c) => ({
          name: String(c.name).trim(),
          cantidad: normalizeColorField(c.cantidad),
          stock: normalizeColorField(c.stock),
        }));

      const base = Number(editableInfo.precio_original) || 0;
      const off = Number(editableInfo.descuento) || 0;
      const final = Math.max(0, Number((base - base * (off / 100)).toFixed(2)));

      const payload: Partial<Product> = {
        name: editableInfo.name,
        description: editableInfo.description,
        precio_original: base,
        descuento: off,
        precio_actual: final,
        estado: editableInfo.estado,
        colores: colorsSanitized as any,
      };

      const updater = onUpdateProduct
        ? onUpdateProduct
        : async (id: string, updates: Partial<Product>) => {
            await updateProduct(id, updates);
            return { ...currentProduct, ...(updates as any) } as Product;
          };

      const updated = await updater(productId, payload);
      if (updated) setCurrentProduct(updated as Product);
      else setCurrentProduct((prev) => ({ ...prev, ...(payload as any) }));

      setIsEditingColors(false);
      setIsEditingInfo(false);
      setEditError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo guardar los cambios.";
      alert(message);
    } finally {
      setIsSavingAll(false);
    }
  };

  if (!currentProduct || !Array.isArray(currentProduct.colores)) {
    return <div>Cargando producto...</div>;
  }
  return (
    <div className="product">
      <h1>Producto Destacado</h1>
      <div className="product-details">
        <div className="product-image">
          <img src={currentProduct.imageUrl} alt={currentProduct.name} />
        </div>
        <div className="product-info">
          {!isAdmin || !isEditingInfo ? (
            <ProductInfo product={currentProduct} />
          ) : (
            <EditingProductData
              editableInfo={editableInfo}
              handleInfoFieldChange={handleInfoFieldChange}
              setIsEditingInfo={setIsEditingInfo}
              handleSaveInfo={handleSaveInfo}
            />
          )}

          <ProductColors
            colors={currentProduct.colores}
            quantities={quantities}
            onQuantityChange={handleQuantityChange}
          />

          <button onClick={handleAddToCart} disabled={totalQty === 0}>
            Añadir al carrito ({totalQty})
          </button>
          <p>
            <strong>Total: {price}</strong>
          </p>

          <EditingProduct
            isAdmin={isAdmin}
            productId={productId}
            currentProduct={currentProduct}
            isEditingColors={isEditingColors}
            setIsEditingColors={setIsEditingColors}
            setEditError={setEditError}
            editableColors={editableColors}
            setEditableColors={setEditableColors}
            handleColorFieldChange={handleColorFieldChange}
            handleRemoveColorRow={handleRemoveColorRow}
            handleAddColorRow={handleAddColorRow}
            editError={editError}
            handleSaveColors={handleSaveColors}
            isSavingColors={isSavingColors}
            isEditingInfo={isEditingInfo}
            setIsEditingInfo={setIsEditingInfo}
            handleSaveAll={handleSaveAll}
            isSavingAll={isSavingAll}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
