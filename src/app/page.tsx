'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { menuItems } from '@/lib/data';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (menuItems.length > 0) {
      router.replace(`/products/${menuItems[0].slug}`);
    }
  }, [router]);

  return (
     <div className="flex items-center justify-center h-full">
        <p>Cargando productos...</p>
    </div>
  );
}
