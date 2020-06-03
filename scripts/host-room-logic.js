Phaserfroot.PluginManager.register(
  "HostRoomLogic",
  class HostRoomLogic extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "HostRoomLogic",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.owner.properties.onUpdate( this.onMessageReceived, this, "_messaging_");


      // Initialize properties from parameters.
      this.value = instanceProperties[ "value" ];
      this.camera_text = ( typeof instanceProperties[ "camera text" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "camera text" ], true ) : null;
      this.list_of_players = instanceProperties[ "list of players" ];


      // Boot phase.

      this.onCreate();

    }

    // BUILT-IN METHODS

    preUpdate () {

    }

    update () {

    }

    postUpdate () {

    }

    destroy () {
      this.owner.off( "levelSwitch", this.destroy, this );

      // Detach custom event listeners.
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.visible = false;
    }

    executeMessagegetRooms () {
      // Executed when the 'getRooms' is received.
      // A new player in the lobby is asking hosts for their room info.
      if (this.game.GLOBAL_VARIABLES.myPlayerID == this.game.GLOBAL_VARIABLES.hostPlayerID) {
        var requestingPlayerID = this.value;
        this.scene.messageExternal( 'giveRoom', [requestingPlayerID, this.game.GLOBAL_VARIABLES.myPlayerID, this.game.GLOBAL_VARIABLES.myRoomName, this.game.GLOBAL_VARIABLES.numberOfPlayers] );
      }
    }

    executeMessagerequestToJoinRoom () {
      // Executed when the 'requestToJoinRoom' is received.
      // A player wants to join our room!
      if (this.game.GLOBAL_VARIABLES.myPlayerID == this.game.GLOBAL_VARIABLES.hostPlayerID) {
        var targetPlayerName = this.value[0];
        var targetPlayerID = this.value[1];
        this.scene.messageInstance( this.camera_text, 'cinematicText', (String(targetPlayerName) + ' joined the game!') );
        this.scene.messageExternal( 'sendToPlayer', [targetPlayerID, 'addPlayerToRoom', this.game.GLOBAL_VARIABLES.myPlayerID, this.game.GLOBAL_VARIABLES.myRoomName] );
        if ( !this.list_of_players ) {
          this.reportError( "`Add to List` block could not find a list called [list_of_players]." );
          return;
        }
        this.list_of_players.push( [targetPlayerID, targetPlayerName] );
        this.game.GLOBAL_VARIABLES.numberOfPlayers = this.list_of_players.length;
      }
    }

    reportError( message ) {
      message = "(" + this.name.replace( /_[\d]+$/, "" ) + ")" + message;
      console.trace( message );
      this.game.reportError( message, message, "SCRIPT ERROR" );
    }

    onLevelStart2() {
      this.camera_text = this.scene.getChildrenByTag( 'camera text' )[ 0 ];
      // Am I the host? If I am, set up the game! If not, destroy myself!
      if (this.game.GLOBAL_VARIABLES.hostPlayerID == this.game.GLOBAL_VARIABLES.myPlayerID) {
        if (this.game.GLOBAL_VARIABLES.myPlayerID != '0') {
          this.scene.messageInstance( this.camera_text, 'cinematicText', ('Waiting for players to join...' + '') );
        }
        this.list_of_players = [];
        if ( !this.list_of_players ) {
          this.reportError( "`Add to List` block could not find a list called [list_of_players]." );
          return;
        }
        this.list_of_players.push( [this.game.GLOBAL_VARIABLES.myPlayerID, this.game.GLOBAL_VARIABLES.myName] );
        this.game.GLOBAL_VARIABLES.numberOfPlayers = this.list_of_players.length;
      } else {
        this.owner.destroySafe();
      }

    }

    onMessageReceived ( name, message ) {

      if ( message === 'getRooms' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagegetRooms();
      }

      if ( message === 'requestToJoinRoom' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagerequestToJoinRoom();
      }

    }

  }
);