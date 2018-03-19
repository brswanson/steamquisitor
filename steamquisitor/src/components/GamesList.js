import React, { Component } from 'react';

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

export default GamesList;  