import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class GamesList extends Component {
  // <props>
  // gameCount: 0
  // games: []

  render() {
    return (
      <div>
        {this.props.games.length > 0 &&
          <p className="App-intro">Top {Math.min(this.props.gameCount, 10)}/{this.props.gameCount} Games Owned by Playtime</p>
        }

        {this.props.games.length > 0 &&
          <ListGroup>
            {this.props.games.map((item, index) =>
              <ListGroupItem key={index} href={'https://store.steampowered.com/app/' + item.appid}>{item.appid} Playtime: {item.playtime_forever} minutes
            {item.playtime_2weeks ? `, Last 2 Weeks: ${item.playtime_2weeks}` : ''}
              </ListGroupItem>
            )}
          </ListGroup>
        }
      </div>
    );
  }

}
export default GamesList;