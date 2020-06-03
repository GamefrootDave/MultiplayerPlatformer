Phaserfroot.PluginManager.register(
  "Level1",
  class Level1 extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Level1",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.scene.input.on( "pointerdown", this.onStageTouch2, this );


      // Initialize properties from parameters.


      // Boot phase.


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
      this.scene.input.off( "pointerdown", this.onStageTouch2, this );

    }

    // CUSTOM METHODS

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

    instContains ( ins, x, y ) {
      if ( !ins || !ins.getHitbox ) return false;
      var hitbox = ins.getHitbox();
      return hitbox.contains( x, y );
    }

    onStageTouch2 ( pointer ) {
      var pointer = pointer;
      if (this.instContains( this.owner, (this.errorCheckNotNull( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).x, (this.errorCheckNotNull2( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).y )) {
        this.owner.alpha = 0.2;
        this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndNext' ) ? 'sndNext' : null );
        this.game.GLOBAL_VARIABLES.levelName = 'Level1';
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
          if ( 1 <= 3 && 3 <= this.game.levelManager.levels.length ) {
            this.game.levelManager.switchTo( 3 );
          } else {
            ( function() {
              var message = "`Go to level` block could not go to level number 3. Level numbers start at 1 and go up to the total number of levels in your game (" + this.game.levelManager.levels.length + ").";
              this.game.reportError( message, message, "SCRIPT ERROR" );
            } ).bind( this )();
          }
        }, null, this );
      }

    }

  }
);