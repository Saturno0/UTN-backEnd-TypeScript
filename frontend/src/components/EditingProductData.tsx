import React from 'react';

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
    <div className="product-info-editor">
      <input
        type="text"
        value={editableInfo.name}
        onChange={(e) => handleInfoFieldChange("name", e.target.value)}
        placeholder="Nombre"
      />
      <textarea
        value={editableInfo.description}
        onChange={(e) => handleInfoFieldChange("description", e.target.value)}
        placeholder="Descripción"
      />
      <label>
        Precio original
        <input
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
      </label>
      <label>
        Descuento (%)
        <input
          type="number"
          min={0}
          max={100}
          value={editableInfo.descuento}
          onChange={(e) =>
            handleInfoFieldChange("descuento", Number(e.target.value) || 0)
          }
        />
      </label>
      <label>
        Precio actual
        <input
          type="number"
          min={0}
          value={editableInfo.precio_actual}
          readOnly
        />
      </label>
      <label>
        Estado
        <select
          value={editableInfo.estado}
          onChange={(e) => handleInfoFieldChange("estado", e.target.value)}
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </label>
      <div className="editor-actions">
        <button type="button" onClick={() => setIsEditingInfo(false)}>
          Cancelar
        </button>
        <button type="button" onClick={handleSaveInfo}>
          Guardar
        </button>
      </div>
    </div>
  );
};

export default EditingProductData;
