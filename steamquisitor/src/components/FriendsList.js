import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class FriendsList extends Component {
  // <props>
  // friends: []

  render() {
    return (
      <div>
        {this.props.friends.length > 0 &&
          <p className="App-intro">Friends List</p>
        }

        {this.props.friends.length > 0 &&
          <ListGroup>
            {this.props.friends.map((item, index) =>
              <ListGroupItem key={index} href={`http://steamcommunity.com/profiles/` + item.steamid}>
                <p><b>{item.steamid}</b>:
                {item.friend_since > 0 ? ` Since ${this.convertTimestamp(item.friend_since)}` : ''}</p>
              </ListGroupItem>
            )}
          </ListGroup>
        }
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
export default FriendsList;