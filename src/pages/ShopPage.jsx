import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useProducts } from "../context/StoreContext";
import ProductGrid from "../components/ProductGrid";

const PAGE_SIZE = 8;

export default function ShopPage() {
  const { products, loading, error } = useProducts();
  const [params, setParams] = useSearchParams();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [brand, setBrand] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("newest");
  const featuredOnly = params.get("featured") === "true";

  useEffect(() => {
    setSearch(params.get("search") || "");
    setCategory(params.get("category") || "");
    setVisible(PAGE_SIZE);
  }, [params]);

  const categories = [...new Set(products.map((product) => product.category))].sort();
  const brands = [...new Set(products.map((product) => product.brand))].sort();
  const results = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    const filtered = products.filter((product) => {
      const matchesSearch = !term || [product.name, product.brand, product.sku].some((value) => value?.toLocaleLowerCase().includes(term));
      return matchesSearch
        && (!category || product.category === category)
        && (!brand || product.brand === brand)
        && (min === "" || product.price >= Number(min))
        && (max === "" || product.price <= Number(max))
        && (!inStock || product.stock > 0)
        && (!featuredOnly || product.featured);
    });
    return filtered.sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
    });
  }, [products, search, category, brand, min, max, inStock, sort, featuredOnly]);

  const reset = () => {
    setSearch("");
    setCategory("");
    setBrand("");
    setMin("");
    setMax("");
    setInStock(false);
    setSort("newest");
    setParams({});
    setVisible(PAGE_SIZE);
  };
  const updateCategory = (value) => {
    setCategory(value);
    setVisible(PAGE_SIZE);
  };

  return (
    <div className="container page-wrap">
      <div className="shop-heading"><div><span className="eyebrow">THE COMPONENT COLLECTION</span><h1>{category || (featuredOnly ? "Featured gear" : "Find your next part")}</h1><p>PC parts and peripherals for every kind of setup.</p></div><div className="catalog-count">{products.length}<small>CURATED PARTS</small></div></div>
      <div className="shop-toolbar">
        <div className="shop-search"><Search size={17} /><input placeholder="Search name, brand, or SKU" value={search} onChange={(event) => { setSearch(event.target.value); setVisible(PAGE_SIZE); }} /><span>⌘ K</span></div>
        <div className="shop-toolbar-actions"><button className="button button-outline filter-toggle" onClick={() => setMobileFilters(!mobileFilters)}><SlidersHorizontal size={16} /> Filters</button><label className="sort-control">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select></label></div>
      </div>
      <div className="catalog-layout">
        <aside className={`filter-panel ${mobileFilters ? "filter-panel-open" : ""}`}>
          <div className="filter-title"><h3><Filter size={16} /> Filters</h3><button onClick={reset}><RotateCcw size={13} /> Clear</button></div>
          <label className="field-label">Category<select value={category} onChange={(event) => updateCategory(event.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="field-label">Brand<select value={brand} onChange={(event) => setBrand(event.target.value)}><option value="">All brands</option>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
          <div className="field-label">Price range <div className="price-inputs"><input type="number" min="0" placeholder="Min ₱" value={min} onChange={(event) => setMin(event.target.value)} /><input type="number" min="0" placeholder="Max ₱" value={max} onChange={(event) => setMax(event.target.value)} /></div></div>
          <label className="check-label"><input type="checkbox" checked={inStock} onChange={(event) => setInStock(event.target.checked)} /><span>In stock only</span></label>
          <button className="button button-outline clear-mobile" onClick={reset}>Clear all filters</button>
        </aside>
        <div className="catalog-results">
          <div className="results-meta"><span><b>{results.length}</b> {results.length === 1 ? "part" : "parts"} found</span>{(category || brand || search || min || max || inStock || featuredOnly) && <button onClick={reset}>Clear filters <XIcon /></button>}</div>
          <ProductGrid
            products={results.slice(0, visible)}
            loading={loading}
            error={error}
            emptyTitle={category || brand || search || min || max || inStock || featuredOnly ? "No parts match those filters" : "The catalog is empty"}
            emptyMessage={category || brand || search || min || max || inStock || featuredOnly ? "Try a different search or clear some filters." : "Seed the demo products or publish catalog items in the admin dashboard."}
          />
          {!loading && !error && results.length > visible && <div className="load-more"><button className="button button-outline" onClick={() => setVisible((count) => count + PAGE_SIZE)}>Load more parts <span>({results.length - visible} remaining)</span></button></div>}
        </div>
      </div>
    </div>
  );
}

function XIcon() {
  return <span aria-hidden="true">×</span>;
}
