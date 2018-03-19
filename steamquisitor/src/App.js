import React, { Component } from 'react';
import logo from './magnifying_glass_white.png';
import './App.css';

import GamesList from './components/GamesList.js'
import FriendsList from './components/FriendsList.js'

const _ = require('lodash');

// TODO: Add these to an API class that can be refd
const ApiOwnedGames = '/api/ownedGames';
const ApiFriendsList = '/api/friendsList';
// TODO: Replace this with some other method of setting the default state ID
const DefaultSteamId = 76561197972291669;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: DefaultSteamId,

      gamesLoaded: false,
      gameCount: 0,
      games: [],

      friendsLoaded: false,
      friends: [],
    };

    // Add 'this' during callback
    this.refreshUser = this.refreshUser.bind(this);
    this.changeId = this.changeId.bind(this);
  }

  componentDidMount() {
    this.refreshUser();
  }

  refreshUser() {
    this.displayGames();
    this.displayFriendList();
  }

  displayGames() {
    this.setState({ gamesLoading: true });

    this.apiCall(ApiOwnedGames)
      .then(res => this.setState({
        response: res.response,
        gameCount: res.response.game_count,
        // Sort games desc by play time, then asc id
        // Only takes the first 10 elements
        games: _.take(_.orderBy(res.response.games, ['playtime_forever', 'appid'], ['desc', 'asc']), 10),
        gamesLoaded: true,
      }))
      .catch(err => console.log(err));
  }

  displayFriendList() {
    this.setState({ friendsLoading: true });

    this.apiCall(ApiFriendsList)
      .then(res => this.setState({
        // Sort friends by time since friend was added desc
        // Only takes the first 10 elements
        friends: _.take(_.orderBy(res.friendslist.friends, ['friend_since'], ['desc']), 10),
        friendsLoaded: true,
      }))
      .catch(err => console.log(err));
  }

  async apiCall(url) {
    const response = await fetch(`${url}/${this.state.id}`);
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
          <h1 className="App-title">Steamquisitor</h1>
          <h5><i>A Single Page App for querying Steam APIs. React w/NodeJS.</i></h5>
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
          <button onClick={this.refreshUser}>Refresh</button>
        </div>

        {this.state.gamesLoaded && <GamesList gameCount={this.state.gameCount} games={this.state.games} />}

        {this.state.friendsLoaded && <FriendsList friends={this.state.friends} />}

      </div>
    );
  }
}

export default App;