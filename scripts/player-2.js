Phaserfroot.PluginManager.register(
  "Player2",
  class Player2 extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Player2",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.owner.properties.onUpdate( this.onMessageReceived, this, "_messaging_");
      this.owner.on( this.owner.EVENTS.COLLIDE, this.onTouchInstance2, this );


      // Initialize properties from parameters.
      this.player1list = instanceProperties[ "player1list" ];
      this.player2list = instanceProperties[ "player2list" ];
      this.toucher = ( typeof instanceProperties[ "toucher" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "toucher" ], true ) : null;
      this.player_2_gun = ( typeof instanceProperties[ "player 2 gun" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "player 2 gun" ], true ) : null;


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
      this.owner.off( this.owner.EVENTS.COLLIDE, this.onTouchInstance2, this );

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.tags.add( 'player2' );
      if (this.game.GLOBAL_VARIABLES.hostPlayerID == this.game.GLOBAL_VARIABLES.myPlayerID) {
        this.owner.posX = 800;
      } else {
        this.owner.posX = 100;
      }
    }

    executeMessagepositionPlayer1 () {
      // Executed when the 'positionPlayer1' is received.
      if (this.game.GLOBAL_VARIABLES.hostPlayerID != this.game.GLOBAL_VARIABLES.myPlayerID) {
        this.owner.x = this.player1list[1];
        this.owner.y = this.player1list[2];
        this.owner.playMy( (this.player1list[3]) );
        this.owner.body.velocity.x = (this.player1list[5]);
        this.owner.body.velocity.y = (this.player1list[6]);
        this.owner.scaleX = this.player1list[7];
      }
    }

    executeMessagepositionPlayer2 () {
      // Executed when the 'positionPlayer2' is received.
      if (this.game.GLOBAL_VARIABLES.hostPlayerID == this.game.GLOBAL_VARIABLES.myPlayerID) {
        this.owner.x = this.player2list[1];
        this.owner.y = this.player2list[2];
        this.owner.playMy( (this.player2list[3]) );
        this.owner.body.velocity.x = (this.player2list[5]);
        this.owner.body.velocity.y = (this.player2list[6]);
        this.owner.scaleX = this.player2list[7];
      }
    }

    onLevelStart2() {
      this.player_2_gun = this.scene.getChildrenByTag( 'player 2 gun' )[ 0 ];

    }

    onMessageReceived ( name, message ) {

      if ( message === 'positionPlayer1' ) {
        this.player1list = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagepositionPlayer1();
      }

      if ( message === 'positionPlayer2' ) {
        this.player2list = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagepositionPlayer2();
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

    onTouchInstance2 ( instance ) {
      if ( !instance ) {
        return;
      }
      if ( instance instanceof Phaser.Tilemaps.Tile ) {
        instance = instance.layer.tilemapLayer;
      }
      this.toucher = instance;
        if ((this.errorCheckNotNull( this.toucher, this.owner, "`Instance has Tag` block could not find an instance named [toucher].")).tags.has( 'bullet' )) {
        this.scene.messageExternal( 'sendToRoom', [this.game.GLOBAL_VARIABLES.hostRoomName, 'bulletHit', this.game.GLOBAL_VARIABLES.myPlayerID] );
      }

    }

  }
);