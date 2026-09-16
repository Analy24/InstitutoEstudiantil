const db = require('../config/db');
const { getPool, isDatabaseConnected } = require('../config/db');
const mockData = require('../data/mockData');
const bcrypt = require('bcryptjs');
const { enviarCorreo } = require('../services/emailService');
// Generador de contraseñas automáticas seguras para empresas
function generarPasswordEmpresa(nit) {
  const nitClean = (nit || '').replace(/\D/g, '');
  const suffix = nitClean.length >= 4 ? nitClean.slice(-4) : Math.floor(1000 + Math.random() * 9000);
  return `Empresa${suffix}!`;
}

// POST /empresas/solicitar-alianza - Público: Formulario en página principal / login
exports.solicitarAlianza = async (req, res) => {
  const { nit, razon_social, email, sector_economico, direccion, ciudad,
          contacto_nombre, contacto_cargo, contacto_telefono, sitio_web, mensaje_solicitud } = req.body;

  if (!nit || !razon_social || !email || !contacto_nombre || !contacto_telefono) {
    return res.status(400).json({
      success: false,
      message: 'Por favor complete todos los campos obligatorios: Razón Social, NIT, Correo, Nombre y Teléfono del Contacto.'
    });
  }

  try {
    const solicitudId = `sol-${Date.now()}`;

    if (isDatabaseConnected()) {
      const pool = getPool();
      await pool.execute(
        `INSERT INTO solicitudes_alianza (id, nit, razon_social, email, sector_economico, direccion, ciudad, 
          contacto_nombre, contacto_cargo, contacto_telefono, sitio_web, mensaje_solicitud, estado) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDIENTE')`,
        [solicitudId, nit, razon_social, email, sector_economico || '', direccion || '', ciudad || 'Bogotá D.C.',
         contacto_nombre, contacto_cargo || 'Representante', contacto_telefono, sitio_web || '', mensaje_solicitud || '']
      );
    } else {
      mockData.solicitudes_alianza.push({
        id: solicitudId,
        nit,
        razon_social,
        email,
        sector_economico: sector_economico || 'General',
        direccion: direccion || '',
        ciudad: ciudad || 'Bogotá D.C.',
        contacto_nombre,
        contacto_cargo: contacto_cargo || 'Representante Legal',
        contacto_telefono,
        sitio_web: sitio_web || '',
        mensaje_solicitud: mensaje_solicitud || '',
        fecha_solicitud: new Date().toISOString(),
        estado: 'PENDIENTE'
      });
    }

    res.status(201).json({
      success: true,
      message: `¡Solicitud de alianza radicada exitosamente! El Administrador General del Instituto Estudiantil revisará la solicitud para habilitar el acceso a su portal empresarial.`
    });

    // Enviar correo de confirmación de solicitud a la empresa de forma asíncrona
    const htmlBody = `
      <h3>Solicitud Recibida - Instituto Estudiantil</h3>
      <p>Hola <strong>${contacto_nombre}</strong>,</p>
      <p>Hemos recibido correctamente la solicitud de alianza para la empresa <strong>${razon_social}</strong>.</p>
      <p>Actualmente su solicitud se encuentra en estado <strong>PENDIENTE</strong> y será revisada por nuestro equipo administrativo.</p>
      <p>Le notificaremos por este medio cuando haya sido aprobada para entregarle sus credenciales de acceso.</p>
      <br>
      <p>Atentamente,<br>Equipo de Administración</p>
    `;
    enviarCorreo(email, 'Solicitud de Alianza Recibida - Instituto Estudiantil', htmlBody).catch(console.error);

  } catch (err) {
    console.error('[empresaController] solicitarAlianza error:', err);
    res.status(500).json({ success: false, message: 'Error al radicar solicitud de alianza: ' + err.message });
  }
};

// GET /empresas/solicitudes - Listar solicitudes pendientes para el Administrador
exports.getSolicitudesAlianza = async (req, res) => {
  try {
    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute('SELECT * FROM solicitudes_alianza ORDER BY fecha_solicitud DESC');
      res.json({ success: true, data: rows });
    } else {
      res.json({ success: true, data: mockData.solicitudes_alianza || [] });
    }
  } catch (err) {
    console.error('[empresaController] getSolicitudesAlianza error:', err);
    res.status(500).json({ success: false, message: 'Error al obtener solicitudes' });
  }
};

