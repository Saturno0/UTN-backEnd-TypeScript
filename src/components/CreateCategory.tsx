interface CreateCategoryProps {
    onCreateCategory: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
    onChangeCategory: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    category: {
        nombre: string;
        descripcion?: string;
    };
    loadingCreateCategory?: boolean;
}

const CreateCategory: React.FC<CreateCategoryProps> = ({onCreateCategory, onChangeCategory, category, loadingCreateCategory}) => {
    return (
        <>
        <h2>Crear categoría</h2>
        <form
          onSubmit={onCreateCategory}
          className="create-form create-form-narrow"
        >
          <label htmlFor="cat_nombre">Nombre</label>
          <input
            id="cat_nombre"
            name="nombre"
            type="text"
            value={category.nombre}
            onChange={onChangeCategory}
            placeholder="Ej: Calzado"
            required
          />

          <label htmlFor="cat_desc">Descripción</label>
          <textarea
            id="cat_desc"
            name="descripcion"
            value={category.descripcion ?? ""}
            onChange={onChangeCategory}
            placeholder="Descripción de la categoría"
            rows={3}
          />

          <button
            type="submit"
            className="btn-save create-submit"
            disabled={!!loadingCreateCategory}
          >
            {loadingCreateCategory ? "Creando..." : "Crear categoría"}
          </button>
        </form>
        </>
    );
}

export default CreateCategory;