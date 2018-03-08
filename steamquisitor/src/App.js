import React, { Component } from 'react';
import logo from './logo_small.png';
import './App.css';
const _ = require('lodash');

class App extends Component {
  state = {
    // TODO: ID should be set on API call
    id: 0,
    response: '',
    gameCount: 0,
    games: [],
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({
        response: res.response,
        gameCount: res.response.game_count,
        // Sort games desc by play time, then asc id
        games: _.orderBy(res.response.games, ['playtime_forever', 'appid'], ['desc', 'asc'])
      }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/test');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Steamquisitor</h1>
        </header>
        <h1>Steam ID: {this.state.id}</h1>
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