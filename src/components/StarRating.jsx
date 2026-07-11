export default function StarRating({ rating = 0 }) {
  const rounded = Math.round(rating)
  const stars = Array.from({ length: 5 }, (_, i) => i < rounded)

  return (
    <span className="star-rating" aria-label={`Rated ${rating} out of 5`}>
      {stars.map((filled, i) => (
        <span key={i} className={filled ? 'star star--filled' : 'star'}>
          ★
        </span>
      ))}
      <span className="star-rating__value">({rating.toFixed(1)})</span>
    </span>
  )
}
