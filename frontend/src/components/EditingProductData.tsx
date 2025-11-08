import React from "react";

export interface EditingProductDataProps {
  editableInfo: {
    name: string;
    description: string;
    precio_original: number;
    descuento: number;
    precio_actual: number;
    estado: string;
  };
  handleInfoFieldChange: (
    field:
      | 'name'
      | 'description'
      | 'precio_original'
      | 'descuento'
      | 'precio_actual'
      | 'estado',
    value: string | number
  ) => void;
  setIsEditingInfo: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveInfo: () => void | Promise<void>;
}

const EditingProductData: React.FC<EditingProductDataProps> = ({
  editableInfo,
  handleInfoFieldChange,
  setIsEditingInfo,
  handleSaveInfo,
}) => {
  return (
    <section className="product-editor-card product-editor-card--info">
      <header className="product-editor-card__header">
        <div>
          <p className="product-editor-eyebrow">Información del producto</p>
          <h3>Detalles principales</h3>
          <p className="product-editor-description">
            Ajustá nombre, descripción, precios y estado antes de publicar.
          </p>
        </div>
        <span className="product-editor-chip">Modo edición</span>
      </header>

      <div className="product-editor-grid">
        <div className="product-editor-field">
          <label htmlFor="product-name">Nombre</label>
          <input
            id="product-name"
            type="text"
            value={editableInfo.name}
            onChange={(e) => handleInfoFieldChange("name", e.target.value)}
            placeholder="Nombre del producto"
          />
        </div>

        <div className="product-editor-field product-editor-field--wide">
          <label htmlFor="product-description">Descripción</label>
          <textarea
            id="product-description"
            value={editableInfo.description}
            onChange={(e) =>
              handleInfoFieldChange("description", e.target.value)
            }
            placeholder="Descripción breve para tus clientes"
          />
        </div>

        <div className="product-editor-field">
          <label htmlFor="product-price-original">Precio original</label>
          <div className="product-editor-input-addon">
            <span>$</span>
            <input
              id="product-price-original"
              type="number"
              min={0}
              value={editableInfo.precio_original}
              onChange={(e) =>
                handleInfoFieldChange(
                  "precio_original",
                  Number(e.target.value) || 0
                )
              }
            />
          </div>
        </div>

        <div className="product-editor-field">
          <label htmlFor="product-discount">Descuento (%)</label>
          <input
            id="product-discount"
            type="number"
            min={0}
            max={100}
            value={editableInfo.descuento}
            onChange={(e) =>
              handleInfoFieldChange("descuento", Number(e.target.value) || 0)
            }
          />
        </div>

        <div className="product-editor-field">
          <label htmlFor="product-price-current">Precio actual</label>
          <div className="product-editor-input-addon">
            <span>$</span>
            <input
              id="product-price-current"
              type="number"
              min={0}
              value={editableInfo.precio_actual}
              readOnly
            />
          </div>
          <small>Se calcula automáticamente según el descuento.</small>
        </div>

        <div className="product-editor-field">
          <label htmlFor="product-status">Estado</label>
          <select
            id="product-status"
            value={editableInfo.estado}
            onChange={(e) => handleInfoFieldChange("estado", e.target.value)}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="product-editor-actions">
        <button
          type="button"
          className="product-editor-btn product-editor-btn--ghost"
          onClick={() => setIsEditingInfo(false)}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="product-editor-btn product-editor-btn--primary"
          onClick={handleSaveInfo}
        >
          Guardar
        </button>
      </div>
    </section>
  );
};

export default EditingProductData;
