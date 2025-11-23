// src/components/FileUpload.jsx
import React, { Component } from 'react';
import { storage } from '../firebase';

class FileUpload extends Component {
  state = {
    file: null,
    progress: 0,
    downloadURL: '',
    error: ''
  };

  handleFileChange = (e) => {
    const file = e.target.files[0];
    this.setState({ file, error: '', progress: 0, downloadURL: '' });
  };

  handleUpload = (e) => {
    e.preventDefault();
    const { file } = this.state;

    if (!file) {
      this.setState({ error: 'Primero selecciona un archivo.' });
      return;
    }

    const uploadTask = storage.ref(`uploads/${file.name}`).put(file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({ progress });
      },
      (error) => {
        console.error(error);
        this.setState({ error: 'Error al subir el archivo.' });
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          this.setState({
            downloadURL: url,
            error: ''
          });
        });
      }
    );
  };

  render() {
    const { progress, downloadURL, error } = this.state;

    return (
      <div>
        <h5 className="mb-3">Subida de archivos (Firebase Storage)</h5>

        {error && (
          <div className="alert alert-danger p-2">
            {error}
          </div>
        )}

        <form onSubmit={this.handleUpload}>
          <div className="mb-2">
            <input
              type="file"
              className="form-control form-control-sm"
              onChange={this.handleFileChange}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            Subir archivo
          </button>
        </form>

        <div className="mt-2">
          <label>Progreso:</label>
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%` }}
            >
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {downloadURL && (
          <div className="mt-2">
            <p>Archivo disponible en:</p>
            <a href={downloadURL} target="_blank" rel="noreferrer">
              {downloadURL}
            </a>
          </div>
        )}
      </div>
    );
  }
}

export default FileUpload;
