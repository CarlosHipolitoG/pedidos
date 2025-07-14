'use client';
import { productsByCategory, menuItems } from '@/lib/data';
import ProductCard from '@/components/product-card';

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;
  const products = productsByCategory[category] || [];
  const categoryInfo = menuItems.find(item => item.slug === category);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-primary">{categoryInfo?.name || 'Categoría'}</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>No hay productos disponibles en esta categoría.</p>
      )}
    </div>
  );
}
