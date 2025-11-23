# Examen Programación de Componentes – Aplicación Minimarket

## 1. Descripción general

Este proyecto corresponde al **Examen de la asignatura Programación de Componentes**.  
Se desarrolló una aplicación React que simula un **minimarket** con:

- Listado de productos y carrito de compras (Ejercicio 1).
- Formulario de contacto con validaciones y guardado en Firebase/Firestore (Ejercicio 2).
- Estilos con Bootstrap, autenticación de usuarios (Firebase Auth), subida de archivos (Firebase Storage) y despliegue en Android mediante Cordova/Android Studio y APK firmado (Ejercicio 3).

La app está pensada como un prototipo funcional tanto para **web** (React) como para **Android** (APK).

---

## 2. Tecnologías utilizadas

- **React** (create-react-app)
- **React Router DOM** con `HashRouter` para la navegación:
  - `/` → Productos y carrito
  - `/contacto` → Formulario de contacto
  - `/cuenta` → Autenticación y subida de archivos
  - `/pago` → Pantalla de pago de ejemplo
- Componentes:
  - **Componentes de clase** (por ejemplo `ProductList`, `ContactForm`).
  - **Componentes funcionales** (por ejemplo `ProductItem`, `Auth`, `FileUpload`, `PaymentPage`).
- **Bootstrap 5** para el diseño responsivo.
- **simple-react-validator** para validación de formularios.
- **Firebase**:
  - Firebase Auth (email/contraseña)
  - Cloud Firestore (guardar datos del formulario de contacto)
  - Firebase Storage (subida de archivos con barra de progreso)
- **Cordova** + **Android SDK** + **Gradle** para generar APK.
- Firma de APK con **keystore propio** y verificación con `apksigner`.

---

## 3. Estructura del proyecto (web)

Proyecto principal de React: `examen-componentes`

Estructura relevante:

- `src/`
  - `index.js` – Punto de entrada de React. Envuelve la app con `HashRouter` y carga Bootstrap.
  - `App.js` – Shell principal de la aplicación. Define el layout, el navbar y las rutas.
  - `firebase.js` – Configuración de Firebase (Auth, Firestore y Storage).
  - `components/`
    - `ProductList.jsx` – Componente padre que:
      - Contiene el arreglo de productos (`state.products`).
      - Implementa el carrito de compras (`state.cart` + `setState`).
      - Usa `map()` para renderizar la lista de productos.
      - Calcula el **total** y las **condiciones de envío**.
      - Recibe el término de búsqueda (`searchTerm`) desde `App` por `props`.
    - `ProductItem.jsx` – Componente hijo que:
      - Recibe el producto por `props`.
      - Muestra imagen, nombre, precio y botón “Agregar al carrito”.
      - Notifica al padre usando un callback (`onAdd(product)`).
    - `ContactForm.jsx` – Formulario de contacto:
      - Maneja `nombre`, `email`, `mensaje` en el **state**.
      - Usa **simple-react-validator** para validar:
        - Nombre requerido, solo letras y espacios.
        - Email con formato válido.
        - Mensaje con un mínimo de caracteres.
      - Al enviar, guarda los datos en **Firestore** (`db.collection('contactos')`).
    - `Auth.jsx` – Autenticación de usuarios:
      - Registro e inicio de sesión mediante **Firebase Auth** (email/contraseña).
      - Uso de `auth.onAuthStateChanged` para detectar sesión activa.
      - Muestra al usuario autenticado (“Sesión iniciada como …”).
      - El navbar muestra **“Bienvenido correo@…”** cuando hay sesión.
      - Cierra sesión con `auth.signOut()`.
    - `FileUpload.jsx` – Subida de archivos:
      - Selecciona un archivo desde el equipo.
      - Sube el archivo a **Firebase Storage**.
      - Muestra el **progreso de la subida** en porcentaje.
      - Obtiene y muestra la **URL de descarga** del archivo.
    - `PaymentPage.jsx` – Pantalla de pago:
      - Recibe el `total` del carrito usando `state` en el `Link` de React Router.
      - Muestra el monto final y un texto informativo de pago (pantalla demo).

---

## 4. Ejercicio 1 – Lista de productos y carrito

**Requisitos del enunciado:**

- Crear un proyecto React.
- Diseñar componentes para mostrar una lista de productos (componente padre e hijo).
- Implementar `map()` para renderizar la lista.
- Manejar la comunicación padre-hijo e hijo-padre usando `props` y callbacks.
- Actualizar el carrito con `state` y `this.setState({})`.

**Implementación:**

- Componente padre: **`ProductList.jsx`**
  - Define `state.products` con varios productos (nombre, precio, imagen).
  - Define `state.cart` para manejar los ítems del carrito.
  - Usa `map()` para renderizar cada producto mediante el componente hijo `ProductItem`.
  - Recibe `searchTerm` desde `App` para filtrar productos.
  - Calcula el **total** del carrito y muestra condiciones:
    - Menos de $15.000 → retiro en tienda.
    - Desde $15.000 → envío gratis.
  - Muestra el resumen de envío bajo el total del carrito.
  - El botón **“Finalizar compra”** lleva a la ruta `/pago`, pasando el total mediante `state` del `Link`.

- Componente hijo: **`ProductItem.jsx`**
  - Recibe `product` y `onAdd` por `props`.
  - Muestra imagen, nombre, precio y botón “Agregar al carrito”.
  - Al hacer clic, llama a `onAdd(product)`, comunicándose con el componente padre.

De esta forma se cumple lo solicitado: componentes de clase, props, state, callbacks y renderizado con `map()`.

