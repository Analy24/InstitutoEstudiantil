# Plan de Implementación: Desarrollo Integral de SENA Conecta (Stack: React + Node/Express + MySQL)

Desarrollo del sistema web "SENA Conecta" para la articulación de la educación media técnica (grados 10° y 11°) con el SENA y el sector empresarial. El sistema implementará una arquitectura cliente-servidor desacoplada con backend en Node.js + Express, frontend en React.js, persistencia en **MySQL** (compatible con XAMPP / phpMyAdmin / MySQL Workbench / Cloud) y autenticación JWT con control de acceso basado en roles (RBAC).

## Decisiones Técnicas Confirmadas por el Usuario

> [!NOTE]
> **Base de Datos: MySQL**:
> - Se utilizará el driver de alto rendimiento `mysql2/promise` para Node.js con connection pool.
> - Se proveerán scripts DDL (`database/schema_mysql.sql`) y DML (`database/seed_mysql.sql`) completamente compatibles con MySQL 8.x / MariaDB, motor InnoDB, `utf8mb4` y restricciones referenciales.
> - El backend incluirá una capa adaptadora que conectará a MySQL mediante variables en `.env`, y en caso de que el servicio local esté temporalmente detenido, contará con un almacén simulado de respaldo para pruebas inmediatas.

> [!IMPORTANT]
> **Habilitación de Node.js:** Se instalará Node.js LTS en la máquina a través de `winget` para inicializar los entornos de backend y frontend.

---

## Open Questions

1. **Gestión del Entorno de Base de Datos:** ¿Cuentas con una instancia local de PostgreSQL (e.g. pgAdmin / puerto 5432) o prefieres utilizar una base de datos gratuita en la nube (como Supabase o Neon / Render Postgres) mediante una URL de conexión en el archivo `.env`?
2. **Estilo del Frontend:** ¿Prefieres el uso de Tailwind CSS o Vanilla CSS modular con un sistema de diseño propio basado en tokens de diseño SENA (verde `#39A900`, azul oscuro `#00324D` y escala de grises moderna)?

---

## Proposed Changes

La estructura del proyecto se organizará en un esquema monorepo limpio y ordenado dentro de `c:\Users\ADMIN\Documents\SENA ADSI\Proyectos\ArticulApp`:

```
ArticulApp/
├── backend/                  # API REST Node.js + Express
│   ├── src/
│   │   ├── config/          # Variables de entorno y DB pool
│   │   ├── controllers/     # Controladores por módulo
│   │   ├── middlewares/     # JWT Auth, RBAC, Validaciones
│   │   ├── routes/          # Enrutadores Express
│   │   ├── services/        # Reglas de negocio SENA
│   │   └── server.js        # Entry point del servidor
│   └── package.json
├── frontend/                 # Aplicación Web React (Vite)
│   ├── src/
│   │   ├── components/      # Componentes UI reutilizables
│   │   ├── context/         # AuthContext y estado global
│   │   ├── pages/           # Vistas (Login, Instructor, Estudiante, Empresa)
│   │   ├── services/        # Cliente API Axios
│   │   └── App.jsx
│   └── package.json
├── database/                 # Scripts DDL y Seeds
│   ├── schema.sql           # Tablas, llaves primarias/foráneas e índices
│   └── seed.sql             # Datos de prueba (colegios, aprendices, competencias)
└── docs/                     # Documentación técnica generada
```

---

### Componente: Base de Datos (`database/`)

#### [NEW] [schema_mysql.sql](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/database/schema_mysql.sql)
- Definición DDL compatible con MySQL 8.x / MariaDB: tablas `usuarios`, `colegios`, `instructores`, `estudiantes`, `competencias`, `estudiante_competencias`, `empresas`, `vacantes`, `postulaciones` y `reportes`.
- Llaves foráneas con motor `ENGINE=InnoDB` y `ON DELETE CASCADE` / `RESTRICT`.
- Restricciones de unicidad (`UNIQUE KEY`) para DANE, NIT, número de documento y relaciones compuestas.
- Índices (`INDEX`) optimizados en campos de búsqueda frecuente (`ficha_sena`, `email`, `rol`, `colegio_id`).

#### [NEW] [seed_mysql.sql](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/database/seed_mysql.sql)
- Inserción de usuarios semilla con contraseñas hasheadas para cada rol:
  - Administrador: `admin@senaconecta.edu.co`
  - Instructor: `instructor.perez@misena.edu.co`
  - Estudiante 1 (Apto práctica): `carlos.mora@colegio.edu.co` (Grado 11°)
  - Estudiante 2 (En formación): `laura.gomez@colegio.edu.co` (Grado 10°)
  - Empresa: `talento@innovatech.com`
- Catálogo oficial de competencias SENA del programa Técnico en Programación de Software / ADSO.
- Institución educativa articulada de prueba, postulaciones y vacante activa con auxilio de sostenimiento.

---

### Componente: Backend API REST (`backend/`)

