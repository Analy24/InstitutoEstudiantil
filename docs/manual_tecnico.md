# Manual Técnico - ArticulApp (Instituto Estudiantil)

**Versión:** 1.0.0
**Fecha:** Septiembre 2026
**Proyecto:** Sistema de Gestión y Articulación con la Educación Media Técnica

---

## 1. Introducción y Arquitectura

ArticulApp es un sistema de gestión diseñado para articular el talento de la Educación Media Técnica (grados 10° y 11°) con las oportunidades productivas empresariales.

El sistema se basa en una **Arquitectura Cliente-Servidor Desacoplada** de tres niveles lógicos (*Three-Tier Architecture*):

1.  **Frontend (Cliente):** Aplicación de Página Única (SPA) desarrollada con **React.js** y **Vite**, estilizada con CSS y Tailwind. Se comunica con el backend a través de peticiones HTTP/JSON aseguradas con JWT.
2.  **Backend (Servidor):** API RESTful desarrollada con **Node.js** y **Express**. Maneja la lógica de negocio, validaciones, seguridad (CORS, Helmet, Rate Limiting, RBAC) e interacción con la persistencia.
3.  **Persistencia (Base de Datos):** La especificación define un motor relacional **MySQL 8.x (InnoDB)**. *Nota:* Durante el desarrollo local, es posible que el entorno se esté emulando usando SQLite (`database.sqlite`) para mayor agilidad, pero el despliegue requiere un motor transaccional completo como MySQL o MariaDB.

---

## 2. Requisitos del Sistema

Para ejecutar el proyecto en un entorno de desarrollo, asegúrese de cumplir con los siguientes requisitos:

- **Sistema Operativo:** Windows, macOS o Linux.
- **Entorno de Ejecución:** Node.js (v18 o superior recomendado, versión LTS actual).
- **Gestor de Paquetes:** npm (incluido con Node.js).
- **Base de Datos:**
  - Servidor MySQL 8.x corriendo en el puerto 3306.
  - (Opcional para desarrollo ultra-ligero) Soporte para SQLite si está configurado en el archivo `.env`.
- **Navegador Web:** Chrome, Firefox, Edge o Safari (versiones recientes).

---

## 3. Estructura del Proyecto

El repositorio principal está dividido en directorios clave:

```text
ArticulApp/
├── backend/            # Lógica del servidor (API REST)
│   ├── .env            # Variables de entorno
│   ├── src/            # Código fuente (Rutas, Controladores, Servicios, Modelos)
│   ├── uploads/        # Archivos estáticos subidos (Ej: Hojas de vida en PDF)
│   ├── package.json    # Dependencias del backend
│   └── database.sqlite # Archivo de base de datos SQLite (entorno dev)
├── frontend/           # Aplicación cliente web
│   ├── public/         # Recursos estáticos (imágenes, iconos)
│   ├── src/            # Código fuente (Componentes, Contexts, Hooks, Vistas)
│   ├── vite.config.js  # Configuración del empaquetador Vite
│   └── package.json    # Dependencias del frontend
├── docs/               # Documentación del proyecto y especificaciones
└── INICIAR_SISTEMA.bat # Script de acceso rápido para Windows
```

---

## 4. Guía de Despliegue Local (Instalación)

### Paso 1: Clonar y Preparar
Abra una terminal y navegue hasta el directorio del proyecto `ArticulApp`.

### Paso 2: Configurar el Backend
1. Navegue al directorio backend: `cd backend`
2. Instale las dependencias: `npm install`
3. Configure el archivo `.env` tomando como base `.env.example` (si existe). Asegúrese de definir `JWT_SECRET` y las credenciales de conexión a la base de datos (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).
4. (Opcional) Ejecute las migraciones de la base de datos si utiliza un ORM o scripts de inicialización SQL.
5. Inicie el servidor en modo desarrollo: `npm run dev` (por defecto se expondrá en el puerto 3000 u 8080).

### Paso 3: Configurar el Frontend
1. Abra una **nueva pestaña/ventana** de terminal.
2. Navegue al directorio frontend: `cd ../frontend`
3. Instale las dependencias: `npm install`
4. Asegúrese de que el frontend esté apuntando a la URL correcta del backend (generalmente en un archivo `.env` en el frontend, como `VITE_API_URL=http://localhost:3000`).
5. Inicie el servidor de desarrollo Vite: `npm run dev` (generalmente expuesto en `http://localhost:5173`).

### Alternativa en Windows
Puede usar el archivo `INICIAR_SISTEMA.bat` ubicado en la raíz para arrancar ambos servicios automáticamente.

---

## 5. Modelo de Base de Datos (Esquema Principal)

El sistema maneja entidades fuertemente tipadas y relacionales:

- **USUARIO:** Entidad central de autenticación y autorización (`rol: ADMIN, INSTRUCTOR, ESTUDIANTE, EMPRESA`).
- **PERFILES:** Especializaciones 1:1 con el USUARIO (`INSTRUCTOR`, `ESTUDIANTE`, `EMPRESA`).
- **COLEGIO:** Instituciones articuladas. Posee una relación 1:N con Estudiantes y N:M con Instructores.
- **COMPETENCIA:** Catálogo oficial (RAPs).
- **ESTUDIANTE_COMPETENCIA:** Tabla pivote crucial (N:M). Almacena el juicio evaluativo (`APROBADO`, `EN_PROCESO`, `NO_APROBADO`), observaciones y firmas del instructor.
- **VACANTE & POSTULACION:** Módulos de empleo. Empresas publican vacantes; estudiantes aplican (validando >70% de competencias aprobadas).

Consulte el archivo `docs/especificacion_tecnica_instituto_estudiantil.md` para visualizar el Diagrama Entidad-Relación completo en formato Mermaid.

---

## 6. Referencia de API (RESTful Endpoints)

Todas las rutas están prefijadas con `/api/v1`. La API responde en formato JSON (JSend estándar) y requiere un header de autorización: `Authorization: Bearer <token>` para rutas protegidas.

### Autenticación
- `POST /auth/login`: Inicia sesión y retorna JWT.
- `POST /auth/register-empresa`: Registro público para empresas.
- `GET /auth/me`: Retorna los datos de la sesión actual.

### Usuarios (Requiere Admin)
- `GET /users`: Listado general con filtros.
- `PATCH /users/:id/estado`: Activa/Desactiva cuentas.

### Articulación
- `GET /colegios`: Listado de colegios.
- `GET /colegios/:id/estudiantes`: Alumnos matriculados en grados 10/11.

### Competencias (Evaluación)
- `GET /competencias`: Catálogo de la especialidad.
- `PUT /evaluacion/calificar-individual`: Asienta el juicio de un alumno.
- `POST /evaluacion/calificar-masivo`: Califica una ficha completa.

### Estudiantes (Perfil)
- `GET /estudiantes/mi-perfil`: Datos del portafolio.
- `PUT /estudiantes/mi-perfil`: Modificación de biografía y contacto.

### Vacantes
- `POST /vacantes`: (Rol Empresa) Pública oportunidad de práctica.
- `POST /vacantes/:id/postularme`: (Rol Estudiante) Aplica a una vacante.
- `PATCH /postulaciones/:id/estado`: (Rol Empresa) Avanza o rechaza a un candidato.
