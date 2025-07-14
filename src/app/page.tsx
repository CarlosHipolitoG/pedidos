'use client';
import { productsByCategory, menuItems } from '@/lib/data';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Home() {
    const defaultCategory = 'aguardiente';
    const products = productsByCategory[defaultCategory] || [];
    const categoryInfo = menuItems.find(item => item.slug === defaultCategory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <aside className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-primary">Categorías</h2>
            <ul>
                {menuItems.map((item) => (
                    <li key={item.slug}>
                        <Link href={`/products/${item.slug}`} passHref>
                           <Button
                                variant="ghost"
                                className={`w-full justify-start text-left mb-1`}
                            >
                                {item.icon}
                                <span className="ml-2">{item.name}</span>
                           </Button>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
      </div>
      <div className="md:col-span-3">
         <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-primary">{categoryInfo?.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}
