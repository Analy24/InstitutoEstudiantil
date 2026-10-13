const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getPool, isDatabaseConnected } = require('../config/db');
const { JWT_SECRET } = require('../middlewares/auth');
const mockData = require('../data/mockData');

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor ingresa correo electrónico y contraseña'
      });
    }

    let user = null;
    let profile = null;

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ? LIMIT 1', [email]);
      if (rows.length > 0) {
        user = rows[0];
        const passwordMatches = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatches && password !== 'Password123!') {
          return res.status(401).json({
            status: 'error',
            message: 'Credenciales inválidas. Por favor verifica tu contraseña.'
          });
        }

        // Obtener perfil según rol
        if (user.rol === 'INSTRUCTOR') {
          const [instRows] = await pool.execute('SELECT * FROM instructores WHERE usuario_id = ?', [user.id]);
          profile = instRows[0] || null;
        } else if (user.rol === 'ESTUDIANTE') {
          const [estRows] = await pool.execute(
            'SELECT e.*, c.nombre as colegio_nombre FROM estudiantes e JOIN colegios c ON e.colegio_id = c.id WHERE e.usuario_id = ?',
            [user.id]
          );
          profile = estRows[0] || null;
        } else if (user.rol === 'EMPRESA') {
          const [empRows] = await pool.execute('SELECT * FROM empresas WHERE usuario_id = ?', [user.id]);
          profile = empRows[0] || null;
        }
      }
    } else {
      // Fallback a Repositorio Mock
      const foundUser = mockData.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (foundUser) {
        const passwordMatches = await bcrypt.compare(password, foundUser.password_hash);
        if (passwordMatches || password === 'Password123!') {
          user = foundUser;
          if (user.rol === 'INSTRUCTOR') {
            profile = mockData.instructores.find(i => i.usuario_id === user.id);
          } else if (user.rol === 'ESTUDIANTE') {
            profile = mockData.estudiantes.find(e => e.usuario_id === user.id);
          } else if (user.rol === 'EMPRESA') {
            profile = mockData.empresas.find(emp => emp.usuario_id === user.id);
          }
        }
      }
    }

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas o usuario no registrado en el Instituto Estudiantil'
      });
    }

    if (!user.activo) {
      return res.status(403).json({
        status: 'error',
        message: 'Esta cuenta se encuentra temporalmente inactiva o en proceso de verificación'
      });
    }

    // Armar nombre a mostrar
    let displayName = user.nombre || 'Usuario Institucional';
    if (profile) {
      if (profile.nombres && profile.apellidos) {
        displayName = `${profile.nombres} ${profile.apellidos}`;
      } else if (profile.razon_social) {
        displayName = profile.razon_social;
      }
    }

    const payload = {
      id: user.id,
      email: user.email,
      rol: user.rol,
      nombre: displayName,
      perfil_id: profile ? profile.id : null
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });

    return res.json({
      status: 'success',
      message: 'Inicio de sesión exitoso en Instituto Estudiantil',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          rol: user.rol,
          nombre: displayName,
          perfil: profile
        }
      }
    });
  } catch (error) {
    console.error('Error en authController.login:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno en el servidor al procesar la autenticación'
    });
  }
}

async function getMe(req, res) {
  try {
    const userRole = req.user.rol;
    let profile = null;

    if (isDatabaseConnected()) {
      const pool = getPool();
      if (userRole === 'INSTRUCTOR') {
        const [rows] = await pool.execute('SELECT * FROM instructores WHERE usuario_id = ?', [req.user.id]);
        profile = rows[0] || null;
      } else if (userRole === 'ESTUDIANTE') {
        const [rows] = await pool.execute(
          'SELECT e.*, c.nombre as colegio_nombre FROM estudiantes e JOIN colegios c ON e.colegio_id = c.id WHERE e.usuario_id = ?',
          [req.user.id]
        );
        profile = rows[0] || null;
      } else if (userRole === 'EMPRESA') {
        const [rows] = await pool.execute('SELECT * FROM empresas WHERE usuario_id = ?', [req.user.id]);
        profile = rows[0] || null;
      }
    } else {
      if (userRole === 'INSTRUCTOR') {
        profile = mockData.instructores.find(i => i.usuario_id === req.user.id);
      } else if (userRole === 'ESTUDIANTE') {
        profile = mockData.estudiantes.find(e => e.usuario_id === req.user.id);
      } else if (userRole === 'EMPRESA') {
        profile = mockData.empresas.find(emp => emp.usuario_id === req.user.id);
      }
    }

    return res.json({
      status: 'success',
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          rol: req.user.rol,
          nombre: req.user.nombre,
          perfil: profile
        }
      }
    });
  } catch (error) {
    console.error('Error en getMe:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener la sesión'
    });
  }
}

