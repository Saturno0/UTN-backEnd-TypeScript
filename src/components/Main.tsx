import { useMemo, useState } from 'react';
import type { Product } from '../types/types';
import ProductsLister from './ProductsLister';
import Slides from './Slides';

interface MainProps {
  products: Product[];
  onUpdateProduct?: (id: string, changes: Partial<Product>) => void;
  onDeleteProduct?: (id: string) => void;
}

const normalizeCategory = (category: Product['category']): string => {
  if (!category) {
    return 'Otros';
  }

  return typeof category === 'string'
    ? category
    : String((category as unknown) ?? 'Otros');
};

const Main: React.FC<MainProps> = ({ products, onUpdateProduct, onDeleteProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');

  const categories = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((product) => {
      unique.add(normalizeCategory(product.category));
    });

    return ['todas', ...Array.from(unique)];
  }, [products]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const nameMatches = normalizedSearch
        ? product.name.toLowerCase().includes(normalizedSearch)
        : true;

      const category = normalizeCategory(product.category);
      const categoryMatches =
        selectedCategory === 'todas' || category === selectedCategory;

      return nameMatches && categoryMatches;
    });
  }, [normalizedSearch, products, selectedCategory]);

  return (
    <main>
      <Slides />
      <section className="products-container" id="productos">
        <h1>Nuestros Productos</h1>

        <div className="products-filters">
          <label className="visually-hidden" htmlFor="search-products">
            Buscar productos
          </label>
          <input
            id="search-products"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nombre"
          />

          <label className="visually-hidden" htmlFor="filter-category">
            Filtrar por categoría
          </label>
          <select
            id="filter-category"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'todas' ? 'Todas las categorías' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="cards-container">
          <ProductsLister
            productos={filteredProducts}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
          />
        </div>
      </section>
    </main>
  );
};

export default Main;