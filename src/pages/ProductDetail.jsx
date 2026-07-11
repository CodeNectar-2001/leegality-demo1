import React from "react";
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import StarRating from '../components/StarRating.jsx'
import { fetchProductById } from '../api/products.js'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchProductById(id)
      .then((data) => {
        if (!cancelled) setProduct(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load this product.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="page">
      <Header searchTerm="" onSearchChange={() => {}} />

      <div className="detail-wrap">
      
        <button className="btn btn--ghost" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {loading && (
          <div className="state-message">
            <div className="spinner" />
            <p>Loading product…</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-message state-message--error">
            <p>⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && product && (
          <div className="detail-card">
            <div className="detail-card__image">
              <img src={product.thumbnail} alt={product.title} />
            </div>

            <div className="detail-card__info">
              <h1>{product.title}</h1>
              <div className="detail-card__price">${product.price}</div>
              <StarRating rating={product.rating} />

              <dl className="detail-card__meta">
                <div>
                  <dt>Brand</dt>
                  <dd>{product.brand || '—'}</dd>
                </div>
                <div>
                  <dt>Category</dt>
                  <dd className="capitalize">{product.category}</dd>
                </div>
              </dl>

              <hr />

              <section>
                <h2>Description</h2>
                <p>{product.description}</p>
              </section>

              {Array.isArray(product.reviews) && product.reviews.length > 0 && (
                <>
                  <hr />
                  <section>
                    <h2>Reviews</h2>
                    <ul className="reviews">
                      {product.reviews.map((review, i) => (
                        <li key={i} className="review">
                          <div className="review__header">
                            <strong>{review.reviewerName}</strong>
                            <StarRating rating={review.rating} />
                          </div>
                          <p>{review.comment}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
