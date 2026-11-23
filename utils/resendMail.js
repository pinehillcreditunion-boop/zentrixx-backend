const { Resend } = require('resend');

// One Resend client is shared by all email operations through this adapter.
const resend = new Resend(
  process.env.RESEND_API_KEY || process.env.RESEND
);

const DEFAULT_FROM = 'zentrixx@zentrixx.cloud';

function getAddress(value) {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (value.Email) {
    return value.Name ? `${value.Name} <${value.Email}>` : value.Email;
  }
  return undefined;
}

function mapMessage(message) {
  const to = (message.To || []).map(getAddress).filter(Boolean);
  const cc = (message.Cc || []).map(getAddress).filter(Boolean);
  const bcc = (message.Bcc || []).map(getAddress).filter(Boolean);

  if (!to.length) throw new Error('Resend email requires at least one recipient.');
  if (!message.Subject) throw new Error('Resend email requires a subject.');

  const payload = {
    from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
    to,
    subject: message.Subject,
  };

  if (message.TextPart) payload.text = message.TextPart;
  if (message.HTMLPart) payload.html = message.HTMLPart;
  if (cc.length) payload.cc = cc;
  if (bcc.length) payload.bcc = bcc;

  const replyTo = getAddress(message.ReplyTo);
  if (replyTo) payload.replyTo = replyTo;

  return payload;
}

module.exports = {
  // Compatibility wrapper keeps existing controller business logic intact,
  // while every outgoing email is sent through resend.emails.send().
  apiConnect() {
    return {
      post() {
        return {
          async request(body) {
            const apiKey = process.env.RESEND_API_KEY || process.env.RESEND;
            if (!apiKey) {
              throw new Error('Missing Resend API key. Set RESEND_API_KEY in your backend .env file.');
            }

            const messages = body && Array.isArray(body.Messages) ? body.Messages : [];
            if (!messages.length) {
              throw new Error('No email messages were supplied to Resend.');
            }

            const results = [];
            for (const message of messages) {
              const { data, error } = await resend.emails.send(mapMessage(message));
              if (error) {
                const sendError = new Error(error.message || 'Resend failed to send the email.');
                sendError.statusCode = error.statusCode;
                throw sendError;
              }
              results.push({ Status: 'success', ResendId: data && data.id });
            }

            return { Messages: results };
          },
        };
      },
    };
  },
};
