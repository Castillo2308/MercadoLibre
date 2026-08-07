/**
 * email.ts
 *
 * Envío de correos transaccionales (verificación de cuenta, aviso de inicio de sesión)
 * usando Gmail SMTP vía nodemailer. Las credenciales se leen de variables de entorno:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
 *
 * Si las variables no están configuradas, las funciones no lanzan error: solo
 * registran un aviso en consola. Así el registro/login nunca se rompe por un
 * problema de correo.
 */

import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const isEmailConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASSWORD);

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!isEmailConfigured) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });
  }

  return transporter;
}

const BRAND_GREEN = '#1ed760';
const BRAND_DARK = '#061321';

function emailShell(title: string, bodyHtml: string) {
  return `
  <div style="background:${BRAND_DARK};padding:40px 16px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#0c1d31;border:1px solid rgba(255,255,255,0.12);border-radius:16px;overflow:hidden;">
      <div style="padding:28px 32px 0;text-align:center;">
        <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Kivra</div>
      </div>
      <div style="padding:8px 32px 32px;color:#e6edf3;">
        <h1 style="font-size:20px;font-weight:800;color:#ffffff;margin:16px 0 12px;">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.45);font-size:12px;text-align:center;">
        Este es un correo automático de Kivra Marketplace. Si no reconoces esta actividad, ignora este mensaje.
      </div>
    </div>
  </div>`;
}

function codeBlock(code: string) {
  return `
    <div style="text-align:center;margin:20px 0;">
      <div style="display:inline-block;background:rgba(30,215,96,0.1);border:1px solid rgba(30,215,96,0.35);border-radius:12px;padding:14px 28px;">
        <span style="font-size:32px;font-weight:900;letter-spacing:10px;color:${BRAND_GREEN};">${code}</span>
      </div>
    </div>`;
}

export async function sendVerificationEmail(params: {
  to: string;
  firstName: string;
  token: string;
  code: string;
}) {
  const { to, firstName, token, code } = params;
  const t = getTransporter();

  const verifyUrl = `${APP_URL}/api/auth/verify?token=${encodeURIComponent(token)}`;

  if (!t) {
    console.warn('[email] SMTP no configurado — se omite envío de correo de verificación a', to);
    return;
  }

  const html = emailShell(
    `¡Hola ${firstName}! Confirma tu cuenta`,
    `
      <p style="font-size:15px;line-height:1.6;color:rgba(255,255,255,0.8);">
        Gracias por registrarte en Kivra. Usa este código para confirmar tu correo:
      </p>
      ${codeBlock(code)}
      <p style="font-size:13px;color:rgba(255,255,255,0.5);text-align:center;">o si prefieres, con un clic:</p>
      <div style="text-align:center;margin:16px 0 28px;">
        <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(90deg,#1ed760,#13b249);color:#052012;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;">
          Verificar mi cuenta
        </a>
      </div>
      <p style="font-size:13px;color:rgba(255,255,255,0.5);word-break:break-all;">
        Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
        <a href="${verifyUrl}" style="color:${BRAND_GREEN};">${verifyUrl}</a>
      </p>
      <p style="font-size:13px;color:rgba(255,255,255,0.5);">El código y el enlace vencen en 24 horas.</p>
    `
  );

  await t.sendMail({
    from: `"Kivra" <${SMTP_USER}>`,
    to,
    subject: 'Confirma tu cuenta de Kivra',
    html,
  });
}

export async function sendTwoFactorCodeEmail(params: {
  to: string;
  firstName: string;
  code: string;
}) {
  const { to, firstName, code } = params;
  const t = getTransporter();

  if (!t) {
    console.warn('[email] SMTP no configurado — se omite código 2FA a', to);
    return;
  }

  const html = emailShell(
    `Hola ${firstName}, tu código de acceso`,
    `
      <p style="font-size:15px;line-height:1.6;color:rgba(255,255,255,0.8);">
        Usa este código para completar tu inicio de sesión en Kivra:
      </p>
      ${codeBlock(code)}
      <p style="font-size:14px;line-height:1.6;color:rgba(255,255,255,0.65);">
        El código vence en 10 minutos. Si no intentaste iniciar sesión, ignora este correo
        y considera cambiar tu contraseña.
      </p>
    `
  );

  await t.sendMail({
    from: `"Kivra" <${SMTP_USER}>`,
    to,
    subject: 'Tu código de acceso a Kivra',
    html,
  });
}

