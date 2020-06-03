Phaserfroot.PluginManager.register(
  "RightButtonControl",
  class RightButtonControl extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "RightButtonControl",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.scene.input.on( "pointerdown", this.onStageTouch2, this );
      this.owner.properties.onUpdate( this.onMessageReceived, this, "_messaging_");


      // Initialize properties from parameters.
      this.target = ( typeof instanceProperties[ "target" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "target" ], true ) : null;
      this.button_down = instanceProperties[ "button down" ];
      this.touchscreen = instanceProperties[ "touchscreen" ];
      this.my_key = instanceProperties[ "my key" ];
      this.start_x_pos = instanceProperties[ "start x pos" ];
      this.start_y_pos = instanceProperties[ "start y pos" ];
      this.target_tag = instanceProperties[ "target tag" ];
      this.pointer = instanceProperties[ "pointer" ];


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

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.my_key = 39;
      this.start_x_pos = this.owner.posX;
      this.start_y_pos = this.owner.posY;
      this.owner.setPhysics( false );
      this.owner.visible = true;
      this.owner.alpha = 0;
    }

    EVENTS_POST_UPDATE () {
      // Executed every frame.
      this.owner.posX = this.camera.posX + this.start_x_pos + this.camera.offsetX;
      this.owner.posY = this.camera.posY + this.start_y_pos + this.camera.offsetY;
      if (this.touchscreen) {
        if (this.owner.alpha < 1) {
          this.owner.alpha = this.owner.alpha + 0.05;
        }
        if (this.button_down) {
          if (!this.instContains( this.owner, ((this.errorCheckNotNull( this.pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).x + this.camera.posX), ((this.errorCheckNotNull2( this.pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).y + this.camera.posY) )) {
            if (this.button_down == true) {
              if (this.pointer != null) {
                this.release(  );
              }
            }
          }
        }
      } else {
        if (this.owner.alpha > 0) {
          this.owner.alpha = this.owner.alpha - 0.05;
        }
      }
    }

    executeMessageplayer_dead () {
      // Executed when the message 'player dead' is received.
      this.owner.visible = false;
    }

    onLevelStart2() {
      if (this.scene.getChildrenByTag( this.target_tag )[ 0 ] != null) {
        this.target = this.scene.getChildrenByTag( this.target_tag )[ 0 ];
      } else {
        this.target = this.owner;
      }
      if (this.touchscreen == null) {
        this.touchscreen = false;
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

    errorCheckNotNull5( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    onStageTouch2 ( pointer ) {
      var pointer = pointer;
      if ((this.errorCheckNotNull3( this.scene.input.manager.pointers[1], this.scene.input.manager.activePointer, "`Get active/down/up of Pointer` block could not find a pointer named [scene.input.manager.pointers[1]].")).active) {
        this.touchscreen = true;
      }
      if (this.touchscreen) {
        if (this.instContains( this.owner, ((this.errorCheckNotNull4( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).x + this.camera.posX), ((this.errorCheckNotNull5( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).y + this.camera.posY) )) {
          this.pointer = pointer;
          this.pressed(  );
        }
      }

    }

    pressed (  ) {
      this.button_down = true;
      this.owner.playMy( 'pressed' );
      this.scene.getKey( this.my_key )._key.onDown(
        new KeyboardEvent( "onup", { code: this.my_key } ) );
    }

    release (  ) {
      this.button_down = false;
      this.owner.playMy( 'idle' );
      this.scene.getKey( this.my_key )._key.onUp(
        new KeyboardEvent( "onup", { code: this.my_key } ) );
    }

    onMessageReceived ( name, message ) {

      if ( message === 'player dead' ) {
        this.executeMessageplayer_dead();
      }

    }

  }
);