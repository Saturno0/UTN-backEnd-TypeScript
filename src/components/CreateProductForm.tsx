import type { Product, ProductColor, ProductSpecs } from "../types/types";

interface CreateProductFormProps {
  onCreateProduct: (
    e: React.FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
  onChangeProduct: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onChangeSpecs: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSizesChange: (value: string[]) => void;
  onChangeImageFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddColor: () => void;
  onChangeColor: (
    index: number,
    field: keyof ProductColor,
    value: string | number
  ) => void;
  product: Product;
  especificaciones: ProductSpecs;
  loadingCreateProduct?: boolean;
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({
  onCreateProduct,
  onChangeProduct,
  onChangeSpecs,
  onSizesChange,
  onChangeImageFile,
  onAddColor,
  onChangeColor,
  product,
  especificaciones,
  loadingCreateProduct,
}) => {

  const sizesOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = Array.isArray(product.colores) ? product.colores : [];
  return (
    <>
      <h2>Crear producto</h2>
      <form onSubmit={onCreateProduct} className="create-form">
        <label htmlFor="prod_name">Nombre</label>
        <input
          id="prod_name"
          name="name"
          type="text"
          value={product.name}
          onChange={onChangeProduct}
          placeholder="Nombre del producto"
          required
        />

        <label htmlFor="prod_image">Imagen (archivo)</label>
        <input
          id="prod_image"
          name="image"
          type="file"
          accept="image/*"
          onChange={onChangeImageFile}
        />

        <label htmlFor="prod_desc">Descripción</label>
        <textarea
          id="prod_desc"
          name="description"
          value={product.description}
          onChange={onChangeProduct}
          placeholder="Descripción del producto"
          rows={4}
        />

        <label>Talles disponibles</label>
        <div className="sizes-group">
          {sizesOptions.map((size) => {
            const checked = product.talles.includes(size);
            return (
              <label key={size} className="size-option">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    onSizesChange(
                      e.target.checked
                        ? [...product.talles, size]
                        : product.talles.filter((s) => s !== size)
                    )
                  }
                />
                <span>{size}</span>
              </label>
            );
          })}
        </div>

        <label htmlFor="prod_category">Categoría seleccionada</label>
        <input
          id="prod_category"
          type="text"
          value={product.category}
          readOnly
        />

        <label>Colores</label>
        <div className="color-rows">
          {colors.length === 0 && (
            <button
              type="button"
              className="color-add"
              onClick={onAddColor}
              aria-label="Agregar color"
            >
              +
            </button>
          )}
          {colors.map((color, index) => (
            <div className="color-row" key={`color-${index}`}>
              <input
                type="text"
                value={color.name ?? ""}
                onChange={(e) => onChangeColor(index, "name", e.target.value)}
                placeholder="Nombre"
              />
              <input
                type="number"
                min={0}
                value={color.cantidad ?? 0}
                onChange={(e) =>
                  onChangeColor(index, "cantidad", Number(e.target.value) || 0)
                }
                placeholder="Stock"
              />
              {index === colors.length - 1 && (
                <button
                  type="button"
                  className="color-add"
                  onClick={onAddColor}
                  aria-label="Agregar color"
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>

        <label htmlFor="prod_porigen">Precio original</label>
        <input
          id="prod_porigen"
          name="precio_original"
          type="number"
          step="0.01"
          value={product.precio_original}
          onChange={onChangeProduct}
        />

        <label htmlFor="prod_descuento">Descuento (%)</label>
        <input
          id="prod_descuento"
          name="descuento"
          type="number"
          step="1"
          value={product.descuento}
          onChange={onChangeProduct}
        />


        <fieldset className="create-fieldset">
          <legend>Especificaciones</legend>
          <label htmlFor="spec_mat">Material</label>
          <input
            id="spec_mat"
            name="material"
            type="text"
            value={especificaciones.material}
            onChange={onChangeSpecs}
          />

          <label htmlFor="spec_peso">Peso</label>
          <input
            id="spec_peso"
            name="peso"
            type="text"
            value={especificaciones.peso}
            onChange={onChangeSpecs}
          />

          <label htmlFor="spec_fab">Fabricado en</label>
          <input
            id="spec_fab"
            name="fabricado_en"
            type="text"
            value={especificaciones.fabricado_en}
            onChange={onChangeSpecs}
          />
        </fieldset>

        <button
          type="submit"
          className="btn-save create-submit"
          disabled={!!loadingCreateProduct}
        >
          {loadingCreateProduct ? "Creando..." : "Crear producto"}
        </button>
      </form>
    </>
  );
};

export default CreateProductForm;
