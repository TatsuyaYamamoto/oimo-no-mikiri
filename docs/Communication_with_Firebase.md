# Communication with Firebase

## Actor
- Client1
- Client2
- Player1
- Player2
- Firebase

## Database schema

```
{
  "users": {
    [userId]: {
      "roomId": [roomId]
    }
  },
  "rooms": {
    [roomId]: {
      "status": "initialized"
      "ownerId": "abcd",
      "members": {
        "abcd": true,
        "efgh": true,        
      },
      "game": {
        "roundLength": 5,
        "battles": {
          [battleId]: true,
          [battleId]: true
        }
      }
    }
  },
  "battles": {
    [battleId]: {
    }
  }
}
```

```
users
users.name
users.ownerRoomId

rooms
rooms.ownerId
rooms.members
rooms.game
rooms.game.roundLength
rooms.game.battles

battles
battles.signTime
battles.onePlayerAttackTime
battles.twoPlayerAttackTime
```

## Endpoint


### createRoom

```
->
POST https:[host]/rooms/
{
	ownerId: hogehoge
}
	
<-
OK
{
	roomId: hogehoge
}
```

### joinRoom

```
->
POST https:[host]/rooms/
{
	ownerId: hogehoge
}
	
<-
OK
{
	roomId: hogehoge
}
```

- badrequest
	- already fixed membr.

## Flow

1. _Player1_: Select online mode.
1. _Player1_: Select create room. => Call POST: /createRoom
	- if Player1 is already member of another room, TODO
1. _Firebase_: Create a room document and return roomId.

	```
	{
	  rooms: {
	    [roomId]: {
	      status: "initialized", 
	      ownerId: [client1_id],
	      members: {
	        [client1_id]: true
	      }
	    }
	  }
	}
	```
1. _Client1_: Show roomId, and invite URL with response from Firebase. 
1. _Player1_: Invite any player.
1. _Player2_: Access the game with invaite URL
	
	```
	GET http://games.sokontokoro-factory.net/oimo/?roomId=[roomId]
	```
	
1. _Client2_: Detect roomId in URL and call POST: /joinRoom with ID of game and player2. 
	- if room is not exist
	- if room's member is sutisfied.
	- if client2 is already a member of another room.
1. _Firebase_: Update the game record with provided ID of game and player2.

	```
	{
	  rooms: {
	    [roomId]: {
	      status: "fixed_members", 
	      ownerId: [client1_id],
	      members: {
	        [client1_id]: true,
	        [client2_id]: true
	      },
	      game: {
	      		roundSize: 5,
	      		
	      }
	    }
	  }
	}
	```
1. _Client1 & Client2_: Fired [onRoomReady]() and show alert
1. _Client1_: Call POST: /startBattle
1. _Firebase_: Create sign time.
	```
	{
		rooms: {
			[roomId]: {
				ownerId: [client1_id],
				members: {
                [client1_id]: true,
                [client2_id]: true
				},
				game: {
				  roundSize: 5,
				  battles: {
				    1: [battleId]
				    }
				  }
				}
			}
		},
		battles: {
			[battleId]: {
				signTime: 1010101,
				attackTimes: {
					[client1_id]: null,
				   [client2_id]: null
				},
				falseStarted: {
				   [client1_id]: false,
					[client2_id]: false
				}
			}
		}
	}
	```

1. _Client1 & Client2_: Fired [onGameReady]() and show dialog
1. _Client1 & Client2_: Calle [attack]()

	```
	->
	POST http://[host]/rooms/:roomId/games/:gameId/attack
	{
		roundSize: 5
	}
	
	<-
	OK
	```

1. _Client1 & Client2_: Fired [onBattleMatch]() and

1. _Client1 & Client2_: Fired [onGameMatch]() and
