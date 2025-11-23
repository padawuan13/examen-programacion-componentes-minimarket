import React, { Component } from 'react';
import ProductItem from './ProductItem';
import { Link } from 'react-router-dom';

class ProductList extends Component {
  state = {
    products: [
      { id: 1, name: 'Manzanas 1kg', price: 1000, image: '/img/manzanas.jpg' },
      { id: 2, name: 'Naranjas 1kg', price: 1200, image: '/img/naranjas.jpg' },
      { id: 3, name: 'Plátanos 1kg', price: 900, image: '/img/platanos.jpg' },
      { id: 4, name: 'Leche entera 1L', price: 1100, image: '/img/leche-entera.jpg' },
      { id: 5, name: 'Pan de molde', price: 1500, image: '/img/pan-molde.jpg' },
      { id: 6, name: 'Huevos docena', price: 2200, image: '/img/huevos.jpg' },
      { id: 7, name: 'Arroz 1kg', price: 1300, image: '/img/arroz.jpg' },
      { id: 8, name: 'Café molido 250g', price: 2500, image: '/img/cafe.jpg' }
    ],
    cart: []
  };

  handleAddToCart = (product) => {
    this.setState((prevState) => {
      const existing = prevState.cart.find((item) => item.id === product.id);

      if (existing) {
        return {
          cart: prevState.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          cart: [...prevState.cart, { ...product, quantity: 1 }]
        };
      }
    });
  };

  render() {
    const { products, cart } = this.state;
    const { searchTerm } = this.props;

    // Filtro simple por nombre (case-insensitive)
    const filtro = (searchTerm || '').toLowerCase();
    const filteredProducts = products.filter((p) =>
      p.name.toLowerCase().includes(filtro)
    );

    // Total del carrito
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    let resumenEnvio = '';
    if (total === 0) {
      resumenEnvio =
        'Agrega productos al carrito para ver las condiciones de envío.';
    } else if (total < 15000) {
      resumenEnvio = `Total $${total.toLocaleString(
        'es-CL'
      )}. Debes retirar en tienda. Envío gratis por compras desde $15.000.`;
    } else {
      resumenEnvio = `Total $${total.toLocaleString(
        'es-CL'
      )}. ¡Tu compra tiene envío gratis por ser sobre $15.000! 🎉`;
    }

    return (
      <div className="row">
        {/* Lista de productos */}
        <div className="col-md-7 mb-3 mb-md-0">
          <h3 className="mb-3">Ofertas destacadas</h3>

          {filteredProducts.length === 0 ? (
            <p className="text-muted">
              No se encontraron productos para “{searchTerm || ''}”.
            </p>
          ) : (
            <div className="row g-3">
              {filteredProducts.map((p) => (
                <div className="col-sm-6 col-lg-4" key={p.id}>
                  <ProductItem product={p} onAdd={this.handleAddToCart} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Carrito + condiciones */}
        <div className="col-md-5">
          <h3 className="mb-3">Carrito</h3>
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {cart.length === 0 ? (
                <p className="text-muted mb-0">Tu carrito está vacío</p>
              ) : (
                <>
                  <ul className="list-group list-group-flush mb-3">
                    {cart.map((item) => (
                      <li
                        key={item.id}
                        className="list-group-item d-flex justify-content-between align-items-center px-0"
                      >
                        <div>
                          <div>
                            {item.name}{' '}
                            <span className="text-muted text-xs">
                              × {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="fw-semibold">
                          $
                          {(item.price * item.quantity).toLocaleString('es-CL')}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-semibold">Total</span>
                    <span className="price-tag">
                      ${total.toLocaleString('es-CL')}
                    </span>
                  </div>

                  <div className="mb-3">
                    <h6 className="mb-1">Condiciones de compra</h6>
                    <ul className="text-xs text-muted mb-1 ps-3">
                      <li>Retiro en tienda para compras menores a $15.000.</li>
                      <li>Envío gratis por compras desde $15.000.</li>
                    </ul>
                    <p className="text-xs mb-0">{resumenEnvio}</p>
                  </div>

                  <div className="d-grid">
                    <Link
                      to="/pago"
                      state={{ total }}
                      className="btn btn-success btn-sm text-center"
                    >
                      Finalizar compra
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductList;
