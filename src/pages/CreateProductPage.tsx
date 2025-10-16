import { useState } from "react";
import type { Product, Category } from "../types/types";
import useProducts from "../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import useCategories from "../hooks/useCategories";

const CreateProductPage: React.FC = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState<Category>({
        nombre: "",
        descripcion: "",
    });

    const [especificaciones, setEspecificaciones] = useState({
        material: "",
        peso: "",
        fabricado_en: "",
    });

    const [product, setProduct] = useState<Product>({
        name: "",
        image: "",
        category: category.nombre,
        description: "",
        calificacion: 0,
        opiniones: 0,
        stock: 0,
        descuento: 0,
        precio_actual: 0,
        precio_original: 0,
        tamaños: [],
        especificaciones: especificaciones,
        colores: [],
        ingreso: "",
        estado: "",
    })

    const {createProduct, error, loading, done} = useProducts();

    const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (product.name.trim() !== "") {
            const response = await createProduct(product);
            if (!response) {
                alert("Error al crear el producto. " + error.create.message);
            }

            if (done.create) {
                alert(response.message);
                setProduct({
                    name: "",
                    image: "",
                    category: category.nombre,
                    description: "",
                    calificacion: 0,
                    opiniones: 0,
                    stock: 0,
                    descuento: 0,
                    precio_actual: 0,
                    precio_original: 0,
                    tamaños: [],
                    especificaciones: especificaciones,
                    colores: [],
                    ingreso: "",
                    estado: "",
                });

                navigate(-1);
            }

        } else {
            alert("Primero cree un producto antes de enviarlo.");
        }
    }

    

    const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {createCategory, error} = useCategories();
        if (category.nombre.trim() !== "") {
            const response = await createCategory(category);

            if(!response) {
                if(error.create.code === 409) {
                    setCategory(error.create.detail);
                    console.error("Error: " + error.create.message);
                } else {
                    alert("Error al crear la categoria. " + error.create.message);
                }
            } else {
                alert(response.message);
                setProduct({...product, category: category.nombre})
            }
        } else {
            alert("Primero ingrese una categoria antes de enviar el formulario.");
        }
    }


    return(
        <>
        </>
    );
}

export default CreateProductPage;