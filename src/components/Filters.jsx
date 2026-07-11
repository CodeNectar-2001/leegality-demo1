import { useState, useEffect } from 'react'

export default function Filters({
  categories,
  selectedCategory,
  onCategoryChange,

}) {


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
                checked={selectedCategory === ''}
                onChange={() => onCategoryChange('')}
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
                    onCategoryChange(selectedCategory === cat.slug ? '' : cat.slug)
                  }
                />
                {cat.name}
              </label>
            </li>
          ))}
        </ul>
      </section>

    </aside>
  )
}
