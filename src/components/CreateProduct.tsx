import React from "react";
import type { Category, Product, ProductSpecs } from "../types/types";
import CreateCategory from "./CreateCategory";
import CreateProductForm from "./CreateProductForm";

interface CreateProductProps {
  product: Product;
  category: Category;
  especificaciones: ProductSpecs;

  onChangeProduct: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onChangeCategory: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onChangeSpecs: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSizesChange: (value: string[]) => void;

  onCreateProduct: (
    e: React.FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
  onCreateCategory: (
    e: React.FormEvent<HTMLFormElement>
  ) => void | Promise<void>;

  loadingCreateProduct?: boolean;
  loadingCreateCategory?: boolean;
}

const CreateProduct: React.FC<CreateProductProps> = ({
  product,
  category,
  especificaciones,
  onChangeProduct,
  onChangeCategory,
  onChangeSpecs,
  onSizesChange,
  onCreateProduct,
  onCreateCategory,
  loadingCreateProduct,
  loadingCreateCategory,
}) => {
  return (
    <main className="create-main">
      <section className="create-section">
        <CreateCategory 
            onCreateCategory={onCreateCategory}
            onChangeCategory={onChangeCategory}
            category={category}
            loadingCreateCategory={loadingCreateCategory}
        />
      </section>

      <hr />

      <section className="create-section-spaced">
        <CreateProductForm
            onCreateProduct={onCreateProduct}
            onChangeProduct={onChangeProduct}
            onChangeSpecs={onChangeSpecs}
            onSizesChange={onSizesChange}
            product={product}
            especificaciones={especificaciones}
            loadingCreateProduct={loadingCreateProduct}
        />
      </section>
    </main>
  );
};

export default CreateProduct;
