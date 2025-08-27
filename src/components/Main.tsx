import type { Product } from '../types/types';
import ProductsLister from './ProductsLister';
import Slides from './Slides';

interface MainProps {
  products: Product[];
}

const Main: React.FC<MainProps> = ({ products }) => {
  return (
    <main>
      <Slides />
      <section className="products-container" id="productos">
        <h1>Nuestros Productos</h1>
        <div className="cards-container">
          <ProductsLister productos={products} />
        </div>
      </section>
    </main>
  );
};

export default Main;