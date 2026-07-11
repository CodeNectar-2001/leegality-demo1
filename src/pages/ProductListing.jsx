import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Filters from "../components/Filters.jsx";
import ProductCard from "../components/ProductCard.jsx";

import {
  fetchCategories,
  fetchProductsForClientFilter,
} from "../api/products.js";

const PAGE_SIZE = 8;

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "";

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
      return true;
    });
  }, [allProducts]);

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

  return (
    <div className="page">
      <div className="layout">
        <Filters
          categories={categories}
          selectedCategory={category}
          onCategoryChange={handleCategoryChange}
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
