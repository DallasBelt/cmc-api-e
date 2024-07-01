const http = require('http');

const app = require('./app');
const { sequelize } = require('./config/db');

const server = http.createServer(app);

async function startServer() {
  server.listen(8000, async () => {
    console.log('Server started successfuly on port 8000!');
    try {
      await sequelize.sync();
      console.log('Connection to the database was successful!');
    } catch (error) {
      console.error(`Can't connect to the database! ${error}`);
    }
  });
}

startServer();
