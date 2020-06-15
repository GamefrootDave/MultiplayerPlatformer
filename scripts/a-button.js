Phaserfroot.PluginManager.register(
  "AButton",
  class AButton extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "AButton",
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
      this.button_down = instanceProperties[ "button down" ];
      this.pointer = instanceProperties[ "pointer" ];
      this.keybind = instanceProperties[ "keybind" ];
      this.start_x_pos = instanceProperties[ "start x pos" ];
      this.start_y_pos = instanceProperties[ "start y pos" ];
      this.stage_touches = instanceProperties[ "stage touches" ];


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
      this.keybind = 38;
      this.start_x_pos = this.owner.posX;
      this.start_y_pos = this.owner.posY;
      this.owner.setPhysics( false );
      this.owner.alpha = 0;
      this.stage_touches = [];
    }

    onRemove () {
      // Executed when this script is to be removed.
      // Either because the level is now being changed, or because it has been destroyed
      if (this.button_down) {
        this.scene.getKey( this.keybind )._key.onUp(
          new KeyboardEvent( "onup", { code: this.keybind } ) );
      }
    }

    EVENTS_POST_UPDATE () {
      // Executed every frame.
      this.owner.posX = this.camera.posX + this.start_x_pos;
      this.owner.posY = this.camera.posY + this.start_y_pos;
      this.manage_opacity(  );
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
      if (this.instContains( this.owner, ((this.errorCheckNotNull( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).x + this.camera.posX), ((this.errorCheckNotNull2( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).y + this.camera.posY) )) {
        this.pointer = pointer;
        this.a_pressed(  );
      }

    }

    a_pressed (  ) {
      this.button_down = true;
      this.owner.playMy( 'pressed' );
      this.scene.getKey( this.keybind )._key.onDown(
        new KeyboardEvent( "onup", { code: this.keybind } ) );
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
      this.scene.getKey( this.keybind )._key.onUp(
        new KeyboardEvent( "onup", { code: this.keybind } ) );
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

    manage_opacity (  ) {
      if (this.stage_touches.length > 0) {
        // Fade in quickly.
        this.owner.alpha = this.math_lerp( this.owner.alpha, 1, 0.1 );
      } else {
        // Fade out slowly, with a margin to allow it to lerp all the way past 0.
        this.owner.alpha = this.math_lerp( this.owner.alpha, (-0.1), 0.01 );
      }
    }

  }
);