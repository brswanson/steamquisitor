import React, { Component } from 'react';
import logo from './magnifying_glass_white.png';
import './App.css';
const _ = require('lodash');

// TODO: Add these to an API class that can be refd
const ApiOwnedGames = '/api/ownedGames';
const ApiFriendsList = '/api/friendsList';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Defaulting to the SteamID of the author of the app
      id: 76561197972291669,

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

class GamesList extends Component {
  // <props>
  // gameCount: 0
  // games: []

  render() {
    return (
      <div>
        <p className="App-intro">Game Count: {this.props.gameCount}</p>
        <ul>
          {this.props.games.map((item, index) =>
            <li key={index}>
              <a href={'http://store.steampowered.com/app/' + item.appid}>{item.appid} Playtime: {item.playtime_forever} minutes
              {item.playtime_2weeks ? `, Last 2 Weeks: ${item.playtime_2weeks}` : ''}
              </a>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

class FriendsList extends Component {
  // <props>
  // friends: []

  render() {
    return (
      <div>
        <p className="App-intro">Friends List</p>
        <ul>
          {this.props.friends.map((item, index) =>
            <li key={index}>
              <a href={`http://steamcommunity.com/profiles/` + item.steamid}>{item.steamid}
                {item.friend_since > 0 ? ` Friend Since: ${this.convertTimestamp(item.friend_since)}` : ''}
              </a>
            </li>
          )}
        </ul>
      </div>
    );
  }

  // TODO: Should move this to a helper class
  convertTimestamp(timestamp) {
    var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
      dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
      hh = d.getHours(),
      h = hh,
      min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
      ampm = 'AM',
      time;

    if (hh > 12) {
      h = hh - 12;
      ampm = 'PM';
    } else if (hh === 12) {
      h = 12;
      ampm = 'PM';
    } else if (hh === 0) {
      h = 12;
    }

    // ie: 2013-02-18, 8:35 AM	
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

    return time;
  }
}