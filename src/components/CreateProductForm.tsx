import type { Product, ProductSpecs } from "../types/types";

interface CreateProductFormProps {
  onCreateProduct: (
    e: React.FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
  onChangeProduct: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onChangeSpecs: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSizesChange: (value: string[]) => void;
  product: Product;
  especificaciones: ProductSpecs;
  loadingCreateProduct?: boolean;
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({
  onCreateProduct,
  onChangeProduct,
  onChangeSpecs,
  onSizesChange,
  product,
  especificaciones,
  loadingCreateProduct,
}) => {

    const sizesOptions = ["XS", "S", "M", "L", "XL", "XXL"];
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

        <label htmlFor="prod_image">Imagen (URL)</label>
        <input
          id="prod_image"
          name="image"
          type="url"
          value={product.image}
          onChange={onChangeProduct}
          placeholder="https://..."
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

        <label htmlFor="prod_category">Categoría seleccionada</label>
        <input
          id="prod_category"
          type="text"
          value={product.category}
          readOnly
        />

        <label htmlFor="prod_pactual">Precio actual</label>
        <input
          id="prod_pactual"
          name="precio_actual"
          type="number"
          step="0.01"
          value={product.precio_actual}
          onChange={onChangeProduct}
        />

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

        <label htmlFor="prod_stock">Stock</label>
        <input
          id="prod_stock"
          name="stock"
          type="number"
          step="1"
          value={product.stock}
          onChange={onChangeProduct}
        />

        <label htmlFor="prod_op">Opiniones</label>
        <input
          id="prod_op"
          name="opiniones"
          type="number"
          step="1"
          value={product.opiniones}
          onChange={onChangeProduct}
        />

        <label htmlFor="prod_calif">Calificación</label>
        <input
          id="prod_calif"
          name="calificacion"
          type="number"
          step="0.1"
          value={product.calificacion}
          onChange={onChangeProduct}
        />

        <label>Tamaños disponibles</label>
        <div className="sizes-group">
          {sizesOptions.map((size) => {
            const checked = product.tamaños.includes(size);
            return (
              <label key={size} className="size-option">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    onSizesChange(
                      e.target.checked
                        ? [...product.tamaños, size]
                        : product.tamaños.filter((s) => s !== size)
                    )
                  }
                />
                <span>{size}</span>
              </label>
            );
          })}
        </div>

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
