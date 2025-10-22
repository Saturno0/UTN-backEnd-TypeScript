import React from 'react';
import type { Product, ProductColor } from '../types/types';

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
  return (
    <>
      {isAdmin && productId && (
        <section className="product-colors-editor">
          <button
            type="button"
            onClick={() => {
              setIsEditingColors((prev) => !prev);
              setEditError(null);
              if (!isEditingColors && Array.isArray(currentProduct.colores)) {
                setEditableColors(currentProduct.colores);
              }
            }}
          >
            {isEditingColors ? 'Cancelar edición' : 'Editar colores'}
          </button>

          {isEditingColors && (
            <div className="color-editor">
              {editableColors.map((color, index) => (
                <div className="color-editor-row" key={index}>
                  <label>
                    Nombre del color
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => handleColorFieldChange(index, 'name', e.target.value)}
                      placeholder="Nombre del color"
                    />
                  </label>
                  <label>
                    Cantidad
                    <input
                      type="number"
                      min={0}
                      value={color.cantidad}
                      onChange={(e) => handleColorFieldChange(index, 'cantidad', e.target.value)}
                      placeholder="Cantidad"
                    />
                  </label>
                  <label>
                    Stock disponible
                    <input
                      type="number"
                      min={0}
                      value={color.stock}
                      onChange={(e) => handleColorFieldChange(index, 'stock', e.target.value)}
                      placeholder="Stock"
                    />
                  </label>
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
      {isAdmin && (
        <section className="product-info-actions">
          <button type="button" onClick={() => setIsEditingInfo((prev) => !prev)}>
            {isEditingInfo ? 'Cancelar edición' : 'Editar producto'}
          </button>
          <button type="button" onClick={handleSaveAll} disabled={isSavingAll}>
            {isSavingAll ? 'Guardando...' : 'Guardar todo'}
          </button>
        </section>
      )}
    </>
  );
};

export default EditingProductColors;