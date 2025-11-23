// src/components/PaymentPage.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PaymentPage = () => {
  const location = useLocation();
  // viene desde el carrito con Link state
  const total = location.state?.total ?? 0;
  const totalFormatted = total.toLocaleString('es-CL');

  return (
    <section className="mb-4">
      <div className="card shadow-sm">
        <div className="card-header">Resumen de pago</div>
        <div className="card-body">
          {total > 0 ? (
            <>
              <h3 className="mb-3">Gracias por tu compra 🛒</h3>
              <p className="mb-2">
                El total de tu pedido es{' '}
                <strong>${totalFormatted}</strong>.
              </p>
              <p className="text-muted">
                Esta es una página de pago de ejemplo para el examen.
                <br></br>
                Aquí se podría integrar un medio de pago real
                (Webpay, Mercado Pago, etc.).
              </p>
            </>
          ) : (
            <>
              <h3 className="mb-3">No tienes un carrito activo</h3>
              <p className="text-muted">
                Vuelve a la página de productos para armar tu compra.
              </p>
            </>
          )}

          <hr className="my-4" />

          <div className="d-flex gap-2">
            <Link to="/" className="btn btn-outline-secondary btn-sm">
              Volver a productos
            </Link>
            {total > 0 && (
              <button className="btn btn-success btn-sm" disabled>
                Confirmar pago (demo)
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;
