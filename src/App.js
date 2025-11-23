import React, { Component } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { auth } from './firebase';

import ProductList from './components/ProductList';
import ContactForm from './components/ContactForm';
import Auth from './components/Auth';
import FileUpload from './components/FileUpload';
import PaymentPage from './components/PaymentPage';

class App extends Component {
  state = {
    searchTerm: '',
    currentUser: null
  };

  componentDidMount() {
    // Escuchamos el estado de autenticación para el navbar
    this.unsubscribeAuth = auth.onAuthStateChanged((user) => {
      this.setState({ currentUser: user });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
    }
  }

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  render() {
    const { searchTerm, currentUser } = this.state;

    return (
      <div className="app-shell">
        {/* NAVBAR */}
        <header className="meli-navbar shadow-sm">
          <div className="container py-2 d-flex flex-column flex-md-row align-items-md-center gap-2">
            {/* Marca */}
            <div className="brand me-md-3">Aplicación Minimarket</div>

            {/* Buscador (evita recargar la página y filtra productos) */}
            <form
              className="flex-grow-1"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="search"
                className="form-control meli-search-input"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={this.handleSearchChange}
              />
            </form>

            {/* Estado de sesión + enlaces a páginas */}
            <div className="d-flex align-items-center gap-3 ms-md-3">
              {currentUser && (
              <span className="nav-link-like">
                  {`Bienvenido, ${currentUser.email}`}
              </span>
    )}

              <NavLink
                to="/"
                className="btn btn-link nav-link-like p-0"
              >
                Productos
              </NavLink>
              <NavLink
                to="/contacto"
                className="btn btn-link nav-link-like p-0"
              >
                Contacto
              </NavLink>
              <NavLink
                to="/cuenta"
                className="btn btn-link nav-link-like p-0"
              >
                Mi cuenta
              </NavLink>
            </div>
          </div>
        </header>

        {/* CONTENIDO POR RUTA */}
        <main className="py-4">
          <div className="container">
            <Routes>
              {/* Página de productos */}
              <Route
                path="/"
                element={
                  <section className="mb-4">
                    <div className="card shadow-sm">
                      <div className="card-header">
                        Ejercicio 1: Lista de productos y carrito
                      </div>
                      <div className="card-body">
                        <ProductList searchTerm={searchTerm} />
                      </div>
                    </div>
                  </section>
                }
              />

              {/* Página de contacto */}
              <Route
                path="/contacto"
                element={
                  <section className="mb-4">
                    <div className="card shadow-sm">
                      <div className="card-header">
                        Ejercicio 2: Formulario con validaciones
                      </div>
                      <div className="card-body">
                        <ContactForm />
                      </div>
                    </div>
                  </section>
                }
              />

              {/* Página de cuenta (Auth + Storage) */}
              <Route
                path="/cuenta"
                element={
                  <section className="mb-4">
                    <div className="card shadow-sm">
                      <div className="card-header">
                        Ejercicio 3: Auth y subida de archivos
                      </div>
                      <div className="card-body">
                        <div className="row g-4">
                          <div className="col-md-6">
                            <Auth />
                          </div>
                          <div className="col-md-6">
                            <FileUpload />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                }
              />
              {/* Página de pagos */}
              <Route
                path="/pago"
                element={<PaymentPage />}
              />
            </Routes>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
