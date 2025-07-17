
'use client';

import React, { useState, useEffect } from 'react';
import type { Product } from '@/lib/products';

type ProductAvailabilityProps = {
  product: Product;
  disabled?: boolean;
  renderButton?: () => React.ReactNode;
  renderOutOfStock?: () => React.ReactNode;
};

export function ProductAvailability({
  product,
  disabled,
  renderButton,
  renderOutOfStock,
}: ProductAvailabilityProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // On the server or during the initial client render, don't show availability-dependent UI
    // to prevent hydration mismatch.
    if (renderOutOfStock && product.disponibilidad === 'PRODUCTO_AGOTADO') {
       return null;
    }
     if (renderButton) {
      return renderButton();
    }
    return null;
  }

  // Now we're on the client and can safely render based on real availability
  if (product.disponibilidad === 'PRODUCTO_AGOTADO') {
    return renderOutOfStock ? renderOutOfStock() : null;
  }

  if (renderButton) {
    return renderButton();
  }

  return null;
}