// POST /empresas/solicitudes/:id/aprobar - Admin aprueba la alianza, crea usuario automáticamente y envía notificación por correo
exports.aprobarAlianza = async (req, res) => {
  const { id } = req.params;

  try {
    let solicitud = null;

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute('SELECT * FROM solicitudes_alianza WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
      solicitud = rows[0];
    } else {
      solicitud = mockData.solicitudes_alianza.find(s => s.id === id);
      if (!solicitud) return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
    }

    // Generar contraseña automática única para la empresa
    const passwordGenerada = generarPasswordEmpresa(solicitud.nit);
    const password_hash = await bcrypt.hash(passwordGenerada, 10);
    const userId = `usr-emp-${Date.now()}`;
    const empresaId = `emp-${Date.now()}`;

    if (isDatabaseConnected()) {
      const pool = getPool();

      // Comprobar si el usuario ya existe en la base de datos
      const [userExistente] = await pool.execute('SELECT id FROM usuarios WHERE email = ?', [solicitud.email]);
      
      if (userExistente.length > 0) {
        // Actualizar contraseña y activar
        await pool.execute(
          'UPDATE usuarios SET password_hash = ?, rol = "EMPRESA", activo = 1 WHERE email = ?',
          [password_hash, solicitud.email]
        );
      } else {
        // Crear usuario con rol exclusivo EMPRESA
        await pool.execute(
          'INSERT INTO usuarios (id, email, password_hash, rol, activo) VALUES (?, ?, ?, "EMPRESA", 1)',
          [userId, solicitud.email, password_hash]
        );
      }

      // Guardar en la tabla empresas junto a las demás empresas aliadas
      await pool.execute(
        `INSERT INTO empresas (id, usuario_id, nit, razon_social, sector_economico, direccion, ciudad, 
          contacto_nombre, contacto_cargo, contacto_telefono, sitio_web, verificada, estado_alianza) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'APROBADA')`,
        [empresaId, userId, solicitud.nit, solicitud.razon_social, solicitud.sector_economico,
         solicitud.direccion, solicitud.ciudad, solicitud.contacto_nombre, solicitud.contacto_cargo,
         solicitud.contacto_telefono, solicitud.sitio_web]
      );

      // Actualizar estado de la solicitud a APROBADA
      await pool.execute("UPDATE solicitudes_alianza SET estado = 'APROBADA' WHERE id = ?", [id]);
    } else {
      solicitud.estado = 'APROBADA';

      const userIdx = mockData.usuarios.findIndex(u => u.email.toLowerCase() === solicitud.email.toLowerCase());
      if (userIdx >= 0) {
        mockData.usuarios[userIdx].password_hash = password_hash;
        mockData.usuarios[userIdx].rol = 'EMPRESA';
        mockData.usuarios[userIdx].activo = true;
      } else {
        mockData.usuarios.push({
          id: userId,
          email: solicitud.email,
          password_hash,
          rol: 'EMPRESA',
          activo: true,
          nombre: solicitud.razon_social,
          created_at: new Date().toISOString()
        });
      }

      mockData.empresas.push({
        id: empresaId,
        usuario_id: userId,
        nit: solicitud.nit,
        razon_social: solicitud.razon_social,
        email: solicitud.email,
        sector_economico: solicitud.sector_economico,
        direccion: solicitud.direccion,
        ciudad: solicitud.ciudad,
        contacto_nombre: solicitud.contacto_nombre,
        contacto_cargo: solicitud.contacto_cargo,
        contacto_telefono: solicitud.contacto_telefono,
        sitio_web: solicitud.sitio_web,
        verificada: true,
        estado_alianza: 'APROBADA'
      });
    }

    // Registro y despacho de la notificación de correo
    const emailNotificacion = {
      para: solicitud.email,
      asunto: `¡Bienvenido al Instituto Estudiantil! Acceso a Portal Empresarial - ${solicitud.razon_social}`,
      fecha_envio: new Date().toISOString(),
      contenido: {
        saludo: `Apreciado(a) ${solicitud.contacto_nombre || 'Representante'},`,
        mensaje: `Nos complace informarle que la solicitud de vinculación para "${solicitud.razon_social}" ha sido APROBADA por la Administración General del Instituto Estudiantil.`,
        usuario: solicitud.email,
        password: passwordGenerada,
        rol: 'Empresa Aliada',
        url_acceso: req.headers.origin || 'http://localhost:5173',
        instrucciones: 'Con estas credenciales puede ingresar al sistema, publicar vacantes de etapa práctica y revisar las hojas de vida y calificaciones de los estudiantes de 10° y 11.'
      }
    };

    const htmlBody = `
      <h3>¡Solicitud de Alianza Aprobada!</h3>
      <p>${emailNotificacion.contenido.saludo}</p>
      <p>${emailNotificacion.contenido.mensaje}</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p><strong>Sus credenciales de acceso:</strong></p>
        <p><strong>URL de acceso:</strong> <a href="${emailNotificacion.contenido.url_acceso}">${emailNotificacion.contenido.url_acceso}</a></p>
        <p><strong>Usuario:</strong> ${emailNotificacion.contenido.usuario}</p>
        <p><strong>Contraseña:</strong> ${emailNotificacion.contenido.password}</p>
        <p><strong>Rol:</strong> ${emailNotificacion.contenido.rol}</p>
      </div>
      <p>${emailNotificacion.contenido.instrucciones}</p>
      <br>
      <p>Atentamente,<br>Administración General Instituto Estudiantil</p>
    `;

    // Enviar correo (esperamos resultado para confirmar delivery o test mode)
    let resultadoEnvio = null;
    try {
      resultadoEnvio = await enviarCorreo(solicitud.email, emailNotificacion.asunto, htmlBody);
    } catch (mailErr) {
      console.error('Error al despachar correo a la empresa:', mailErr);
    }

    const fueReal = resultadoEnvio && resultadoEnvio.isRealSMTP;

    res.json({
      success: true,
      message: fueReal
        ? `¡Alianza aprobada exitosamente! El correo de bienvenida y acceso fue enviado directamente a la empresa (${solicitud.email}).`
        : `¡Alianza aprobada exitosamente! Cuenta creada para ${solicitud.email}. Nota: Configura SMTP_USER y SMTP_PASS en el backend/.env para envíos reales directos a Gmail.`,
      data: {
        empresa_id: empresaId,
        razon_social: solicitud.razon_social,
        email: solicitud.email,
        password_generada: passwordGenerada,
        notificacion_correo: emailNotificacion,
        envio_real: fueReal
      }
    });
  } catch (err) {
    console.error('[empresaController] aprobarAlianza error:', err);
    res.status(500).json({ success: false, message: 'Error al aprobar alianza: ' + err.message });
  }
};

