import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Filters from "../components/Filters.jsx";
import ProductCard from "../components/ProductCard.jsx";

import {
  fetchCategories,
  fetchProductsForClientFilter,
} from "../api/products.js";
import Pagination from "../components/Pagination.jsx";

const PAGE_SIZE = 8;

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const brandsParam = searchParams.get("brands") || "";
  const selectedBrands = brandsParam ? brandsParam.split(",") : [];

  const page = Number(searchParams.get("page") || "1");

  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  function updateParams(updates, resetPage = false) {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    setSearchParams(next);
  }

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProductsForClientFilter({ category })
      .then((data) => {
        if (cancelled) return;
        setAllProducts(data.products || []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Something went wrong while loading products.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, retryKey]);

  const brands = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.brand).filter(Boolean));
    return Array.from(set).sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      if (
        minPrice !== null &&
        minPrice !== undefined &&
        minPrice !== "" &&
        p.price < Number(minPrice)
      )
        return false;
      if (
        maxPrice !== null &&
        maxPrice !== undefined &&
        maxPrice !== "" &&
        p.price > Number(maxPrice)
      )
        return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand))
        return false;

      return true;
    });
  }, [allProducts, minPrice, maxPrice, selectedBrands]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);
  const pageProducts = filteredProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function handleCategoryChange(slug) {
    updateParams({ category: slug }, true);
  }
  function handleBrandToggle(brand) {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    updateParams({ brands: next.join(",") }, true);
  }

  function handlePriceApply({ min, max }) {
    updateParams({ minPrice: min ?? "", maxPrice: max ?? "" }, true);
  }

  function handlePageChange(newPage) {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <div className="page">
      <div className="layout">
        <Filters
          categories={categories}
          selectedCategory={category}
          onCategoryChange={handleCategoryChange}
          brands={brands}
          selectedBrands={selectedBrands}
          onBrandToggle={handleBrandToggle}
          priceRange={{ min: minPrice, max: maxPrice }}
          onPriceApply={handlePriceApply}
        />

        <main className="listing">
          {loading && (
            <div className="state-message">
              <div className="spinner" />
              <p>Loading products…</p>
            </div>
          )}

          {!loading && error && (
            <div className="state-message state-message--error">
              <p>⚠️ {error}</p>
              <button
                className="btn btn--primary"
                onClick={() => setRetryKey((k) => k + 1)}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="state-message">
              <p>No products match your filters. Try adjusting them.</p>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <>
              <div className="product-grid">
                {pageProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
