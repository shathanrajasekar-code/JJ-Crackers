import { getCategories, getProducts } from '@/lib/db';
import { ProductCatalogClient } from '@/components/products/ProductCatalogClient';

// ISR: serve cached page instantly, revalidate in background every 30s
// Admin changes appear within 30 seconds; page loads are instant
export const revalidate = 30;

export default async function ProductsPage() {
  // Fetch initial data directly on the server to optimize FCP, LCP and SEO
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <ProductCatalogClient 
      initialProducts={products} 
      initialCategories={categories} 
    />
  );
}
