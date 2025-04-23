
# :mortar_board: Trabajo fin de grado :mortar_board:

## 📚 Aplicación web para planificación de escritura de novelas 📚

Para este proyecto voy a crear una aplicación web destinada a escritores que facilite la planificación y estructuración de novelas mediante herramientas intuitivas. La aplicación permitirá gestionar capítulos, personajes y eventos dentro de una línea temporal interactiva, además de proporcionar funcionalidades adicionales como la posibilidad de gestionar sistemas de magia para novelas de fantasía y un modo de escritura sin distracciones.


## 🎯 Objetivos específicos: 

### :one: Gestión de Capítulos:

**Descripción:** Implementación de una interfaz que permita la creación y organización de capítulos de forma sencilla e intuitiva.

**Características:**

- Cada capítulo tendrá un título y un área para la redacción con un editor de texto integrado.
- Opción de visualizar los capítulos en lista o en miniaturas para una mejor navegación.
- Posibilidad de guardar los cambios en tiempo real.


### 2️⃣ Listado y Gestión de Personajes:

**Descripción:** Una sección donde el escritor pueda añadir, editar y gestionar los personajes de la novela, incluyendo detalles como nombre, rol (protagonista, antagonista, etc.), características físicas y psicológicas, y relaciones con otros personajes.

**Características:**

- Listado de personajes con búsqueda y filtrado.
- Ficha de personaje con campos para nombre, descripción, rol, apariencia, motivaciones, y relación con otros personajes.
- Posibilidad de vincular a los personajes con los eventos o capítulos donde aparecen.


### 3️⃣ Línea Temporal de Eventos:

**Descripción:** Desarrollo de una representación gráfica interactiva que permita a los escritores visualizar los eventos principales de su historia.Posibilidad de añadir interactividad para arrastrar y soltar eventos, modificar fechas, o agregar descripciones.

**Características:**

- Cada evento podrá ser creado, editado y eliminado.
- Cada evento contará con una descripción breve, una fecha asignada y la posibilidad de vincularlo a un capítulo. 
- La línea temporal permitirá la interacción mediante arrastrar y soltar eventos para reorganizarlos fácilmente.


### 4️⃣ Gestión de sistemas de magia para novelas fantásticas

**Descripción:** Esta funcionalidad permitirá definir y estructurar sistemas mágicos dentro de lahistoria. Se incluirán opciones para:

- Reglas del Sistema de Magia: Definir principios fundamentales de la magia en la historia. Tipos de magia (elemental, arcana, etc.).
- Costos y limitaciones.
- Hechizos y Habilidades: Crear un listado de hechizos con sus descripciones.
- Requisitos para usar cada hechizo (energía, entrenamiento, objetos mágicos).
- Objetos Mágicos y Reliquias
- Relación con personajes o eventos.


### :five: Navegación entre secciones:

**Descripción:** Implementación de una barra de navegación o menú lateral que facilite el acceso a las diferentes secciones de la aplicación, como la línea temporal, los capítulos y los personajes

**Características:**

- Acceso rápido a los capítulos, personajes, eventos y sistemas de magia.
- Vista global de la novela con fácil acceso a cada sección.
- Posibilidad de regresar al capítulo o evento anterior.


### 6️⃣ Incluir un modo de escritura minimalista:

Implementar de una opción de escritura en un entorno sin distracciones, con fondo oscuro y texto en blanco y negro, adaptado a las preferencias de los escritores que buscan un ambiente de trabajo más enfocado.


### ✅ Integración con IA (Opcional):

Posibilidad de añadir una funcionalidad que ayude a los escritores a generar ideas, sugerir nombres de personajes, o incluso proporcionar resúmenes de la trama usando una API de procesamiento de lenguaje natural (NLP).



## 🛠️ Herramientas y tecnologías a utilizar

### 📌 Frontend (Interfaz de usuario):
- React.js: Biblioteca de JavaScript para la creación de interfaces dinámicas ymodulares.
- Tailwind CSS o Material UI: Para el diseño visual y estilización de la aplicación.
- React Router: Para la navegación entre las distintas secciones de la aplicación.

### 📌 Backend y Base de Datos:
- Node.js con Express.js: Para gestionar la lógica del servidor y la API.
- Firebase Firestore: Base de datos en la nube con sincronización en tiempo real.
- Firebase Auth: Sistema de autenticación opcional para gestión de usuarios.
- Firebase Storage: Almacenamiento de imágenes y otros recursos multimedia.

### 📌 Despliegue y Control de Versiones:
- Git y GitHub: Para la gestión del código fuente y control de versiones.
- Vercel o Firebase Hosting: Para la publicación y mantenimiento de la aplicación.