// POST /empresas/solicitudes/:id/rechazar - Admin rechaza la solicitud
exports.rechazarAlianza = async (req, res) => {
  const { id } = req.params;
  try {
    if (isDatabaseConnected()) {
      const pool = getPool();
      await pool.execute("UPDATE solicitudes_alianza SET estado = 'RECHAZADA' WHERE id = ?", [id]);
    } else {
      const sol = mockData.solicitudes_alianza.find(s => s.id === id);
      if (sol) sol.estado = 'RECHAZADA';
    }
    res.json({ success: true, message: 'Solicitud de alianza marcada como rechazada.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al rechazar solicitud' });
  }
};

// GET /empresas - listar todas las empresas aliadas
exports.getEmpresas = async (req, res) => {
  try {
    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute(
        `SELECT e.*, u.email, u.activo,
                (SELECT COUNT(*) FROM vacantes v WHERE v.empresa_id = e.id) as total_vacantes,
                (SELECT COUNT(*) FROM postulaciones p JOIN vacantes v ON p.vacante_id = v.id WHERE v.empresa_id = e.id) as total_candidatos
         FROM empresas e 
         JOIN usuarios u ON e.usuario_id = u.id 
         ORDER BY e.razon_social ASC`
      );
      res.json({ success: true, data: rows });
    } else {
      const data = mockData.empresas.map(emp => {
        const vacs = mockData.vacantes.filter(v => v.empresa_id === emp.id);
        const postCount = mockData.postulaciones.filter(p => vacs.some(v => v.id === p.vacante_id)).length;
        return {
          ...emp,
          total_vacantes: vacs.length,
          total_candidatos: postCount
        };
      });
      res.json({ success: true, data });
    }
  } catch (err) {
    console.error('[empresaController] getEmpresas error:', err);
    res.status(500).json({ success: false, message: 'Error al obtener empresas' });
  }
};

