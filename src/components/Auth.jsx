// src/components/Auth.jsx
import React, { Component } from 'react';
import { auth } from '../firebase';

class Auth extends Component {
  state = {
    email: '',
    password: '',
    user: null,
    error: ''
  };

  componentDidMount() {
    // Escuchar cambios en la sesión
    this.unsubscribe = auth.onAuthStateChanged((user) => {
      this.setState({ user });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: ''
    });
  };

  handleRegister = (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        console.log('Usuario registrado:', cred.user);
        this.setState({ email: '', password: '', error: '' });
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };

  handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    auth
      .signInWithEmailAndPassword(email, password)
      .then((cred) => {
        console.log('Sesión iniciada:', cred.user);
        this.setState({ email: '', password: '', error: '' });
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };

  handleLogout = () => {
    auth.signOut();
  };

  render() {
    const { email, password, user, error } = this.state;

    return (
      <div>
        <h5 className="mb-3">Autenticación (Firebase Auth)</h5>

        {user && (
          <div className="alert alert-success p-2">
            Sesión iniciada como <strong>{user.email}</strong>
          </div>
        )}

        {error && (
          <div className="alert alert-danger p-2">
            {error}
          </div>
        )}

        <form>
          <div className="mb-2">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control form-control-sm"
              value={email}
              onChange={this.handleChange}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control form-control-sm"
              value={password}
              onChange={this.handleChange}
            />
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={this.handleRegister}
            >
              Registrarse
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={this.handleLogin}
            >
              Iniciar sesión
            </button>
            {user && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={this.handleLogout}
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default Auth;
