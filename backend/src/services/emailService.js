const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = null;
let initPromise = null;
let isRealSMTP = false;

async function initEmailService() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
      const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
      const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
      const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_PASS;

      if (smtpUser && smtpPass) {
        isRealSMTP = true;
        const serviceName = process.env.SMTP_SERVICE || (smtpHost.includes('gmail') ? 'gmail' : undefined);
        
        const transportConfig = serviceName ? {
          service: serviceName,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        } : {
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false
          }
        };

        transporter = nodemailer.createTransport(transportConfig);

        console.log('====================================================');
        console.log(`📧 [EMAIL SERVICE] Servidor de Correo REAL activado (${serviceName || smtpHost})`);
        console.log(`Remitente: ${smtpUser}`);
        console.log('Los correos llegarán directamente a las casillas de correo reales (Gmail, Outlook, etc.).');
        console.log('====================================================');
      } else {
        isRealSMTP = false;
        const testAccount = await nodemailer.createTestAccount();
        
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        console.log('====================================================');
        console.log('📧 [EMAIL SERVICE] Modo de pruebas (Ethereal Sandbox)');
        console.log('⚠️ NOTA: Para recibir correos reales en Gmail, configure SMTP_USER y SMTP_PASS en el archivo backend/.env');
        console.log(`Cuenta Sandbox: ${testAccount.user}`);
        console.log('====================================================');
      }
    } catch (error) {
      console.error('❌ Error inicializando el servicio de correos:', error);
    }
  })();

  return initPromise;
}

// Inicializar de inmediato
initEmailService();

/**
 * Enviar un correo electrónico
 * @param {string} destinatario Email del destinatario
 * @param {string} asunto Asunto del correo
 * @param {string} htmlBody Cuerpo del correo en HTML
 */
async function enviarCorreo(destinatario, asunto, htmlBody) {
  if (!transporter) {
    await initEmailService();
  }

  if (!transporter) {
    console.error('❌ El servicio de correo no se pudo inicializar.');
    return null;
  }

  const senderUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
  const fromHeader = senderUser 
    ? `"Instituto Estudiantil" <${senderUser}>`
    : '"Instituto Estudiantil" <no-reply@instituto.edu.co>';

  try {
    const info = await transporter.sendMail({
      from: fromHeader,
      to: destinatario, 
      subject: asunto, 
      html: htmlBody,
    });

    console.log('====================================================');
    console.log('📧 [CORREO ENVIADO CON ÉXITO]');
    console.log('Para:', destinatario);
    console.log('Asunto:', asunto);
    console.log('Modo:', isRealSMTP ? 'REAL (Entregado al servidor de correo)' : 'PRUEBA (Ethereal)');
    console.log('Message ID:', info.messageId);
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Preview URL (Ethereal):', previewUrl);
    }
    console.log('====================================================');
    
    return {
      sent: true,
      messageId: info.messageId,
      isRealSMTP,
      previewUrl: previewUrl || null
    };
  } catch (error) {
    console.error(`❌ Error enviando correo a ${destinatario}:`, error.message);
    throw error;
  }
}

module.exports = {
  enviarCorreo,
  initEmailService
};

