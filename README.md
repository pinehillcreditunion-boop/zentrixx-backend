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


## Updated user signup and identity uploads

- Signup now creates the user account immediately. It does not send or require an email-verification link.
- The signup screen collects the user's name, email, password, phone number, government ID number, country, state/region and address in a single in-page step carousel.
- The account session is returned immediately and the user is sent to `/dashboard`.
- The profile photo and ID image are uploaded later from the authenticated dashboard.
- The admin controller has not been changed.

### Server environment variables for secure S3 uploads

Set these on the backend host (never in the React frontend):

```env
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_bucket_region
AWS_S3_BUCKET=your_bucket_name
AWS_S3_UPLOAD_DIR=user-uploads
AWS_S3_PUBLIC_BASE_URL=
```

The backend creates short-lived S3 PUT URLs using AWS Signature V4. The browser uploads directly to S3 without receiving AWS secret credentials. Configure the bucket CORS rules using `s3-cors-example.json`, replacing the example frontend origin with your actual frontend origin. The bucket or configured `AWS_S3_PUBLIC_BASE_URL` must serve the uploaded image URLs to authenticated users.

The `.env` file is intentionally not included in the updated archive. Copy your existing database, JWT and Resend environment values into your deployment environment, then add the S3 values above.

### Important existing-account note

The updated login no longer blocks access based on email, phone or photo verification flags. Existing accounts can enter the dashboard and upload missing profile/ID photos there.