// GET /empresas/:id - detalle completo de una empresa (para admin)
exports.getEmpresaDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    let empresa = null;
    let vacantes = [];

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute(
        `SELECT e.*, u.email, u.activo FROM empresas e 
         JOIN usuarios u ON e.usuario_id = u.id 
         WHERE e.id = ?`,
        [id]
      );
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
      empresa = rows[0];

      const [vacRows] = await pool.execute(
        `SELECT v.*, 
                (SELECT COUNT(*) FROM postulaciones p WHERE p.vacante_id = v.id) as postulaciones_count
         FROM vacantes v 
         WHERE v.empresa_id = ?
         ORDER BY v.id DESC`,
        [id]
      );
      vacantes = vacRows;
    } else {
      empresa = mockData.empresas.find(e => e.id === id);
      if (!empresa) return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
      vacantes = mockData.vacantes.filter(v => v.empresa_id === id).map(v => ({
        ...v,
        postulaciones_count: mockData.postulaciones.filter(p => p.vacante_id === v.id).length
      }));
    }

    res.json({
      success: true,
      data: {
        ...empresa,
        vacantes
      }
    });
  } catch (err) {
    console.error('[empresaController] getEmpresaDetalle error:', err);
    res.status(500).json({ success: false, message: 'Error al obtener detalle de la empresa' });
  }
};

// POST /empresas - crear una nueva empresa + usuario directamente (Admin)
exports.crearEmpresa = async (req, res) => {
  const { email, password, nit, razon_social, sector_economico, direccion, ciudad,
          contacto_nombre, contacto_cargo, contacto_telefono, sitio_web } = req.body;

  if (!email || !nit || !razon_social) {
    return res.status(400).json({ success: false, message: 'Faltan campos obligatorios: email, nit, razon_social' });
  }

  const passwordFinal = password || generarPasswordEmpresa(nit);

  try {
    const password_hash = await bcrypt.hash(passwordFinal, 10);
    const userId = `usr-emp-${Date.now()}`;
    const empresaId = `emp-${Date.now()}`;

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [existing] = await pool.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado' });
      }

      await pool.execute(
        'INSERT INTO usuarios (id, email, password_hash, rol, activo) VALUES (?, ?, ?, "EMPRESA", 1)',
        [userId, email, password_hash]
      );

      await pool.execute(
        `INSERT INTO empresas (id, usuario_id, nit, razon_social, sector_economico, direccion, ciudad, 
          contacto_nombre, contacto_cargo, contacto_telefono, sitio_web, verificada, estado_alianza) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'APROBADA')`,
        [empresaId, userId, nit, razon_social, sector_economico || '', direccion || '', ciudad || '',
         contacto_nombre || '', contacto_cargo || '', contacto_telefono || '', sitio_web || '']
      );
    } else {
      const existing = mockData.usuarios.find(u => u.email === email);
      if (existing) {
        return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado' });
      }

      mockData.usuarios.push({
        id: userId,
        email,
        password_hash,
        rol: 'EMPRESA',
        activo: true,
        nombre: razon_social,
        created_at: new Date().toISOString()
      });

      mockData.empresas.push({
        id: empresaId,
        usuario_id: userId,
        nit,
        razon_social,
        email,
        sector_economico: sector_economico || '',
        direccion: direccion || '',
        ciudad: ciudad || '',
        contacto_nombre: contacto_nombre || '',
        contacto_cargo: contacto_cargo || '',
        contacto_telefono: contacto_telefono || '',
        sitio_web: sitio_web || '',
        verificada: true,
        estado_alianza: 'APROBADA'
      });
    }

    res.status(201).json({ 
      success: true, 
      message: `Empresa "${razon_social}" vinculada correctamente. Acceso generado: ${email} | Clave: ${passwordFinal}`,
      data: { id: empresaId, email, razon_social, password_generada: passwordFinal }
    });
  } catch (err) {
    console.error('[empresaController] crearEmpresa error:', err);
    res.status(500).json({ success: false, message: 'Error al registrar la empresa: ' + err.message });
  }
};

