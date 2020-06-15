Phaserfroot.PluginManager.register(
  "Dpad",
  class Dpad extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Dpad",
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
      this.scene.input.on( "pointerdown", this.onStageTouch42, this );
      this.scene.input.on( "pointerup", this.onStageTouch52, this );


      // Initialize properties from parameters.
      this.pointer = instanceProperties[ "pointer" ];
      this.pressLeft = instanceProperties[ "pressLeft" ];
      this.pressRight = instanceProperties[ "pressRight" ];
      this.pressUp = instanceProperties[ "pressUp" ];
      this.pressDown = instanceProperties[ "pressDown" ];
      this.stage_touches = instanceProperties[ "stage touches" ];
      this.left = instanceProperties[ "left" ];
      this.start_x_pos = instanceProperties[ "start x pos" ];
      this.right = instanceProperties[ "right" ];
      this.start_y_pos = instanceProperties[ "start y pos" ];
      this.top2 = instanceProperties[ "top" ];
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
      this.onRemove();
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.scene.input.off( "pointerdown", this.onStageTouch2, this );
      this.scene.input.off( "pointerup", this.onStageTouch32, this );
      this.scene.input.off( "pointerdown", this.onStageTouch42, this );
      this.scene.input.off( "pointerup", this.onStageTouch52, this );

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
      this.pressDown = false;
      this.pressLeft = false;
      this.pressRight = false;
      this.pressUp = false;
      this.owner.alpha = 0;
      this.stage_touches = [];
    }

    onRemove () {
      // Executed when this script is to be removed.
      // Either because the level is now being changed, or because it has been destroyed
      if (this.pressLeft) {
        this.scene.getKey( 37 )._key.onUp(
          new KeyboardEvent( "onup", { code: 37 } ) );
      }
      if (this.pressRight) {
        this.scene.getKey( 39 )._key.onUp(
          new KeyboardEvent( "onup", { code: 39 } ) );
      }
      if (this.pressUp) {
        this.scene.getKey( 38 )._key.onUp(
          new KeyboardEvent( "onup", { code: 38 } ) );
      }
      if (this.pressDown) {
        this.scene.getKey( 40 )._key.onUp(
          new KeyboardEvent( "onup", { code: 40 } ) );
      }
    }

    EVENTS_POST_UPDATE () {
      // Executed every frame.
      this.snap_to_camera(  );
      this.track_pointer(  );
      this.manageVisibility(  );
    }

    onLevelStart2() {
      this.scene.sys.displayList.bringToTop( this.owner );

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
        if (this.instContains( this.owner, ((this.errorCheckNotNull( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).x + this.camera.posX), ((this.errorCheckNotNull2( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).y + this.camera.posY) )) {
          this.pointer = pointer;
        }
      }

    }

    onStageTouch32 ( pointer ) {
      var pointer = pointer;
      if (this.pointer == pointer) {
        this.pointer = null;
        this.release_dpad(  );
      }

    }

    snap_to_camera (  ) {
      this.owner.posX = this.camera.posX + this.start_x_pos;
      this.owner.posY = this.camera.posY + this.start_y_pos;
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

    track_pointer (  ) {
      if (this.pointer != null) {
        var x = (this.errorCheckNotNull3( this.pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).x + this.camera.posX;
        var y = (this.errorCheckNotNull4( this.pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).y + this.camera.posY;
        if (this.instContains( this.owner, x, y )) {
          var localLeft = this.owner.posX + this.left;
          var localRight = this.owner.posX + this.right;
          var localTop = this.owner.posY + this.top2;
          var localBottom = this.owner.posY + this.bottom;
          if (this.pressRight) {
            if (!(x > localRight)) {
              this.stopRight(  );
            }
          } else {
            if (x > localRight) {
              this.startRight(  );
            }
          }
          if (this.pressLeft) {
            if (!(x < localLeft)) {
              this.stopLeft(  );
            }
          } else {
            if (x < localLeft) {
              this.startLeft(  );
            }
          }
          if (this.pressUp) {
            if (!(y < localTop)) {
              this.stopTop(  );
            }
          } else {
            if (y < localTop) {
              this.startTop(  );
            }
          }
          if (this.pressDown) {
            if (!(y > localBottom)) {
              this.stopBottom(  );
            }
          } else {
            if (y > localBottom) {
              this.startBottom(  );
            }
          }
        }
      }
      if (!(this.pressLeft || this.pressRight || this.pressUp || this.pressDown)) {
        this.owner.playMy( 'idle' );
      }
    }

    startLeft (  ) {
      this.owner.playMy( 'left' );
      this.scene.getKey( 37 )._key.onDown(
        new KeyboardEvent( "onup", { code: 37 } ) );
      this.pressLeft = true;
    }

    startRight (  ) {
      this.owner.playMy( 'right' );
      this.scene.getKey( 39 )._key.onDown(
        new KeyboardEvent( "onup", { code: 39 } ) );
      this.pressRight = true;
    }

    startTop (  ) {
      this.owner.playMy( 'up' );
      this.scene.getKey( 38 )._key.onDown(
        new KeyboardEvent( "onup", { code: 38 } ) );
      this.pressUp = true;
    }

    startBottom (  ) {
      this.owner.playMy( 'down' );
      this.scene.getKey( 40 )._key.onDown(
        new KeyboardEvent( "onup", { code: 40 } ) );
      this.pressDown = true;
    }

    stopLeft (  ) {
      this.scene.getKey( 37 )._key.onUp(
        new KeyboardEvent( "onup", { code: 37 } ) );
      this.pressLeft = false;
    }

    stopRight (  ) {
      this.scene.getKey( 39 )._key.onUp(
        new KeyboardEvent( "onup", { code: 39 } ) );
      this.pressRight = false;
    }

    stopTop (  ) {
      this.scene.getKey( 38 )._key.onUp(
        new KeyboardEvent( "onup", { code: 38 } ) );
      this.pressUp = false;
    }

    stopBottom (  ) {
      this.scene.getKey( 40 )._key.onUp(
        new KeyboardEvent( "onup", { code: 40 } ) );
      this.pressDown = false;
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

    onStageTouch42 ( pointer ) {
      var pointer = pointer;
      // Maintain a list of all pointers that are currently down.
      if (this.stage_touches.indexOf(pointer) + 1 == 0) {
        if ( !this.stage_touches ) {
          this.reportError( "`Add to List` block could not find a list called [stage_touches]." );
          return;
        }
        this.stage_touches.push( pointer );
      }

    }

    onStageTouch52 ( pointer ) {
      var pointer = pointer;
      // Stop tracking pointers that go up.
      var index = this.stage_touches.indexOf(pointer) + 1;
      if (index > 0) {
        this.stage_touches.splice(index - 1, 1);
      }

    }

    math_lerp ( a, b, t ) {
      return ( ( b - a ) * t ) + a;
    }

    manageVisibility (  ) {
      if (this.stage_touches.length > 0) {
        // Fade in quickly.
        this.owner.alpha = this.math_lerp( this.owner.alpha, 1.5, 0.1 );
      } else {
        // Fade out slowly, with some overlap to ensure total transparency.
        this.owner.alpha = this.math_lerp( this.owner.alpha, (-0.1), 0.01 );
      }
    }

  }
);