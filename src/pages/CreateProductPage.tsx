import { useEffect, useState } from "react";
import type {
  Product,
  Category,
  ProductSpecs,
  ProductColor,
} from "../types/types";
import useProducts from "../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import useCategories from "../hooks/useCategories";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CreateProduct from "../components/CreateProduct.tsx";
import { useSelector } from "react-redux";
import type { RootState } from "../hooks/store.ts";

const CreateProductPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user); 
  const isAdmin = user.rol === "admin";

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
    image: new File([], ""),
    imageUrl: "",
    category: "",
    description: "",
    calificacion: 0,
    opiniones: 0,
    stock: false,
    descuento: 0,
    precio_actual: 0,
    precio_original: 0,
    talles: [],
    especificaciones: {
      material: "",
      peso: "",
      fabricado_en: "",
    },
    colores: [{ name: "", cantidad: 0, stock: 0 }],
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

  const calculateTotalStock = (colors: ProductColor[]): number =>
    colors.reduce((sum, color) => {
      if (!color.name || color.name.trim() === "") {
        return sum;
      }
      // Para creación, usamos el valor ingresado como stock por color
      const perColorStock = (Number(color.stock) || 0);
      return sum + perColorStock;
    }, 0);

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

  const handleChangeProduct = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Parsear numéricos cuando corresponde
    const numericFields = ["descuento", "precio_actual", "precio_original"];
    const parsedValue = numericFields.includes(name)
      ? Number(value) || 0
      : value;
    if (name === "talles") return; // este campo lo manejamos aparte como lista
    setProduct((prev) => ({ ...prev, [name]: parsedValue } as Product));
  };

  const handleChangeSizes = (sizes: string[]) => {
    setProduct((prev) => ({ ...prev, talles: sizes }));
  };

  const handleAddColor = () => {
    setProduct((prev) => {
      const prevColors = Array.isArray(prev.colores) ? prev.colores : [];
      const nextColors = [
        ...prevColors,
        { name: "", cantidad: 0, stock: 0 },
      ];
      const totalStock = calculateTotalStock(nextColors);
      return { ...prev, colores: nextColors, stock: totalStock > 0 ? true : false };
    });
  };

  const handleChangeColor = (
    index: number,
    field: keyof ProductColor,
    value: string | number
  ) => {
    setProduct((prev) => {
      const prevColors = Array.isArray(prev.colores) ? prev.colores : [];
      const nextColors = prevColors.map((color, idx) => {
        if (idx !== index) return color;
        const nextValue =
          field === "name"
            ? String(value)
            : Math.max(0, Number(value) || 0);
        return { ...color, [field]: nextValue } as ProductColor;
      });
      const totalStock = calculateTotalStock(nextColors);
      return { ...prev, colores: nextColors, stock: totalStock > 0 ? true : false };
    });
  };

  const calculateFinalPrice = ():number => {
    return (product.precio_original - (product.precio_original * (product.descuento / 100)));
  };

  const handleChangeImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    // Opcional: limpiar el campo de URL de imagen del producto
    if (file) {
      setProduct((prev) => ({ ...prev, imageUrl: "" }));
    }
  };

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder: archivo seleccionado para subir a AWS posteriormente
    // Si hay imagen, se enviará como FormData desde el hook
    if (product.name.trim() === "") {
      alert("Primero complete los datos del producto.");
      return;
    }

    const sanitizedColors = (product.colores ?? [])
      .filter((color) => color.name && color.name.trim() !== "")
      // Ajuste: el modelo espera 'stock' persistido; 'cantidad' se usa solo en el front
      .map((c) => ({ name: c.name.trim(), stock: c.cantidad || 0 })) as unknown as ProductColor[];
    const totalStock = calculateTotalStock(sanitizedColors);
    const precioFinal: number = calculateFinalPrice();
    const payload: Product = {
      ...product,
      colores: sanitizedColors,
      stock: totalStock > 0? true : false,
      estado: "Activo",
      ingreso: 'nuevo',
      precio_actual: precioFinal,
    };

    
    const response = await createProduct(payload, imageFile);
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
      image: new File([], ""),
      imageUrl: "",
      category: "",
      description: "",
      calificacion: 0,
      opiniones: 0,
      stock: false,
      descuento: 0,
      precio_actual: 0,
      precio_original: 0,
      talles: [],
      especificaciones: { material: "", peso: "", fabricado_en: "" },
      colores: [{ name: "", cantidad: 0, stock: 0 }],
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
      {isAdmin ? (
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
            onAddColor={handleAddColor}
            onChangeColor={handleChangeColor}
            onCreateProduct={handleCreateProduct}
            onCreateCategory={handleCreateCategory}
            loadingCreateProduct={loading.create}
            loadingCreateCategory={categoryLoading.create}
          />
          <Footer />
        </>
      ) : (
        navigate("/")
      )}
    </>
  );
};

export default CreateProductPage;
