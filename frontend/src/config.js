// When deployed on Render as a single service, frontend is served from the same origin as the backend.
// Use empty string (relative URLs) so API calls go to the same host.
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_URL = isLocal
    ? 'http://localhost:5000'
    : ''; // same origin on Render (or Vercel fallback: 'https://havawatch-bk.vercel.app')

export const ML_URL = isLocal
    ? 'http://127.0.0.1:8001'
    : 'https://havawatch-ml.vercel.app';
