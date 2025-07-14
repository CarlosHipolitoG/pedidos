import ProductsPage from './products/[category]/page';

export default function Home() {
  return <ProductsPage params={{ category: 'aguardiente' }} />;
}