---

## 5. Ejercicio 2 – Formulario con validaciones y Firestore

**Requisitos del enunciado:**

- Crear un formulario con React.
- Configurar `react-simple-validator` (se utilizó `simple-react-validator`) para validaciones.
- Conectar la aplicación a Firebase.
- Guardar los datos del formulario en **Firestore Database**.

**Implementación (`ContactForm.jsx`):**

- Campos:
  - `nombre`
  - `email`
  - `mensaje`
- Validaciones (simple-react-validator):
  - `nombre`: `required|alpha_space`
  - `email`: `required|email`
  - `mensaje`: `required|min:10`
- Lógica al enviar:
  - Si las validaciones pasan, se guarda en Firestore:

    ```js
    db.collection('contactos').add({
      nombre,
      email,
      mensaje,
      creadoEn: new Date().toISOString()
    });
    ```

  - Al guardar correctamente:
    - Limpia el formulario.
    - Muestra un mensaje de éxito.
- Conexión a Firebase:
  - Definida en `firebase.js`, donde se inicializa el proyecto y se exporta `db`.

Así se cumple el uso de formularios controlados, validaciones y persistencia en Firestore.

---

## 6. Ejercicio 3 – Bootstrap, Auth, Storage y APK Android

**Requisitos del enunciado:**

1. Estilizar el formulario y componentes con **Bootstrap**.  
2. Implementar **Firebase Auth** y **Firebase Storage**.  
3. Configurar **Android Studio, Gradle y Cordova**.  
4. Exportar el proyecto a **APK**.  
5. Firmar el APK y probarlo en un dispositivo.

### 6.1 Estilos con Bootstrap

- Se importó Bootstrap globalmente en `index.js`:

  ```js
  import 'bootstrap/dist/css/bootstrap.min.css';
Se utilizaron clases Bootstrap en todos los componentes:

container, row, col-*, card, card-header, card-body, btn, alert, form-control, etc.

Se diseñó un navbar similar a un marketplace (buscador, navegación, estado de sesión) y tarjetas de producto con imágenes y botones.

6.2 Firebase Auth (Auth.jsx)
Registro de usuarios con email/contraseña (createUserWithEmailAndPassword).

Inicio de sesión (signInWithEmailAndPassword).

Observador de sesión (auth.onAuthStateChanged) que:

Actualiza la UI mostrando “Sesión iniciada como …”.

Permite que el navbar muestre “Bienvenido correo@…”.

Cierre de sesión con auth.signOut().

6.3 Firebase Storage (FileUpload.jsx)
Selección de archivo desde el equipo.

Subida a Firebase Storage con put(file).

Monitoreo del progreso usando on('state_changed', ...).

Obtención de la URL de descarga con getDownloadURL() y despliegue en pantalla.

6.4 Cordova + Android + APK
Se creó un proyecto Cordova y se integró el build de React:

Crear proyecto Cordova:

bash
Copiar código
cordova create minimarket-android com.felipehernandez.minimarket MinimarketApp
cd minimarket-android
cordova platform add android
Generar build de React:

bash
Copiar código
cd ../examen-componentes
npm run build
Copiar el contenido de build/ a minimarket-android/www/.

Construir APK de release:

bash
Copiar código
cd ../minimarket-android
cordova build android --release -- --packageType=apk
El APK sin firmar se genera en:

platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk

6.5 Firma del APK y prueba en dispositivo
Se creó un keystore propio:

bash
Copiar código
keytool -genkeypair -v -keystore minimarket-key.jks -alias minimarket -keyalg RSA -keysize 2048 -validity 10000
Alineación del APK:

bash
Copiar código
zipalign -v 4 app-release-unsigned.apk minimarket-release-aligned.apk
Firma con apksigner:

bash
Copiar código
apksigner sign --ks minimarket-key.jks --ks-key-alias minimarket minimarket-release-aligned.apk
Verificación de la firma:

bash
Copiar código
apksigner verify --verbose minimarket-release-aligned.apk
Instalación en dispositivo Android:

Copia del APK al teléfono.

Activación de instalación de apps desconocidas.

Instalación y prueba de la app en un dispositivo real.

7. Cómo ejecutar el proyecto (web)
Requisitos previos
Node.js y npm instalados.

Una cuenta de Firebase configurada con:

Auth (email/contraseña)

Firestore Database

Storage

Pasos
Clonar o descargar este proyecto.

Instalar dependencias:

bash
Copiar código
npm install
Configurar src/firebase.js con las credenciales del proyecto Firebase:

js
Copiar código
const firebaseConfig = {
  apiKey: "AIzaSyDVK_AsMC92DE9k6W3RQUPNxF8LCt8JlNk",
  authDomain: "examen-prog-componentes-c0f9c.firebaseapp.com",
  projectId: "examen-prog-componentes-c0f9c",
  storageBucket: "examen-prog-componentes-c0f9c.firebasestorage.app",
  messagingSenderId: "462770591300",
  appId: "1:462770591300:web:7082b9f344d389ac524e11"
};
Ejecutar en modo desarrollo:

bash
Copiar código
npm start
Abrir en el navegador:

arduino
Copiar código
http://localhost:3000
8. Cómo regenerar el APK 
Generar build de React:

bash
Copiar código
cd examen-componentes
npm run build
Copiar el contenido de build/ a minimarket-android/www/.

Construir APK de release:

bash
Copiar código
cd ../minimarket-android
cordova build android --release -- --packageType=apk
Alinear y firmar con zipalign + apksigner usando el keystore minimarket-key.jks.