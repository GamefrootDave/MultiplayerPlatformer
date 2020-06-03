Phaserfroot.PluginManager.register(
  "Level2",
  class Level2 extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Level2",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.scene.input.on( "pointerdown", this.onPointerDown2, this );


      // Initialize properties from parameters.


      // Boot phase.
      this.camera = this.scene.cameras.main;


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
      if ( this.delayed_event ) this.delayed_event.remove();
      if ( this.delayed_event2 ) this.delayed_event2.remove();
      this.scene.input.off( "pointerdown", this.onPointerDown2, this );

    }

    // CUSTOM METHODS

    onPointerDown2 ( pointer ) {
      if ( !this.owner || !this.owner.exists ) {
        return;
      }
      var point = this.camera.getWorldPoint( pointer.x, pointer.y );
      if ( this.owner.getBounds().contains( point.x, point.y ) ) {
      this.owner.alpha = 0.2;
      this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndNext' ) ? 'sndNext' : null );
      this.game.GLOBAL_VARIABLES.levelName = 'Level2';
      this.delayed_event = this.scene.time.delayedCall( 200, function() {
        if ( !this.owner || this.owner.exists === false ) {
          return;
        }
          this.owner.alpha = 1;
      }, null, this );
      this.delayed_event2 = this.scene.time.delayedCall( 400, function() {
        if ( !this.owner || this.owner.exists === false ) {
          return;
        }
          this.scene.messageExternal( 'hostRoom', this.game.GLOBAL_VARIABLES.myRoomName );
        if ( 1 <= 4 && 4 <= this.game.levelManager.levels.length ) {
          this.game.levelManager.switchTo( 4 );
        } else {
          ( function() {
            var message = "`Go to level` block could not go to level number 4. Level numbers start at 1 and go up to the total number of levels in your game (" + this.game.levelManager.levels.length + ").";
            this.game.reportError( message, message, "SCRIPT ERROR" );
          } ).bind( this )();
        }
      }, null, this );

      }
    }

  }
);