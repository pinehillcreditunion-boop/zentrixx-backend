# Signup flow update

- Updated only `controller/user.js` and `routes/user.js` for backend signup and identity upload behavior.
- `controller/admin.js` was not modified.
- Signup creates the user without sending an email-verification message.
- Signup collects all text credentials and creates a JWT session immediately.
- New passwords are stored using Node's built-in scrypt hashing. Existing plaintext-password accounts are upgraded to scrypt after their next successful login.
- Added an authenticated endpoint that creates short-lived S3 PUT URLs for ID and profile images.
- Profile and ID image URLs are saved using the existing `registeration` and `profilephoto` user-controller handlers.

Configure the S3 environment variables in `.env.example` on the backend host. Set the bucket CORS allowed origin to the exact frontend origin using `s3-cors-example.json`.
