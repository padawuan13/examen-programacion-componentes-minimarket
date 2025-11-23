import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { db } from '../firebase';

class ContactForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nombre: '',
      email: '',
      mensaje: '',
      mensajeOk: '',
      enviando: false
    };

    this.validator = new SimpleReactValidator({
      messages: {
        required: 'Este campo es obligatorio',
        email: 'El correo no tiene un formato válido',
        min: 'Debe tener al menos :min caracteres',
        alpha_space: 'Solo se permiten letras y espacios'
      }
    });
  }

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value }, () => {
      this.validator.showMessageFor(name);
      this.forceUpdate();
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.validator.allValid()) {
      const { nombre, email, mensaje } = this.state;

      this.setState({ enviando: true, mensajeOk: '' });

      db.collection('contactos')
        .add({
          nombre,
          email,
          mensaje,
          creadoEn: new Date().toISOString()
        })
        .then(() => {
          this.setState({
            nombre: '',
            email: '',
            mensaje: '',
            mensajeOk: 'Datos guardados correctamente en Firestore 😊',
            enviando: false
          });
          this.validator.hideMessages();
          this.forceUpdate();
        })
        .catch((error) => {
          console.error('Error al guardar en Firestore', error);
          alert('Error al guardar en Firestore: ' + error.message);
          this.setState({ enviando: false });
        });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  render() {
    const { nombre, email, mensaje, mensajeOk, enviando } = this.state;

    return (
      <div>
        <h3 className="mb-3">Formulario de contacto</h3>

        {mensajeOk && (
          <div className="alert alert-success py-2">{mensajeOk}</div>
        )}

        <form onSubmit={this.handleSubmit} className="row g-3">
          {/* Nombre */}
          <div className="col-12">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={nombre}
              onChange={this.handleChange}
              placeholder="Ingresa tu nombre"
            />
            <div className="form-text text-danger">
              {this.validator.message(
                'nombre',
                nombre,
                'required|alpha_space'
              )}
            </div>
          </div>

          {/* Email */}
          <div className="col-12">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={email}
              onChange={this.handleChange}
              placeholder="tucorreo@ejemplo.com"
            />
            <div className="form-text text-danger">
              {this.validator.message('email', email, 'required|email')}
            </div>
          </div>

          {/* Mensaje */}
          <div className="col-12">
            <label className="form-label">Mensaje</label>
            <textarea
              name="mensaje"
              className="form-control"
              rows="4"
              value={mensaje}
              onChange={this.handleChange}
              placeholder="Cuéntanos en qué te podemos ayudar"
            />
            <div className="form-text text-danger">
              {this.validator.message('mensaje', mensaje, 'required|min:10')}
            </div>
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={enviando}
            >
              {enviando ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default ContactForm;
