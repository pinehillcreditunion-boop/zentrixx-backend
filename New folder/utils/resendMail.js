const axios = require('axios');

const RESEND_API_URL = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'zentrixx@zentrixx.cloud';

function getAddress(value) {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (value.Email) return value.Name ? `${value.Name} <${value.Email}>` : value.Email;
  return undefined;
}

function mapMessage(message) {
  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  const to = (message.To || []).map(getAddress).filter(Boolean);
  const cc = (message.Cc || []).map(getAddress).filter(Boolean);
  const bcc = (message.Bcc || []).map(getAddress).filter(Boolean);
  if (!to.length) throw new Error('Resend email requires at least one recipient.');
  if (!message.Subject) throw new Error('Resend email requires a subject.');
  const payload = { from, to, subject: message.Subject };
  if (message.TextPart) payload.text = message.TextPart;
  if (message.HTMLPart) payload.html = message.HTMLPart;
  if (cc.length) payload.cc = cc;
  if (bcc.length) payload.bcc = bcc;
  if (message.ReplyTo) payload.reply_to = getAddress(message.ReplyTo);
  return payload;
}

module.exports = {
  apiConnect() {
    return {
      post() {
        return {
          async request(body) {
            const apiKey = process.env.RESEND_API_KEY || process.env.RESEND;
            if (!apiKey) throw new Error('Missing Resend API key. Set RESEND_API_KEY in your backend .env file.');
            const messages = body && Array.isArray(body.Messages) ? body.Messages : [];
            if (!messages.length) throw new Error('No email messages were supplied to Resend.');
            const results = [];
            for (const message of messages) {
              const response = await axios.post(RESEND_API_URL, mapMessage(message), {
                headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                timeout: 20000,
              });
              results.push({ Status: 'success', ResendId: response.data.id });
            }
            return { Messages: results };
          },
        };
      },
    };
  },
};
