Phaserfroot.PluginManager.register(
  "DpadControls",
  class DpadControls extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "DpadControls",
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
      this.target = ( typeof instanceProperties[ "target" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "target" ], true ) : null;
      this.pointer = instanceProperties[ "pointer" ];
      this.target_tag = instanceProperties[ "target tag" ];
      this.left = instanceProperties[ "left" ];
      this.right = instanceProperties[ "right" ];
      this.start_x_pos = instanceProperties[ "start x pos" ];
      this.top2 = instanceProperties[ "top" ];
      this.start_y_pos = instanceProperties[ "start y pos" ];
      this.bottom = instanceProperties[ "bottom" ];


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
      var thirdWidth = this.owner.width / 3;
      var thirdHeight = this.owner.height / 3;
      this.left = thirdWidth;
      this.right = thirdWidth * 2;
      this.top2 = thirdHeight;
      this.bottom = thirdHeight * 2;
      this.start_x_pos = this.owner.posX;
      this.start_y_pos = this.owner.posY;
      this.owner.setPhysics( false );
    }

    EVENTS_POST_UPDATE () {
      // Executed every frame.
      this.snap_to_camera(  );
      this.track_pointer(  );
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
      if (this.pointer == null) {
        var x = (this.errorCheckNotNull( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).x + this.camera.posX;
        var y = (this.errorCheckNotNull2( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).y + this.camera.posY;
        if (this.instContains( this.owner, x, y )) {
          this.pointer = pointer;
        }
      }

    }

    onStageTouch32 ( pointer ) {
      var pointer = pointer;
      if (this.pointer == pointer) {
        this.release_dpad(  );
      }

    }

    snap_to_camera (  ) {
      this.owner.posX = this.camera.posX + this.start_x_pos + this.camera.offsetX;
      this.owner.posY = this.camera.posY + this.start_y_pos + this.camera.offsetY;
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

    track_pointer (  ) {
      if (this.pointer != null && (this.errorCheckNotNull3( this.pointer, this.scene.input.manager.activePointer, "`Get active/down/up of Pointer` block could not find a pointer named [pointer].")).active) {
        var x = (this.errorCheckNotNull4( this.pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).x + this.camera.posX;
        var y = (this.errorCheckNotNull5( this.pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).y + this.camera.posY;
        if (this.instContains( this.owner, x, y )) {
          this.null_pad(  );
          if (x > this.owner.posX + this.right) {
            this.startRight(  );
          } else if (x < this.owner.posX + this.left) {
            this.startLeft(  );
          } else if (y < this.owner.posY + this.top2) {
            this.startTop(  );
          } else if (y > this.owner.posY + this.bottom) {
            this.startBottom(  );
          } else {
            this.owner.playMy( 'idle' );
          }
        }
      }
    }

    startLeft (  ) {
      this.owner.playMy( 'left' );
      this.scene.messageInstance( this.target, 'START_LEFT' );
      this.scene.getKey( 37 )._key.onDown(
        new KeyboardEvent( "onup", { code: 37 } ) );
    }

    startRight (  ) {
      this.owner.playMy( 'right' );
      this.scene.messageInstance( this.target, 'START_RIGHT' );
      this.scene.getKey( 39 )._key.onDown(
        new KeyboardEvent( "onup", { code: 39 } ) );
    }

    startTop (  ) {
      this.owner.playMy( 'up' );
      this.scene.messageInstance( this.target, 'START_UP' );
      this.scene.getKey( 38 )._key.onDown(
        new KeyboardEvent( "onup", { code: 38 } ) );
    }

    startBottom (  ) {
      this.owner.playMy( 'down' );
      this.scene.messageInstance( this.target, 'START_DOWN' );
      this.scene.getKey( 40 )._key.onDown(
        new KeyboardEvent( "onup", { code: 40 } ) );
    }

    stopLeft (  ) {
      this.scene.messageInstance( this.target, 'STOP_LEFT' );
      this.scene.getKey( 37 )._key.onUp(
        new KeyboardEvent( "onup", { code: 37 } ) );
    }

    stopRight (  ) {
      this.scene.messageInstance( this.target, 'STOP_RIGHT' );
      this.scene.getKey( 39 )._key.onUp(
        new KeyboardEvent( "onup", { code: 39 } ) );
    }

    stopTop (  ) {
      this.scene.messageInstance( this.target, 'STOP_UP' );
      this.scene.getKey( 38 )._key.onUp(
        new KeyboardEvent( "onup", { code: 38 } ) );
    }

    stopBottom (  ) {
      this.scene.messageInstance( this.target, 'STOP_DOWN' );
      this.scene.getKey( 40 )._key.onUp(
        new KeyboardEvent( "onup", { code: 40 } ) );
    }

    release_dpad (  ) {
      this.owner.playMy( 'idle' );
      this.null_pad(  );
    }

    null_pad (  ) {
      this.stopBottom(  );
      this.stopLeft(  );
      this.stopRight(  );
      this.stopTop(  );
    }

  }
);