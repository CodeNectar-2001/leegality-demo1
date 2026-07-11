import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <article className="product-card" role="button" tabIndex={0}>
      <div className="product-card__image-wrap">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">{product.title}</h3>
        <div className="product-card__price">${product.price}</div>
      </div>
    </article>
  );
}
