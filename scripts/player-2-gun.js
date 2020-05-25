Phaserfroot.PluginManager.register(
  "Player2Gun",
  class Player2Gun extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Player2Gun",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );


      // Initialize properties from parameters.
      this.player_2 = ( typeof instanceProperties[ "player 2" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "player 2" ], true ) : null;


      // Boot phase.

      this.onCreate();

    }

    // BUILT-IN METHODS

    preUpdate () {

    }

    update () {
      this.EVENTS_UPDATE();

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
      this.owner.tags.add( 'player 2 gun' );

      // Set side collisions.
      this.owner.body.checkCollision.left = false;
      this.owner.body.checkCollision.right = false;
      this.owner.body.checkCollision.up = false;
      this.owner.body.checkCollision.down = false;
      this.owner.body.checkCollision.none = !(
        this.owner.body.checkCollision.left ||
        this.owner.body.checkCollision.right ||
        this.owner.body.checkCollision.up ||
        this.owner.body.checkCollision.down );
      // Get the current layer.
      var layer = this.scene.physicsLayersManager.getLayersWithChild( this.owner )[ 0 ];
      layer = layer ? this.scene.physicsLayersManager.layers.indexOf( layer ) : 0;
      if ( this.owner.body.checkCollision.none ) {
        // Remove from current layer.
        this.scene.physicsLayersManager.layers[ layer ].remove( this.owner );
      } else if ( !this.scene.physicsLayersManager.layers[ layer ].hasChild( this.owner ) ) {
      // Add back to a layer - probably default, 0.
        this.scene.physicsLayersManager.layers[ layer ].add( this.owner );
      }

    }

    EVENTS_UPDATE () {
      // Executed every frame.
      this.chase_to_player(  );
    }

    onLevelStart2() {
      this.player_2 = this.scene.getChildrenByTag( 'player2' )[ 0 ];

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

    errorCheckNotNull3( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull4( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    chase_to_player (  ) {
      this.owner.body.velocity.y = ((((this.errorCheckNotNull( this.player_2, this.owner, "`Get Position of Instance` block could not find an instance named [player_2].")).posY + 45) - this.owner.posY) * 40);
      if ((this.errorCheckNotNull2( this.player_2, this.owner, "`Get scale of Instance` block could not find an instance named [player_2].")).scaleX > 0) {
        this.owner.scaleX = 1;
        this.owner.body.velocity.x = ((((this.errorCheckNotNull3( this.player_2, this.owner, "`Get Position of Instance` block could not find an instance named [player_2].")).posX + 30) - this.owner.posX) * 30);
      } else {
        this.owner.scaleX = -1;
        this.owner.body.velocity.x = ((((this.errorCheckNotNull4( this.player_2, this.owner, "`Get Position of Instance` block could not find an instance named [player_2].")).posX + 6) - this.owner.posX) * 30);
      }
    }

  }
);