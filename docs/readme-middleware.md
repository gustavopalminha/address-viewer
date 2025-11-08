Why this is "Production-Ready" 

Consistent Response Format: It ensures every error—whether a 400 Bad Request or a 500 crash—returns the same JSON structure, making it easier for the React front-end to handle.

Security: It uses process.env.NODE_ENV !== 'production' to automatically hide the stack trace in production. Leaking stack traces can reveal internal file paths and library versions to attackers.

Fallbacks: It has defaults for the status code (500) and message ("Internal Server Error") so the request never hangs if an error object is malformed.