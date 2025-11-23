import React from 'react';

const ProductItem = ({ product, onAdd }) => {
  const handleClick = () => {
    onAdd(product);
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        {/* Imagen del producto */}
        <img
          src={product.image}
          alt={product.name}
          className="img-fluid mb-3 rounded product-image"
        />

        <h6 className="card-title mb-1">{product.name}</h6>
        <div className="price-tag mb-3">
          ${product.price.toLocaleString('es-CL')}
        </div>

        <button
          className="btn btn-primary btn-sm mt-auto"
          onClick={handleClick}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
