import { useEffect, useState } from "react";
import type { Product, Category, ProductSpecs } from "../types/types";
import useProducts from "../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import useCategories from "../hooks/useCategories";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CreateProduct from "../components/CreateProduct.tsx";

const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>({
    nombre: "",
    descripcion: "",
  });

  const [especificaciones, setEspecificaciones] = useState<ProductSpecs>({
    material: "",
    peso: "",
    fabricado_en: "",
  });

  const [product, setProduct] = useState<Product>({
    name: "",
    image: "",
    category: "",
    description: "",
    calificacion: 0,
    opiniones: 0,
    stock: 0,
    descuento: 0,
    precio_actual: 0,
    precio_original: 0,
    tamaños: [],
    especificaciones: {
      material: "",
      peso: "",
      fabricado_en: "",
    },
    colores: [],
    ingreso: "",
    estado: "",
  });

  // Archivo de imagen seleccionado (para subir luego a AWS)
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { createProduct, error, loading } = useProducts();
  const {
    createCategory,
    error: categoryError,
    loading: categoryLoading
  } = useCategories();

  // Mantener el producto sincronizado con categoria y especificaciones
  useEffect(() => {
    setProduct((prev) => ({ ...prev, category: category.nombre }));
  }, [category.nombre]);

  useEffect(() => {
    setProduct((prev) => ({ ...prev, especificaciones }));
  }, [especificaciones]);

  const handleChangeEspecificaciones = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEspecificaciones((prev) => ({ ...prev, [name]: value } as ProductSpecs));
  };

  const handleChangeCategory = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeProduct = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
    const { name, value } = e.target;
    // Parsear numéricos cuando corresponde
    const numericFields = [
      "stock",
      "descuento",
      "precio_actual",
      "precio_original",
    ];
    const parsedValue = numericFields.includes(name)
      ? Number(value) || 0
      : value;
    // Manejo especial de colores ingresados como texto separado por comas
    if (name === "colores") {
      const names = String(value)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      setProduct((prev) => ({
        ...prev,
        colores: names.map((n) => ({ name: n, cantidad: 0, stock: 0 })),
      }));
      return;
    }
    if (name === "tamaños") return; // este campo lo manejamos aparte como lista
    setProduct((prev) => ({ ...prev, [name]: parsedValue } as Product));
  };

    const handleChangeSizes = (sizes: string[]) => {
        setProduct((prev) => ({ ...prev, tamaños: sizes }));
    };

  const handleChangeImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    // Opcional: limpiar el campo de URL de imagen del producto
    if (file) {
      setProduct((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder: archivo seleccionado para subir a AWS posteriormente
    if (imageFile) {
      console.log("Imagen seleccionada:", imageFile.name);
    }
    if (product.name.trim() === "") {
      alert("Primero complete los datos del producto.");
      return;
    }

    const response = await createProduct(product);
    console.log(response);
    if (!response) {
      const errMsg = (error.create as string | undefined) ?? response.message;
      alert("Error al crear el producto: " + errMsg);
      return;
    }

    alert(response.message ?? "Producto creado correctamente.");
    // Reset de formularios
    setCategory({ nombre: "", descripcion: "" });
    setEspecificaciones({ material: "", peso: "", fabricado_en: "" });
    setProduct({
      name: "",
      image: "",
      category: "",
      description: "",
      calificacion: 0,
      opiniones: 0,
      stock: 0,
      descuento: 0,
      precio_actual: 0,
      precio_original: 0,
      tamaños: [],
      especificaciones: { material: "", peso: "", fabricado_en: "" },
      colores: [],
      ingreso: "",
      estado: "",
    });

    navigate(-1);
  };

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (category.nombre.trim() === "") {
      alert("Primero ingrese un nombre de categoría.");
      return;
    }

    const response = await createCategory(category);
    if (!response) {
      const errMsg =
        (categoryError.create as string | undefined) ?? "Error desconocido";
      alert("Error al crear la categoría: " + errMsg);
      return;
    }

    alert(response.message ?? "Categoría creada correctamente.");
    // Sincronizamos el nombre de categoría en el producto mediante el useEffect
  };

  return (
    <>
      <Navbar />
            <CreateProduct
                product={product}
                category={category}
                especificaciones={especificaciones}
                onChangeProduct={handleChangeProduct}
                onChangeCategory={handleChangeCategory}
                onChangeSpecs={handleChangeEspecificaciones}
                onSizesChange={handleChangeSizes}
                onChangeImageFile={handleChangeImageFile}
                onCreateProduct={handleCreateProduct}
                onCreateCategory={handleCreateCategory}
                loadingCreateProduct={loading.create}
                loadingCreateCategory={categoryLoading.create}
            />
      <Footer />
    </>
  );
};

export default CreateProductPage;
