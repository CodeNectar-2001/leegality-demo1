import React from "react";
import { useNavigate } from 'react-router-dom'

export default function Header({ searchTerm, onSearchChange }) {
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header__inner">
        <button className="icon-btn" aria-label="Menu">☰</button>

        <form className="header__search" onSubmit={handleSubmit} role="search">
          <span className="header__search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search products"
          />
        </form>

        <div className="header__actions">
          <button className="icon-btn" aria-label="Cart">🛒</button>
          <button className="icon-btn" aria-label="Wishlist">◐</button>
          <button className="icon-btn" aria-label="Account">👤</button>
        </div>
      </div>
    </header>
  )
}
