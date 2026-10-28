import { ArrowUpRight, Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format";
import { useCart, useToast } from "../context/StoreContext";
import ProductImage from "./ProductImage";

export default function ProductCard({ product, compact = false }) {
  const { add } = useCart();
  const toast = useToast();
  const addToCart = () => {
    try {
      add(product);
      toast(`${product.name} added to cart`);
    } catch (error) {
      toast(error.message, "error");
    }
  };

  return (
    <article className={`product-card ${compact ? "product-card-compact" : ""}`}>
      <Link to={`/product/${product.slug}`} className="product-card-image group">
        {product.featured && <span className="product-badge">FEATURED</span>}
        <ProductImage src={product.image} alt={product.name} className="transition duration-500 group-hover:scale-105" />
        <span className="product-quick-view"><ArrowUpRight size={17} /> View details</span>
      </Link>
      <div className="product-card-body">
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow">{product.brand}</span>
          <span className="stock-tag">{product.stock > 0 ? "In stock" : "Sold out"}</span>
        </div>
        <Link to={`/product/${product.slug}`} className="product-title line-clamp-2">{product.name}</Link>
        {!compact && <p className="product-description line-clamp-2">{product.description}</p>}
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button
            type="button"
            className="icon-button add-button"
            onClick={addToCart}
            disabled={!product.stock}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
