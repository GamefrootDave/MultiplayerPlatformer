Phaserfroot.PluginManager.register(
  "XButton",
  class XButton extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "XButton",
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
      this.camera = this.scene.cameras.main;


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
      this.scene.input.off( "pointerdown", this.onStageTouch2, this );

    }

    // CUSTOM METHODS

    EVENTS_UPDATE () {
      // Executed every frame.
      this.owner.posX = this.camera.posX + this.camera.offsetX + (this.camera.width - 42);
      this.owner.posY = this.camera.posY + this.camera.offsetY + 9;
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

    instContains ( ins, x, y ) {
      if ( !ins || !ins.getHitbox ) return false;
      var hitbox = ins.getHitbox();
      return hitbox.contains( x, y );
    }

    onStageTouch2 ( pointer ) {
      var pointer = pointer;
      if (this.instContains( this.owner, ((this.errorCheckNotNull( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).x + this.camera.posX + this.camera.offsetX), ((this.errorCheckNotNull2( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).y + this.camera.posY + this.camera.offsetY) )) {
        this.owner.visible = false;
        if ( 1 <= 1 && 1 <= this.game.levelManager.levels.length ) {
          this.game.levelManager.switchTo( 1 );
        } else {
          ( function() {
            var message = "`Go to level` block could not go to level number 1. Level numbers start at 1 and go up to the total number of levels in your game (" + this.game.levelManager.levels.length + ").";
            this.game.reportError( message, message, "SCRIPT ERROR" );
          } ).bind( this )();
        }
      }

    }

  }
);