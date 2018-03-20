import React, { Component } from 'react';
import { Badge, Image, ListGroup, ListGroupItem } from 'react-bootstrap';

class GamesListRecent extends Component {
  // <props>
  // gameCount: 0
  // games: []

  render() {
    return (
      <div>
        {this.props.games.length > 0 &&
          <p className="App-intro">{this.props.gameCount} Games Played Recently</p>
        }

        {this.props.games.length > 0 &&
          <ListGroup>
            {this.props.games.map((item, index) =>
              <ListGroupItem header={<Image src={`http://media.steampowered.com/steamcommunity/public/images/apps/${item.appid}/${item.img_logo_url}.jpg`} circle />} key={index} href={`https://store.steampowered.com/app/${item.appid}`}>
                <b>{item.name}</b> {item.playtime_2weeks} minutes
              </ListGroupItem>
            )}
          </ListGroup>
        }
      </div>
    );
  }

}
export default GamesListRecent;