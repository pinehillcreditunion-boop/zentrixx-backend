# Zentrixx Backend

## Email delivery (Resend)

All backend email notifications use the official Resend Node.js SDK directly from the user and admin controllers:

```js
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY || process.env.RESEND);

const { data, error } = await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL || 'Zentrixx <zentrixx@zentrixx.cloud>',
  to: ['recipient@example.com'],
  subject: 'Subject',
  text: 'Plain-text message',
  html: '<p>HTML message</p>'
});

if (error) {
  // Handle the Resend API error
}
```

## Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env`.
3. Set `RESEND_API_KEY` to your Resend API key.
4. Ensure `zentrixx.cloud` is verified in Resend and its DNS records are configured.
5. Set `RESEND_FROM_EMAIL=Zentrixx <zentrixx@zentrixx.cloud>`.
6. Configure the database and application secrets in `.env`.
7. Run `npm start`.

The actual `.env` file is intentionally not included in this archive. Never commit API keys or database credentials.
