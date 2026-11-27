# Dashboard image URL persistence

The backend does not upload image bytes. The dashboard uploads directly to S3 in the browser and submits the resulting `response.location` URL to the existing authenticated APIs.

- `POST /registeration/:token` saves `passportUrl` (and the existing identity details).
- `POST /pofilephoto/:token` saves `profilePhotoUrl` and marks the photo verified.

The backend's presigned-URL endpoint and AWS signing dependencies have been removed. The database persistence endpoints are retained. Signup UI and signup upload behaviour were not changed.
