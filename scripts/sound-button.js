Phaserfroot.PluginManager.register(
  "SoundButton",
  class SoundButton extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "SoundButton",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.scene.input.on( "pointerdown", this.onPointerDown2, this );
      this.owner.properties.onUpdate( this.onMessageReceived, this, "_messaging_");


      // Initialize properties from parameters.
      this.font_size = instanceProperties[ "font size" ];


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
      this.scene.input.off( "pointerdown", this.onPointerDown2, this );

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.components.getByName( "TextAutomation" )[ 0 ].text = 'SOUND ON 🔊';
      this.game.GLOBAL_VARIABLES.sound_is_on = true;
      this.font_size = Number.parseInt( /(\d*\.\d*|\d*)/.exec( this.owner.style.fontSize )[ 0 ] );
    }

    EVENTS_POST_UPDATE () {
      // Executed every frame.
      this.position_on_HUD_v2(  );
    }

    executeMessageplayer_dead () {
      // Executed when the message 'player dead' is received.
      this.owner.visible = false;
    }

    onLevelStart2() {
      this.scene.sys.displayList.bringToTop( this.owner );

    }

    reportError( message ) {
      message = "(" + this.name.replace( /_[\d]+$/, "" ) + ")" + message;
      console.trace( message );
      this.game.reportError( message, message, "SCRIPT ERROR" );
    }

    position_on_HUD_v2 (  ) {
      if ( !this.owner.setFontSize ) {
        this.reportError( "`Set Text Numeric` block could not find text properties on an instance called [owner]." );
        return;
      }
      this.owner.setFontSize( (this.font_size / this.camera.scaleX) );
      var x_offset = 10;
      var y_offset = 10;
      var x_relative_offset = x_offset + (this.camera.scaleX - 1) * 404;
      var y_relative_offset = y_offset + (this.camera.scaleY - 1) * 216;
      this.owner.posX = this.camera.posX + this.camera.offsetX + x_relative_offset;
      this.owner.posY = this.camera.posY + this.camera.offsetY + y_relative_offset;
    }

    onPointerDown2 ( pointer ) {
      if ( !this.owner || !this.owner.exists ) {
        return;
      }
      var point = this.camera.getWorldPoint( pointer.x, pointer.y );
      if ( this.owner.getBounds().contains( point.x, point.y ) ) {
      if (this.game.GLOBAL_VARIABLES.sound_is_on) {
        this.game.GLOBAL_VARIABLES.sound_is_on = false;
        this.owner.components.getByName( "TextAutomation" )[ 0 ].text = 'SOUND OFF 🔈';
        this.scene.components.getByName( "SoundManager" )[ 0 ].volume = ( 0/ 100 )
      } else {
        this.game.GLOBAL_VARIABLES.sound_is_on = true;
        this.owner.components.getByName( "TextAutomation" )[ 0 ].text = 'SOUND ON 🔊';
        this.scene.components.getByName( "SoundManager" )[ 0 ].volume = ( 10/ 100 )
      }

      }
    }

    onMessageReceived ( name, message ) {

      if ( message === 'player dead' ) {
        this.executeMessageplayer_dead();
      }

    }

  }
);