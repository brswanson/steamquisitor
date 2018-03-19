import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class GamesList extends Component {
  // <props>
  // gameCount: 0
  // games: []

  render() {
    return (
      <div>
        <p className="App-intro">Game Count: {this.props.gameCount}</p>
        <ListGroup>
          {this.props.games.map((item, index) =>
            <ListGroupItem key={index} href={'http://store.steampowered.com/app/' + item.appid}>{item.appid} Playtime: {item.playtime_forever} minutes
            {item.playtime_2weeks ? `, Last 2 Weeks: ${item.playtime_2weeks}` : ''}
            </ListGroupItem>
          )}
        </ListGroup>
      </div>
    );
  }

}
export default GamesList;