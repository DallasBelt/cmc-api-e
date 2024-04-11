const http = require('http');

const app = require('./app');

const server = http.createServer(app);

async function startServer() {
  server.listen(8000, () => {
    console.log('Server started on port 8000');
  });
}

startServer();