'use client';

import { productsByCategory, menuItems } from '@/lib/data';
import ProductCard from '@/components/product-card';
import { notFound } from 'next/navigation';

export default function ProductsPage({ params }: { params: { category: string } }) {
  const { category } = params;
  const products = productsByCategory[category];
  const categoryInfo = menuItems.find(item => item.slug === category);

  if (!products || !categoryInfo) {
    // Or render a "not found" component
    return notFound();
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">{categoryInfo.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
