# 💼 Jobs API

![Node.js](https://img.shields.io/badge/Node.js-v18-green.svg)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-orange.svg)
![AWS](https://img.shields.io/badge/Deployment-AWS%20EC2-yellow.svg)

Una API RESTful robusta para la gestión de ofertas de trabajo (Jobs). Este proyecto implementa autenticación segura, manejo avanzado de errores, documentación con Swagger y una infraestructura de despliegue automatizada usando Docker y AWS.

## 🚀 Características Principales

### Funcionalidades de Negocio
* **Autenticación de Usuarios (JWT):**
    * Registro con validación de email y hashing de contraseñas (bcryptjs).
    * Login con generación de tokens JWT.
* **Gestión de Trabajos (CRUD):** Crear, leer, actualizar y eliminar ofertas de trabajo asociadas a un usuario específico.

### Arquitectura y DevOps
* **Containerización:** Docker & Docker Compose.
* **Reverse Proxy:** Nginx configurado como proxy inverso.
* **CI/CD Pipeline:** GitHub Actions automatiza el build, test y despliegue a AWS EC2 al crear nuevos tags (`v*`).
* **Self-Healing:** Implementación de Docker Healthchecks para asegurar cero tiempo de inactividad (Zero Downtime Deployments).

### Seguridad Implementada
Este proyecto utiliza un enfoque de defensa en profundidad:
* `helmet`: Headers de seguridad HTTP.
* `cors`: Gestión de orígenes cruzados.
* `xss-clean`: Sanitización de entradas contra ataques XSS.
* `express-rate-limit`: Prevención de ataques de fuerza bruta limitando peticiones.

---

## 🛠️ Stack Tecnológico

* **Runtime:** Node.js
* **Framework:** Express.js
* **Base de Datos:** MongoDB (Mongoose ODM)
* **Infraestructura:** AWS EC2 (Ubuntu), Docker, Nginx.

---

## ⚙️ Instalación y Configuración Local

### Prerrequisitos
* Node.js & NPM
* Docker (Opcional, si quieres correrlo en contenedor)
* MongoDB URI

### 1. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/JOBS_API
JWT_SECRET=tu_secreto_super_seguro
JWT_LIFETIME=30d
PORT=3000

### 2. Variables de Entorno
# Instalar dependencias
npm install

# Iniciar servidor
npm start

### 3. Ejecución con Docker (Modo Producción Local)
# Construir y levantar los servicios (API + Nginx)
docker compose up -d


## Estructura del Proyecto
El proyecto sigue una arquitectura MVC (Model-View-Controller) limpia:

/
├── controllers/      # Lógica de negocio (auth, jobs)
├── db/               # Conexión a Base de Datos (connect.js)
├── errors/           # Clases de errores personalizados (BadRequest, NotFound)
├── middleware/       # Autenticación y Manejo de Errores
├── models/           # Schemas de Mongoose (User, Job)
├── nginx/            # Configuración del Proxy Inverso
├── routes/           # Definición de endpoints
├── app.js            # Punto de entrada de la aplicación
└── docker-compose.yml

## Flujo de CI/CD (GitHub Actions)

El despliegue está 100% automatizado para evitar errores humanos:

Versioning: Se utiliza npm version [patch|minor|major] para generar tags.

Build: Usando git push origin main --tags. Al detectar un nuevo tag (v*), GitHub Actions construye la imagen Docker.

Deploy: Se conecta vía SSH a la instancia EC2.

Healthcheck: El despliegue verifica el endpoint /health. Si la API no responde OK, el deploy falla y alerta, evitando subir código roto a producción.


## Documentación de la API (Swagger)

La documentación interactiva está disponible mediante Swagger UI.

Ruta Local: http://localhost:3000/api-docs

Ejemplo de especificación YAML:


/jobs/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: the job id

## Lógica de Validación y Modelos
User Model & Auth Flow
El sistema utiliza una validación estricta antes de persistir datos:

Validación de Email (Regex):
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
Flujo de Registro:

Validación de campos (Mongoose).

Hashing de contraseña (pre-save hook).

Generación de JWT.

Manejo de Errores Personalizado:

BadRequest: Campos faltantes.

Unauthenticated: Credenciales inválidas.

DuplicateEmail: Error 11000 de Mongoose manejado amigablemente.

CastError: IDs de MongoDB mal formados.