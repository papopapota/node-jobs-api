# 💼 Jobs API

![Node.js](https://img.shields.io/badge/Node.js-v18-green.svg)
![Express](https://img.shields.io/badge/Express.js-Backend-lightgrey.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-orange.svg)
![AWS](https://img.shields.io/badge/Deployment-AWS%20EC2-yellow.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

Jobs API es una **API RESTful** para la gestión de ofertas de trabajo, diseñada con buenas prácticas de backend, seguridad y **DevOps profesional**.  
El proyecto incluye autenticación JWT, documentación con Swagger, despliegue automatizado con Docker y GitHub Actions, y versionado automático basado en Git tags.

---

## 🚀 Características Principales

### 🔐 Autenticación y Seguridad
- Registro y login de usuarios con validación
- Hashing de contraseñas con **bcrypt**
- Autenticación con **JWT (JSON Web Tokens)**
- Protección de rutas privadas con middleware
- Rate limiting contra ataques de fuerza bruta
- Headers de seguridad configurados con Helmet
- Protección contra XSS con xss-clean
- CORS configurado para orígenes específicos

### 🧑‍💼 Gestión de Trabajos (CRUD Completo)
- Crear ofertas de trabajo con validaciones
- Listar trabajos con filtros y paginación
- Actualizar trabajos (solo propietario)
- Eliminar trabajos (solo propietario)
- Validaciones de datos con express-validator
- Control de ownership (usuario solo modifica sus trabajos)

### 🛡️ Seguridad y Robustez
- Middleware de manejo de errores centralizado
- Errores personalizados por tipo (NotFoundError, BadRequestError, etc.)
- Logging estructurado en producción
- Variables de entorno para configuración sensible
- Validación de entrada en todos los endpoints

### 🐳 DevOps y Despliegue
- **Dockerización completa** con multi-stage builds
- **Docker Compose v2** para orquestación local
- **Nginx** como reverse proxy con configuración optimizada
- **GitHub Actions** para CI/CD automatizado
- **Despliegue en AWS EC2** con Ubuntu
- **Healthchecks** automáticos para validación de despliegues
- **Versionado semántico** automatizado con npm version

---

## 📁 Estructura del Proyecto

```
jobs-api/
├── src/
│   ├── controllers/     # Lógica de negocio
│   ├── routes/          # Endpoints de la API
│   ├── models/          # Modelos de Mongoose
│   ├── middleware/      # Auth y manejo de errores
│   ├── errors/          # Errores personalizados
│   └── db/             # Conexión a MongoDB
├── nginx/
│   └── nginx.conf      # Configuración de Nginx
├── docker/
│   └── nginx.conf      # Config para Docker
├── .github/
│   └── workflows/      # GitHub Actions
├── swagger.yaml        # Documentación Swagger
├── app.js             # Entrada principal
├── server.js          # Configuración del servidor
├── docker-compose.yml # Orquestación de servicios
├── Dockerfile         # Configuración Docker
├── package.json
└── .env.example       # Variables de entorno ejemplo
```

---

## ⚙️ Instalación Local

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/jobs-api.git
cd jobs-api
```

### 2️⃣ Configurar variables de entorno
```bash
cp .env.example .env
```
Editar el archivo `.env` con tus valores:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/jobs-api
JWT_SECRET=super_secret_key_cambiar_en_produccion
JWT_LIFETIME=30d
PORT=3000
NODE_ENV=development

```

### 3️⃣ Instalar dependencias
```bash
npm install
```

### 4️⃣ Ejecutar en desarrollo
```bash
npm run dev
```
El servidor se iniciará en `http://localhost:3000`

---

## 🐳 Ejecución con Docker

### Usando Docker Compose (recomendado)
```bash
docker compose up -d
```

### Servicios incluidos:
- **API Node.js** - Puerto 3000
- **Nginx (reverse proxy)** - Puerto 80
- **MongoDB** - Puerto 27017 (si usas MongoDB local)

### Comandos Docker útiles:
```bash
# Ver logs
docker compose logs -f

# Detener servicios
docker compose down

# Reconstruir imágenes
docker compose up -d --build

# Ver estado de contenedores
docker compose ps
```

---

## 📚 Documentación API (Swagger)

La documentación interactiva está disponible en:

### Desarrollo:
```
http://localhost:3000/api/v1/docs
```

### Producción (con Nginx):
```
http://<tu-dominio-o-ip>/api/v1/docs
```

La documentación incluye:
- Todos los endpoints disponibles
- Esquemas de request/response
- Ejemplos de uso
- Posibilidad de probar endpoints directamente

---

## 🔁 Flujo CI/CD

### 🔖 Versionado Semántico
```bash
# Incrementar versión
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.1 → 1.1.0
npm version major   # 1.1.0 → 2.0.0

# Subir cambios y tags
git push origin main
git push origin --tags
```

### ⚙️ Pipeline Automático (GitHub Actions)
1. **Push a main** o **nuevo tag** dispara el pipeline
2. **Tests** - Ejecuta suite de pruebas
3. **Build** - Construye imagen Docker
4. **Push to Registry** - Sube a Docker Hub
5. **Deploy** - Conecta via SSH a AWS EC2
6. **Health Check** - Valida que la API responde
7. **Rollback** - Si falla, revierte al estado anterior

---

## 🩺 Health Check

### Endpoint de salud:
```bash
GET /health
```

### Respuesta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "uptime": "5 days",
  "database": "connected"
}
```

### Verificación manual:
```bash
curl http://localhost:3000/health
```

El health check previene despliegues defectuosos en producción.

---

## 🔐 Endpoints Principales

### 🔑 Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Registro de nuevo usuario |
| POST | `/api/v1/auth/login` | Inicio de sesión (obtiene JWT) |

### 💼 Trabajos (Requieren JWT)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/jobs` | Listar todos los trabajos del usuario |
| GET | `/api/v1/jobs/:id` | Obtener trabajo específico |
| POST | `/api/v1/jobs` | Crear nuevo trabajo |
| PATCH | `/api/v1/jobs/:id` | Actualizar trabajo existente |
| DELETE | `/api/v1/jobs/:id` | Eliminar trabajo |

### 📊 Ejemplo de Request:
```bash
# Obtener trabajos (con JWT)
curl -X GET http://localhost:3000/api/v1/jobs \
  -H "Authorization: Bearer tu_token_jwt_aqui"

# Crear trabajo
curl -X POST http://localhost:3000/api/v1/jobs \
  -H "Authorization: Bearer tu_token_jwt_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Tech Corp",
    "position": "Backend Developer",
    "status": "pending",
    "jobType": "full-time",
    "jobLocation": "Remote"
  }'
```

---

## 📦 Gestión de Versiones en Producción

### Verificar versión desplegada:
```bash
# Ver contenedores en ejecución
docker ps

# Inspeccionar imagen específica
docker inspect <container_id> | grep -A2 "Image"

# Ver logs de despliegue
docker logs <container_id>
```

### Comandos de gestión:
```bash
# Listar todas las imágenes disponibles
docker images

# Ver historial de una imagen
docker history <image_name>

# Limpiar recursos no usados
docker system prune -a
```

### Rollback manual:
```bash
# Si necesitas revertir a versión anterior
docker pull tu-usuario/jobs-api:<version_anterior>
docker stop jobs-api-container
docker run -d --name jobs-api-container \
  -p 3000:3000 \
  tu-usuario/jobs-api:<version_anterior>
```

---

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en watch mode
npm run test:watch
```

---

## 🔧 Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGO_URI` | URI de conexión a MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secreto para firmar JWT | `mi_secreto_super_seguro` |
| `JWT_LIFETIME` | Duración del token JWT | `30d` |
| `PORT` | Puerto de la aplicación | `3000` |
| `NODE_ENV` | Entorno de ejecución | `production` |


---

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/amazing-feature`)
3. Commit de cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

### Convenciones de código:
- Usar ESLint y Prettier configurados
- Escribir tests para nuevas funcionalidades
- Actualizar documentación (README y Swagger)
- Seguir commits convencionales

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Autor

Papopapota - [@papopapota](https://github.com/papopapota)

## 🔗 Enlaces

- [Repositorio](https://github.com/papopapota/jobs-api)
- [Issues](https://github.com/papopapota/jobs-api/issues)
- [Docker Hub](https://hub.docker.com/r/papopapota/jobs-api)

---

*Última actualización: Enero 2025*