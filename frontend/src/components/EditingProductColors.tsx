import React from "react";
import type { Product, ProductColor } from "../types/types";

// Nota: El nombre de la interface se solicita exactamente como "EditingProductColorsProps"
export interface EditingProductColorsProps {
  isAdmin: boolean;
  productId: string;
  currentProduct: Product;
  isEditingColors: boolean;
  setIsEditingColors: React.Dispatch<React.SetStateAction<boolean>>;
  setEditError: React.Dispatch<React.SetStateAction<string | null>>;
  editableColors: ProductColor[];
  setEditableColors: React.Dispatch<React.SetStateAction<ProductColor[]>>;
  handleColorFieldChange: (
    index: number,
    field: 'name' | 'cantidad' | 'stock',
    value: string | number
  ) => void;
  handleRemoveColorRow: (index: number) => void;
  handleAddColorRow: () => void;
  editError: string | null;
  handleSaveColors: () => void | Promise<void>;
  isSavingColors: boolean;

  isEditingInfo: boolean;
  setIsEditingInfo: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveAll: () => void | Promise<void>;
  isSavingAll: boolean;
}

const EditingProductColors: React.FC<EditingProductColorsProps> = ({
  isAdmin,
  productId,
  currentProduct,
  isEditingColors,
  setIsEditingColors,
  setEditError,
  editableColors,
  setEditableColors,
  handleColorFieldChange,
  handleRemoveColorRow,
  handleAddColorRow,
  editError,
  handleSaveColors,
  isSavingColors,
  isEditingInfo,
  setIsEditingInfo,
  handleSaveAll,
  isSavingAll,
}) => {
  if (!isAdmin || !productId) {
    return null;
  }

  const handleToggleColors = () => {
    setIsEditingColors((prev) => !prev);
    setEditError(null);
    if (!isEditingColors && Array.isArray(currentProduct.colores)) {
      setEditableColors(currentProduct.colores);
    }
  };

  return (
    <section className="product-editor-panel">
      <header className="product-editor-panel__header">
        <div>
          <p className="product-editor-eyebrow">Gestión administrativa</p>
          <h3>Colores e inventario</h3>
          <p className="product-editor-description">
            Controlá el stock por color y guardá todos los cambios de una sola vez.
          </p>
        </div>
        <div className="product-editor-panel__actions">
          <button
            type="button"
            className="product-editor-btn product-editor-btn--ghost"
            onClick={() => setIsEditingInfo((prev) => !prev)}
          >
            {isEditingInfo ? "Cerrar editor" : "Editar información"}
          </button>
          <button
            type="button"
            className="product-editor-btn product-editor-btn--primary"
            onClick={handleSaveAll}
            disabled={isSavingAll}
          >
            {isSavingAll ? "Guardando..." : "Guardar todo"}
          </button>
        </div>
      </header>

      <div className="product-editor-card">
        <div className="product-editor-card__header">
          <div>
            <h4>Inventario por color</h4>
            <p className="product-editor-description">
              Definí el nombre de los colores disponibles y stocks mínimos por variante.
            </p>
          </div>
          <button
            type="button"
            className="product-editor-btn product-editor-btn--secondary"
            onClick={handleToggleColors}
          >
            {isEditingColors ? "Cancelar edición" : "Editar colores"}
          </button>
        </div>

        {isEditingColors ? (
          <>
            <div className="color-editor-rows">
              {editableColors.map((color, index) => (
                <div className="color-editor-row" key={`${color.name}-${index}`}>
                  <div className="product-editor-field">
                    <label htmlFor={`color-name-${index}`}>Nombre del color</label>
                    <input
                      id={`color-name-${index}`}
                      type="text"
                      value={color.name}
                      onChange={(e) =>
                        handleColorFieldChange(index, "name", e.target.value)
                      }
                      placeholder="Ej: Negro carbón"
                    />
                  </div>
                  <div className="product-editor-field">
                    <label htmlFor={`color-qty-${index}`}>Cantidad</label>
                    <input
                      id={`color-qty-${index}`}
                      type="number"
                      min={0}
                      value={color.cantidad}
                      onChange={(e) =>
                        handleColorFieldChange(index, "cantidad", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="product-editor-field">
                    <label htmlFor={`color-stock-${index}`}>Stock disponible</label>
                    <input
                      id={`color-stock-${index}`}
                      type="number"
                      min={0}
                      value={color.stock}
                      onChange={(e) =>
                        handleColorFieldChange(index, "stock", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <button
                    type="button"
                    className="product-editor-icon-btn"
                    onClick={() => handleRemoveColorRow(index)}
                    aria-label="Eliminar color"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="product-editor-inline-actions">
              <button
                type="button"
                className="product-editor-btn product-editor-btn--ghost"
                onClick={handleAddColorRow}
              >
                Agregar color
              </button>
              <button
                type="button"
                className="product-editor-btn product-editor-btn--primary"
                onClick={handleSaveColors}
                disabled={isSavingColors}
              >
                {isSavingColors ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>

            {editError && (
              <div className="product-editor-alert product-editor-alert--error">
                {editError}
              </div>
            )}
          </>
        ) : (
          <ul className="product-editor-summary">
            {Array.isArray(currentProduct.colores) &&
              currentProduct.colores.map((color) => (
                <li key={color.name}>
                  <span>{color.name}</span>
                  <span>{color.stock ?? 0} en stock</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default EditingProductColors;