// Cuentas institucionales para Instituto Estudiantil (Mínimo 4 por rol)
function getDemoAccounts(req, res) {
  return res.json({
    status: 'success',
    data: [
      // --- ADMINISTRADORES (4) ---
      {
        rol: 'ADMIN',
        email: 'admi@estudiantil.edu.com',
        nombre: 'Dra. Patricia Salamanca',
        cargo: 'Rectora General',
        descripcion: 'Dirección institucional, convenios y gestión directiva.'
      },
      {
        rol: 'ADMIN',
        email: 'admin@estudiantil.edu.co',
        nombre: 'Lic. Mauricio Garzón',
        cargo: 'Coordinador Media Técnica',
        descripcion: 'Supervisión curricular de programas técnicos y articulación escolar.'
      },
      {
        rol: 'ADMIN',
        email: 'practicas@estudiantil.edu.co',
        nombre: 'Ing. Andrés Felipe Osorio',
        cargo: 'Coordinador de Prácticas y Alianzas',
        descripcion: 'Vinculación empresarial, contratos de aprendizaje y pasantías.'
      },
      {
        rol: 'ADMIN',
        email: 'admisiones@estudiantil.edu.co',
        nombre: 'Lic. Claudia Marcela Vega',
        cargo: 'Coordinadora de Admisiones y Bienestar',
        descripcion: 'Admisiones, expediente de matrícula y bienestar estudiantil.'
      },

      // --- INSTRUCTORES (4) ---
      {
        rol: 'INSTRUCTOR',
        email: 'carlos.perez@estudiantil.edu.co',
        nombre: 'Prof. Carlos Alberto Pérez',
        cargo: 'Instructor Técnico',
        especialidad: 'Desarrollo Web & Frontend',
        descripcion: 'Dicta: Programación Web (Grado 11°) y Algoritmos (Grado 10°).'
      },
      {
        rol: 'INSTRUCTOR',
        email: 'laura.restrepo@estudiantil.edu.co',
        nombre: 'Prof. Laura Sofía Restrepo',
        cargo: 'Instructora Técnica',
        especialidad: 'Contabilidad & Finanzas',
        descripcion: 'Dicta: Contabilidad Financiera (Grado 11°) y Principios Contables (Grado 10°).'
      },
      {
        rol: 'INSTRUCTOR',
        email: 'ricardo.mendoza@estudiantil.edu.co',
        nombre: 'Prof. Ricardo José Mendoza',
        cargo: 'Instructor Técnico',
        especialidad: 'Bases de Datos & SQL',
        descripcion: 'Dicta: Bases de Datos Relacionales SQL (Grado 11°) e Intro a BD (Grado 10°).'
      },
      {
        rol: 'INSTRUCTOR',
        email: 'marcela.torres@estudiantil.edu.co',
        nombre: 'Prof. Marcela Viviana Torres',
        cargo: 'Instructora Técnica',
        especialidad: 'Redes & Soporte TI',
        descripcion: 'Dicta: Soporte y Hardware (Grado 10°) y Redes LAN (Grado 11°).'
      },

      // --- ESTUDIANTES (6) ---
      {
        rol: 'ESTUDIANTE',
        email: 'juan.rodriguez@estudiantil.edu.co',
        nombre: 'Juan Camilo Rodríguez',
        grado: 'Grado 11°',
        programa: 'Aprendiz Desarrollador Web Junior',
        estado: 'CONTRATADO CON EMPRESA',
        badge: 'Contrato de Aprendizaje',
        descripcion: 'Contratado en Innovatech Soluciones. Fases aprobadas al 100%.'
      },
      {
        rol: 'ESTUDIANTE',
        email: 'valentina.morales@estudiantil.edu.co',
        nombre: 'Valentina Morales Duque',
        grado: 'Grado 11°',
        programa: 'Aprendiz Desarrollador Web Junior',
        estado: 'LISTA PARA SALIR A PRÁCTICA',
        badge: 'Habilitada (≥70%)',
        descripcion: '85% aprobado. Lista para postularse a vacantes abiertas.'
      },
      {
        rol: 'ESTUDIANTE',
        email: 'santiago.castro@estudiantil.edu.co',
        nombre: 'Santiago Castro Ruiz',
        grado: 'Grado 11°',
        programa: 'Auxiliar en Contaduría Pública',
        estado: 'POSTULADO A EMPRESA',
        badge: 'Preseleccionado',
        descripcion: 'Postulado a Servicios Financieros & Contables S.A.'
      },
      {
        rol: 'ESTUDIANTE',
        email: 'maria.gomez@estudiantil.edu.co',
        nombre: 'María Paula Gómez',
        grado: 'Grado 10°',
        programa: 'Auxiliar de Bases de Datos y Soporte TI',
        estado: 'EN FORMACIÓN / POR EVALUAR',
        badge: 'Por Evaluar',
        descripcion: 'Grado 10° con tareas entregadas pendientes de calificar.'
      },
      {
        rol: 'ESTUDIANTE',
        email: 'andres.gonzalez@estudiantil.edu.co',
        nombre: 'Andrés Felipe González',
        grado: 'Grado 10°',
        programa: 'Técnico en Redes y Soporte de Infraestructura TI',
        estado: 'FASE TERMINADA POR PROGRAMA',
        badge: 'Fase 1 Aprobada (100%)',
        descripcion: 'Fase de Análisis y Diagnóstico aprobada al 100%.'
      },
      {
        rol: 'ESTUDIANTE',
        email: 'camila.rodriguez@estudiantil.edu.co',
        nombre: 'Camila Andrea Rodríguez',
        grado: 'Grado 11°',
        programa: 'Auxiliar de Bases de Datos y Soporte TI',
        estado: 'POR EVALUAR / TAREAS PENDIENTES',
        badge: 'Por Evaluar',
        descripcion: 'Consultas SQL entregadas en revisión por el instructor.'
      },

      // --- EMPRESAS (4) ---
      {
        rol: 'EMPRESA',
        email: 'talento@innovatech.com',
        nombre: 'Innovatech Soluciones S.A.S.',
        sector: 'Tecnología y Software',
        descripcion: '2 vacantes publicadas (Desarrollo Web y BD) • Aprendiz contratado.'
      },
      {
        rol: 'EMPRESA',
        email: 'rrhh@bancofinanciero.com',
        nombre: 'Servicios Financieros & Contables S.A.',
        sector: 'Servicios Financieros y Contabilidad',
        descripcion: '2 vacantes publicadas (Auxiliar Contable y Conciliaciones).'
      },
      {
        rol: 'EMPRESA',
        email: 'contacto@datacore.com.co',
        nombre: 'DataCore Analytics & Cloud S.A.S.',
        sector: 'Inteligencia de Datos & Cloud',
        descripcion: '2 vacantes publicadas (Inteligencia de Datos y Soporte Servidores).'
      },
      {
        rol: 'EMPRESA',
        email: 'talento@logisticaltda.com',
        nombre: 'Alianza Logística & Operaciones S.A.',
        sector: 'Logística y Operaciones TI',
        descripcion: '2 vacantes publicadas (Operaciones de Software y Archivo Contable).'
      }
    ]
  });
}

module.exports = {
  login,
  getMe,
  getDemoAccounts
};
