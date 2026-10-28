import { EmptyState, ErrorState, LoadingState } from "./Feedback";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  loading,
  error,
  compact = false,
  emptyTitle = "No products are available yet",
  emptyMessage = "The catalog is being set up. Please check back soon.",
}) {
  if (loading) return <LoadingState label="Loading the catalog..." />;
  if (error) return <ErrorState message={error} />;
  if (!products.length) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }
  return (
    <div className="product-grid">
      {products.map((product) => <ProductCard key={product.id} product={product} compact={compact} />)}
    </div>
  );
}
