Phaserfroot.PluginManager.register(
  "SpawnOtherPlayers",
  class SpawnOtherPlayers extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "SpawnOtherPlayers",
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
      this.list_of_players = instanceProperties[ "list of players" ];
      this.player_already_exists = instanceProperties[ "player already exists" ];
      this.other_player = instanceProperties[ "other player" ];
      this.other_player_gun = instanceProperties[ "other player gun" ];
      this.value = instanceProperties[ "value" ];
      this.j = instanceProperties[ "j" ];


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

    executeMessagegetPlayerInfo () {
      // Executed when the 'getPlayerInfo' is received.
      // Each individual player has responded with their info, so let's spawn them in
      // But first we check if they already have a player in the game
      this.player_already_exists = false;
      var j_list = this.list_of_players;
      for (var j_index in j_list) {
        this.j = j_list[j_index];
        if (this.j == this.value[0]) {
          this.player_already_exists = true;
        }
      }
      if (this.player_already_exists == false) {
        if ( !this.list_of_players ) {
          this.reportError( "`Add to List` block could not find a list called [list_of_players]." );
          return;
        }
        this.list_of_players.push( (this.value[0]) );
        var instance = this.scene.addSpriteByName( this.other_player );
        this.scene.messageInstance( instance, 'playerID', (this.value[0]) );
        if ( !instance ) {
          this.reportError( "`Set Instance CenterX` block could not find the instance [instance]." );
          return;
        }
        instance.x = this.value[1];
        if ( !instance ) {
          this.reportError( "`Set Instance CenterY` block could not find the instance [instance]." );
          return;
        }
        instance.y = this.value[2];
        this.scene.messageInstance( instance, 'currentAnimation', (this.value[3]) );
        this.scene.messageInstance( instance, 'velocityX', (this.value[5]) );
        this.scene.messageInstance( instance, 'velocityY', (this.value[6]) );
        if ( !instance ) {
          this.reportError( "`Set Instance Scale` block could not find the instance [instance]." );
          return;
        }
        instance.scaleX = this.value[7];
        this.scene.messageInstance( instance, 'accelerationX', (this.value[8]) );
        this.scene.messageInstance( instance, 'accelerationY', (this.value[9]) );
        this.scene.messageInstance( instance, 'playerName', (this.value[11]) );
        this.scene.messageInstance( instance, 'health', (this.value[10]) );
        var player = instance;
        var new_gun = this.scene.addSpriteByName( this.other_player_gun );
        this.scene.messageInstance( new_gun, 'set other player gun', player );
        this.scene.messageInstance( new_gun, 'set gun player ID', (this.value[0]) );
        this.scene.messageInstance( instance, 'kills', (this.value[12]) );
        this.scene.messageInstance( instance, 'deaths', (this.value[13]) );
      }
    }

    reportError( message ) {
      message = "(" + this.name.replace( /_[\d]+$/, "" ) + ")" + message;
      console.trace( message );
      this.game.reportError( message, message, "SCRIPT ERROR" );
    }

    errorCheckNotNull( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull2( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    onLevelStart2() {
      this.list_of_players = [this.game.GLOBAL_VARIABLES.myPlayerID];
      this.other_player = (this.errorCheckNotNull( this.scene.getChildrenByTag( 'other player' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _other p].")).name;
      if ( !this.scene.getChildrenByTag( 'other player' )[ 0 ] ) {
        this.reportError( "`Destroy` block could not find the instance [scene.getChildrenByTag( _other p]." );
        return;
      }
      this.scene.getChildrenByTag( 'other player' )[ 0 ].destroySafe();
      this.other_player_gun = (this.errorCheckNotNull2( this.scene.getChildrenByTag( 'other player gun' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _other p].")).name;
      // Request all player info so I can spawn them in correctly
      this.scene.messageExternal( 'sendToRoom', [this.game.GLOBAL_VARIABLES.hostRoomName, 'getPlayerInfo', this.game.GLOBAL_VARIABLES.myPlayerID] );

    }

    onMessageReceived ( name, message ) {

      if ( message === 'getPlayerInfo' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagegetPlayerInfo();
      }

    }

  }
);