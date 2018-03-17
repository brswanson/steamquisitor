import React, { Component } from 'react';
import logo from './logo_small.png';
import './App.css';
const _ = require('lodash');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Defaulting to the SteamID of the author of the app
      id: 76561197972291669,
      response: '',
      gameCount: 0,
      games: [],
    };

    // Add 'this' during callback
    this.displayGames = this.displayGames.bind(this);
    this.changeId = this.changeId.bind(this);
  }

  componentDidMount() {
    this.displayGames();
  }

  displayGames() {
    console.log('got me!');

    this.apiOwnedGames()
      .then(res => this.setState({
        response: res.response,
        gameCount: res.response.game_count,
        // Sort games desc by play time, then asc id
        games: _.orderBy(res.response.games, ['playtime_forever', 'appid'], ['desc', 'asc'])
      }))
      .catch(err => console.log(err));
  }

  apiOwnedGames = async () => {
    const response = await fetch(`/api/ownedGames/${this.state.id}`);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  }

  changeId(e) {
    this.setState({ id: e.target.value });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Steamquisitor</h1>
        </header>

        <h3>Game Information</h3>

        <div>
          Steam ID:
          <input
            type="number"
            min="11111111111111111"
            max="99999999999999999"
            value={this.state.id}
            onChange={this.changeId}
            placeholder="Enter a Steam ID"
          />
          <button onClick={this.displayGames}>Refresh</button>
        </div>

        <p className="App-intro">Game Count: {this.state.gameCount}</p>
        <p className="App-intro">Games</p>
        <ul>
          {this.state.games.map((item, index) =>
            <li key={index}>
              <a href={'http://store.steampowered.com/app/' + item.appid}>{item.appid} Playtime: {item.playtime_forever} hours</a>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default App;