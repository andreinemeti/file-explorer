import { app, getRoot } from './app.js';

const ROOT = getRoot(); 
const PORT = Number(process.env.PORT || 8080);
console.log('Booting server.ts...');

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT} (root: ${ROOT})`);
});

server.on('listening', () => console.log('HTTP server is in listening state'));
server.on('error', (err) => console.error('HTTP server error:', err));
