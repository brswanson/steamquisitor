const express = require('express');
const request = require('request');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
require('dotenv').config()

const PORT = process.env.PORT || 5000;
const reactBuild = '../steamquisitor/build';

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, reactBuild)));

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });

  // TODO: Break APIs into its own module
  // APIs
  const steamApiKey = `?key=${process.env.STEAM_API_KEY}`;
  const steamDomain = 'https://api.steampowered.com/';
  const steamApiGetOwnedGames = 'IPlayerService/GetOwnedGames/v0001/';
  const steamTestId = '&steamid=76561197960435530';

  const steamTestGetOwnedGames = `${steamDomain}/${steamApiGetOwnedGames}/${steamApiKey}${steamTestId}`;

  // Generic API up/down call
  app.get('/api', function (req, res) {
    res.send('{"message":"API is up"}');
  });

  // Proof of concept API call
  app.get('/api/test', function (req, res, next) {
    request({
      uri: steamTestGetOwnedGames,
      // qs: {
      //   api_key: '123456',
      //   query: 'World of Warcraft: Legion'
      // }
    }).pipe(res);
  });

  // Route all other requests to the React app so it can handle non-index.html requests
  app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, reactBuild, 'index.html'));
  });
}