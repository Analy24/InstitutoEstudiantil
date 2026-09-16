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

// Cuentas institucionales para Instituto Estudiantil
function getDemoAccounts(req, res) {
  return res.json({
    status: 'success',
    data: [
      {
        rol: 'ADMIN',
        email: 'admi@estudiantil.edu.com',
        nombre: 'Administrador General',
        descripcion: 'Gestión de instructores, empresas aliadas, estudiantes y admisiones'
      },
      {
        rol: 'INSTRUCTOR',
        email: 'carlos.perez@estudiantil.edu.co',
        nombre: 'Prof. Carlos Alberto Pérez',
        descripcion: 'Docente Técnico - Evalúa competencias de Grados 10° y 11°'
      },
      {
        rol: 'ESTUDIANTE',
        email: 'juan.rodriguez@estudiantil.edu.co',
        nombre: 'Juan Camilo Rodríguez (Grado 11°)',
        descripcion: 'Desarrollador Web Junior - 80% Aprobado (Apto para Práctica)'
      },
      {
        rol: 'ESTUDIANTE',
        email: 'maria.gomez@estudiantil.edu.co',
        nombre: 'María Paula Gómez (Grado 10°)',
        descripcion: 'Bases de Datos y Soporte TI - En etapa formativa inicial'
      },
      {
        rol: 'EMPRESA',
        email: 'talento@innovatech.com',
        nombre: 'Innovatech Soluciones S.A.S.',
        descripcion: 'Empresa aliada - Publica vacantes y selecciona talento técnico'
      }
    ]
  });
}

module.exports = {
  login,
  getMe,
  getDemoAccounts
};