#### [NEW] [package.json](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/backend/package.json)
- Dependencias principales: `express`, `mysql2`, `bcryptjs`, `jsonwebtoken`, `cors`, `helmet`, `dotenv`.
- Dependencias de desarrollo: `nodemon`.

#### [NEW] [src/config/db.js](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/backend/src/config/db.js)
- Configuración del pool de conexiones MySQL (`mysql.createPool`) con soporte para variables de entorno (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
- Mecanismo de fallback automático: Si el servidor MySQL local no está levantado, el backend informa y activa el repositorio simulado para permitir desarrollo y testing continuo del frontend sin interrupciones.

#### [NEW] [src/middlewares/auth.js](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/backend/src/middlewares/auth.js)
- Middleware de verificación de token JWT (`authenticateToken`).
- Middleware de autorización por rol (`authorizeRoles('INSTRUCTOR', 'ADMIN')`).

#### [NEW] [src/controllers/authController.js](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/backend/src/controllers/authController.js)
- Lógica de inicio de sesión, verificación de hash con bcrypt y emisión de token JWT con payload `{ id, email, rol, perfil }`.

#### [NEW] [src/controllers/competenciaController.js](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/backend/src/controllers/competenciaController.js)
- Consulta de catálogo curricular.
- Calificación individual y masiva con validación obligatoria de observaciones pedagógicas en juicio `NO_APROBADO`.
- Matriz de semaforización de la ficha.

#### [NEW] [src/controllers/vacanteController.js](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/backend/src/controllers/vacanteController.js)
- Creación y listado de ofertas de etapa práctica.
- Lógica de postulación con validación de la regla de negocio SENA: requiere $\ge 70\%$ de avance en competencias técnicas aprobadas.

#### [NEW] [src/server.js](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/backend/src/server.js)
- Inicialización de Express con middlewares de seguridad, CORS y rutas `/api/v1/...`.

---

### Componente: Frontend Web App (`frontend/`)

#### [NEW] [package.json](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/frontend/package.json)
- Dependencias: `react`, `react-dom`, `lucide-react` (iconografía profesional), herramientas de desarrollo Vite.

#### [NEW] [src/index.css](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/frontend/src/index.css)
- Sistema de diseño moderno con paleta institucional SENA:
  - Verde primario: `#39A900`
  - Azul institucional: `#00324D`
  - Superficies de tarjetas con microinteracciones y diseño 100% responsivo para móviles y escritorio.

#### [NEW] [src/context/AuthContext.jsx](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/frontend/src/context/AuthContext.jsx)
- Proveedor de estado de autenticación, almacenamiento del token y cambio dinámico de rol (para facilitar demostraciones con un solo clic).

#### [NEW] [src/pages/LoginPage.jsx](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/frontend/src/pages/LoginPage.jsx)
- Pantalla de acceso unificado con selector rápido de usuarios de prueba (Admin, Instructor, Estudiante, Empresa) para agilizar la evaluación y defensa del proyecto formativo.

#### [NEW] [src/pages/InstructorDashboard.jsx](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/frontend/src/pages/InstructorDashboard.jsx)
- Vista de matriz de evaluación de competencias por ficha, semáforo de aprobación y emisión de juicios.

#### [NEW] [src/pages/StudentProfile.jsx](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/frontend/src/pages/StudentProfile.jsx)
- Portafolio digital del estudiante con insignias de competencias aprobadas, barra de progreso hacia etapa práctica y vacantes disponibles.

#### [NEW] [src/pages/CompanyDashboard.jsx](file:///c:/Users/ADMIN/Documents/SENA%20ADSI/Proyectos/ArticulApp/frontend/src/pages/CompanyDashboard.jsx)
- Gestión de ofertas, radar de talento y visualización de candidatos postulados con estado en el proceso de selección.

---

## Verification Plan

### Automated Tests
- Verificación de sintaxis y tipado en endpoints mediante tests de integración con script de prueba HTTP / curl.
- Script de verificación de inicialización del servidor: `npm run test:api` o script `node test-api.js` que valide los códigos de estado `200`, `401` y `403`.

### Manual Verification
1. **Flujo de Autenticación:**
   - Iniciar sesión como Instructor (`instructor.perez@misena.edu.co`).
   - Validar redirección inmediata al Dashboard de Evaluación.
2. **Flujo de Calificación de Competencias:**
   - Asignar juicio "Aprobado" a un estudiante y verificar actualización de porcentaje en tiempo real.
   - Intentar guardar "No Aprobado" sin observaciones y comprobar que la validación bloquea la acción.
3. **Flujo de Postulación a Vacantes:**
   - Iniciar sesión como Estudiante con $< 70\%$ de avance e intentar postularse a una vacante (debe mostrar bloqueo pedagógico).
   - Iniciar sesión como Estudiante con $\ge 70\%$ de avance y completar la postulación con éxito.
4. **Flujo de Empresa:**
   - Ingresar como Empresa y verificar la visualización del candidato postulado con sus competencias SENA avaladas.
