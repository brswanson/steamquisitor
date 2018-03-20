import React, { Component } from 'react';
import logo from './magnifying_glass_white.png';
import { Button, Form, FormControl, Glyphicon, InputGroup, Well } from 'react-bootstrap';
import { RingLoader } from 'react-spinners';
import './App.css';

// import GamesList from './components/GamesList.js'
import GamesListRecent from './components/GamesListRecent.js'
import GamesListVisual from './components/GamesListVisual.js'
import FriendsList from './components/FriendsList.js'

const _ = require('lodash');

// TODO: Add these to an API class that can be refd
const ApiOwnedGames = '/api/ownedGames';
const ApiRecentlyPlayedGames = '/api/recentlyPlayedGames';
const ApiFriendsList = '/api/friendsList';
// TODO: Replace this with some other method of setting the default state ID
const DefaultSteamId = '76561197972291669';

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

      width: window.innerWidth,
      height: Math.max(window.innerWidth / 5, 300)
    };

    // Add 'this' during callback
    this.refreshUser = this.refreshUser.bind(this);
    this.changeId = this.changeId.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.refreshUser();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions() {
    if (window.innerWidth < this.state.width) {
      this.setState({ width: window.innerWidth });
    } else {
      let update_width = window.innerWidth - 100;
      let update_height = Math.round(update_width / 4.4);
      this.setState({ width: update_width, height: update_height });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    if (event.charCode === 13) {
      this.refreshUser();
    }
  }

  refreshUser() {
    this.displayGames();
    // TODO: Implement Friends List when other features are finished
    // this.displayFriendList();
  }

  displayGames() {
    this.setState({ gamesLoaded: false });

    this.apiCall(ApiRecentlyPlayedGames)
      .then(res => this.setState({
        response: res.response,
        gameCount: res.response.game_count,
        // Sort games desc by play time, then asc id
        // Only takes the first 10 elements
        games: _.take(_.orderBy(res.response.games, ['playtime_2weeks', 'appid'], ['desc', 'asc']), 10),
        gamesLoaded: true,
      }))
      .catch(err => console.log(err));
  }

  displayFriendList() {
    this.setState({ friendsLoaded: false });

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

        <a style={{float: 'right'}} href="https://github.com/brswanson">github.com/brswanson</a>

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Steamquisitor</h1>
          <h5><i>A Single Page App for querying Steam APIs. React w/NodeJS.</i></h5>
        </header>

        <h3>Game Information</h3>

        <div className="form">
          <Form onSubmit={this.handleSubmit}>
            <InputGroup>
              <InputGroup.Addon>Steam ID</InputGroup.Addon>
              <FormControl
                type="number"
                min="11111111111111111"
                max="99999999999999999"
                value={this.state.id}
                placeholder="Enter a Steam ID"
                onChange={this.changeId}
              />
              <InputGroup.Button>
                <Button type="submit" bsStyle="primary" onClick={this.refreshUser}><Glyphicon glyph="search" /></Button>
              </InputGroup.Button>
            </InputGroup>
          </Form>
        </div>

        <Well bsSize="small">
          <div id="gamesVisual">

            <div className="row">
              <div className="col-md-offset-6">
                <RingLoader color={'#337ab7'} loading={!this.state.gamesLoaded} />
              </div>
            </div>

            {this.state.gamesLoaded && <GamesListVisual
              games={this.state.games}
              width={this.state.width * .9}
              height={this.state.height * .9}
            />}
          </div>
        </Well>

        {this.state.gamesLoaded && <GamesListRecent gameCount={this.state.gameCount} games={this.state.games} />}
        {this.state.friendsLoaded && <FriendsList friends={this.state.friends} />}
      </div>
    );
  }
}

export default App;