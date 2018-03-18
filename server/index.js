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
  const steamApiKey = process.env.STEAM_API_KEY;
  const steamDomain = 'https://api.steampowered.com';
  const steamApiFormat = 'json';
  const steamApiGetOwnedGames = 'IPlayerService/GetOwnedGames/v0001/';
  const steamApiGetFriendList = 'ISteamUser/GetFriendList/v0001';

  const steamGetOwnedGames = `${steamDomain}/${steamApiGetOwnedGames}`;
  const steamGetFriendsList = `${steamDomain}/${steamApiGetFriendList}`;

  // Generic API up/down call
  app.get('/api', function (req, res) {
    res.send('{"message":"API is up"}');
  });

  // Get owned games for a given Steam User ID
  app.get('/api/ownedGames/:steamId', function (req, res, next) {
    console.log(`Hit: ${steamGetOwnedGames}?steamid=${req.params.steamId}&key=${steamApiKey}`);

    request({
      uri: steamGetOwnedGames,
      qs: {
        key: steamApiKey
        , steamid: req.params.steamId
        , format: steamApiFormat
      }
    }).pipe(res);
  });

  // Get friends list for a given Steam User ID
  app.get('/api/friendsList/:steamId', function (req, res, next) {
    console.log(`Hit: ${steamGetFriendsList}?steamid=${req.params.steamId}&key=${steamApiKey}`);

    request({
      uri: steamGetFriendsList,
      qs: {
        key: steamApiKey
        , steamid: req.params.steamId
        , relationship: 'friend'
        , format: steamApiFormat
      }
    }).pipe(res);
  });

  // Route all other requests to the React app so it can handle non-index.html requests
  app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, reactBuild, 'index.html'));
  });
}