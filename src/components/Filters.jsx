import React from "react";
import { useState, useEffect } from "react";

export default function Filters({
  categories,
  selectedCategory,
  onCategoryChange,
  brands,
  selectedBrands,
  onBrandToggle,
  priceRange,
  onPriceApply,
}) {
  const [minInput, setMinInput] = useState(priceRange.min ?? "");
  const [maxInput, setMaxInput] = useState(priceRange.max ?? "");

  useEffect(() => {
    setMinInput(priceRange.min ?? "");
    setMaxInput(priceRange.max ?? "");
  }, [priceRange.min, priceRange.max]);

  function handleApply() {
    onPriceApply({
      min: minInput === "" ? null : Number(minInput),
      max: maxInput === "" ? null : Number(maxInput),
    });
  }

  return (
    <aside className="filters">
      <h2 className="filters__heading">🔍 Filters</h2>

      <section className="filters__section">
        <h3>Categories</h3>
        <ul className="filters__list">
          <li>
            <label>
              <input
                type="checkbox"
                checked={selectedCategory === ""}
                onChange={() => onCategoryChange("")}
              />
              All Categories
            </label>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedCategory === cat.slug}
                  onChange={() =>
                    onCategoryChange(
                      selectedCategory === cat.slug ? "" : cat.slug,
                    )
                  }
                />
                {cat.name}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="filters__section">
        <h3>Price Range</h3>
        <div className="filters__price-inputs">
          <input
            type="number"
            placeholder="Min"
            min="0"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            min="0"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
          />
        </div>
        <button className="btn btn--primary btn--full" onClick={handleApply}>
          Apply
        </button>
      </section>

      <section className="filters__section">
        <h3>Brands</h3>
        <ul className="filters__list filters__list--scroll">
          {brands.length === 0 && <li className="filters__empty">No brands available</li>}
          {brands.map((brand) => (
            <li key={brand}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => onBrandToggle(brand)}
                />
                {brand}
              </label>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
