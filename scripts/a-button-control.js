Phaserfroot.PluginManager.register(
  "AButtonControl",
  class AButtonControl extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "AButtonControl",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.scene.input.on( "pointerdown", this.onStageTouch2, this );
      this.scene.input.on( "pointerup", this.onStageTouch32, this );


      // Initialize properties from parameters.
      this.pointer = instanceProperties[ "pointer" ];
      this.button_down = instanceProperties[ "button down" ];
      this.start_x_pos = instanceProperties[ "start x pos" ];
      this.start_y_pos = instanceProperties[ "start y pos" ];
      this.target = ( typeof instanceProperties[ "target" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "target" ], true ) : null;
      this.target_tag = instanceProperties[ "target tag" ];


      // Boot phase.
      this.camera = this.scene.cameras.main;

      this.onCreate();

    }

    // BUILT-IN METHODS

    preUpdate () {

    }

    update () {

    }

    postUpdate () {
      this.EVENTS_POST_UPDATE();

    }

    destroy () {
      this.owner.off( "levelSwitch", this.destroy, this );

      // Detach custom event listeners.
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.scene.input.off( "pointerdown", this.onStageTouch2, this );
      this.scene.input.off( "pointerup", this.onStageTouch32, this );

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.start_x_pos = this.owner.posX;
      this.start_y_pos = this.owner.posY;
      this.owner.setPhysics( false );
    }

    EVENTS_POST_UPDATE () {
      // Executed every frame.
      this.owner.posX = this.camera.posX + this.start_x_pos + this.camera.offsetX;
      this.owner.posY = this.camera.posY + this.start_y_pos + this.camera.offsetY;
    }

    onLevelStart2() {
      if (this.scene.getChildrenByTag( this.target_tag )[ 0 ] != null) {
        this.target = this.scene.getChildrenByTag( this.target_tag )[ 0 ];
      } else {
        this.target = this.owner;
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

    instContains ( ins, x, y ) {
      if ( !ins || !ins.getHitbox ) return false;
      var hitbox = ins.getHitbox();
      return hitbox.contains( x, y );
    }

    onStageTouch2 ( pointer ) {
      var pointer = pointer;
      this.pointer = pointer;
      if (this.instContains( this.owner, ((this.errorCheckNotNull( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).x + this.camera.posX), ((this.errorCheckNotNull2( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).y + this.camera.posY) )) {
        this.a_pressed(  );
      }

    }

    a_pressed (  ) {
      this.button_down = true;
      this.owner.playMy( 'pressed' );
      this.scene.messageInstance( this.target, 'START_UP' );
      this.scene.getKey( 38 )._key.onDown(
        new KeyboardEvent( "onup", { code: 38 } ) );
    }

    onStageTouch32 ( pointer ) {
      var pointer = pointer;
      if (this.button_down == true) {
        if (this.pointer != null) {
          if (this.pointer == pointer) {
            this.release(  );
          }
        }
      }

    }

    release (  ) {
      this.button_down = false;
      this.owner.playMy( 'idle' );
      this.scene.messageInstance( this.target, 'STOP_UP' );
      this.scene.getKey( 38 )._key.onUp(
        new KeyboardEvent( "onup", { code: 38 } ) );
    }

  }
);