// DELETE /empresas/:id - Eliminar empresa, usuario y todos sus registros de la base de datos (Admin)
exports.eliminarEmpresa = async (req, res) => {
  const { id } = req.params;

  try {
    let razonSocial = '';
    let email = '';
    let usuarioId = '';
    let nit = '';

    if (isDatabaseConnected()) {
      const pool = getPool();
      const [rows] = await pool.execute('SELECT e.*, u.email as user_email FROM empresas e JOIN usuarios u ON e.usuario_id = u.id WHERE e.id = ?', [id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'La empresa a eliminar no fue encontrada.' });
      }

      const emp = rows[0];
      razonSocial = emp.razon_social;
      email = emp.user_email || emp.email;
      usuarioId = emp.usuario_id;
      nit = emp.nit;

      // 1. Eliminar postulaciones a vacantes de esta empresa
      await pool.execute(
        'DELETE FROM postulaciones WHERE vacante_id IN (SELECT id FROM vacantes WHERE empresa_id = ?)',
        [id]
      );

      // 2. Eliminar vacantes de esta empresa
      await pool.execute('DELETE FROM vacantes WHERE empresa_id = ?', [id]);

      // 3. Eliminar registro de la empresa
      await pool.execute('DELETE FROM empresas WHERE id = ?', [id]);

      // 4. Eliminar cuenta de usuario
      if (usuarioId) {
        await pool.execute('DELETE FROM usuarios WHERE id = ?', [usuarioId]);
      }
      if (email) {
        await pool.execute('DELETE FROM usuarios WHERE email = ?', [email]);
      }

      // 5. Eliminar solicitudes de alianza vinculadas
      if (nit) {
        await pool.execute('DELETE FROM solicitudes_alianza WHERE nit = ?', [nit]);
      }
    } else {
      const empIdx = mockData.empresas.findIndex(e => e.id === id);
      if (empIdx === -1) {
        return res.status(404).json({ success: false, message: 'La empresa a eliminar no fue encontrada.' });
      }

      const emp = mockData.empresas[empIdx];
      razonSocial = emp.razon_social;
      email = emp.email;
      usuarioId = emp.usuario_id;
      nit = emp.nit;

      // Eliminar empresa
      mockData.empresas.splice(empIdx, 1);

      // Eliminar usuario
      const userIdx = mockData.usuarios.findIndex(u => u.id === usuarioId || u.email === email);
      if (userIdx !== -1) mockData.usuarios.splice(userIdx, 1);

      // Eliminar vacantes y postulaciones
      const vacantesIds = mockData.vacantes.filter(v => v.empresa_id === id).map(v => v.id);
      mockData.vacantes = mockData.vacantes.filter(v => v.empresa_id !== id);
      mockData.postulaciones = mockData.postulaciones.filter(p => !vacantesIds.includes(p.vacante_id));

      // Eliminar de solicitudes
      mockData.solicitudes_alianza = mockData.solicitudes_alianza.filter(s => s.nit !== nit && s.email !== email);
    }

    console.log(`🗑️ [EMPRESA ELIMINADA] Se eliminó "${razonSocial}" (${email}) y todos sus registros de la base de datos.`);

    res.json({
      success: true,
      message: `La empresa "${razonSocial}" y su cuenta de usuario han sido eliminadas por completo del sistema.`
    });
  } catch (err) {
    console.error('[empresaController] eliminarEmpresa error:', err);
    res.status(500).json({ success: false, message: 'Error al eliminar empresa: ' + err.message });
  }
};

// PATCH /empresas/:id/verificar - verificar empresa (admin)
exports.verificarEmpresa = async (req, res) => {
  try {
    if (isDatabaseConnected()) {
      const pool = getPool();
      await pool.execute('UPDATE empresas SET verificada = 1 WHERE id = ?', [req.params.id]);
    } else {
      const emp = mockData.empresas.find(e => e.id === req.params.id);
      if (emp) emp.verificada = true;
    }
    res.json({ success: true, message: 'Empresa verificada correctamente' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al verificar empresa' });
  }
};
