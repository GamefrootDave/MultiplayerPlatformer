Phaserfroot.PluginManager.register(
  "Scoreboard",
  class Scoreboard extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Scoreboard",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.owner.properties.onUpdate( this.onMessageReceived, this, "_messaging_");


      // Initialize properties from parameters.
      this.value = instanceProperties[ "value" ];
      this.scoreboard = ( typeof instanceProperties[ "scoreboard" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "scoreboard" ], true ) : null;
      this.player_scores = instanceProperties[ "player scores" ];
      this.font_size = instanceProperties[ "font size" ];
      this.deaths = instanceProperties[ "deaths" ];
      this.kills = instanceProperties[ "kills" ];
      this.playerName = instanceProperties[ "playerName" ];
      this.thisPlayerID = instanceProperties[ "thisPlayerID" ];


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

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.font_size = Number.parseInt( /(\d*\.\d*|\d*)/.exec( this.owner.style.fontSize )[ 0 ] );
      this.player_scores = [[this.game.GLOBAL_VARIABLES.myName,': ',0,' kills / ',0,' deaths'].join('')];
    }

    EVENTS_POST_UPDATE () {
      // Executed every frame.
      this.position_on_HUD_v2(  );
    }

    executeMessageplayer_dead () {
      // Executed when the message 'player dead' is received.
      this.owner.visible = false;
    }

    executeMessageplayer_alive () {
      // Executed when the message 'player alive' is received.
      this.owner.visible = true;
    }

    executeMessageupdate_scoreboard () {
      // Executed when the 'update scoreboard' is received.
      this.owner.components.getByName( "TextAutomation" )[ 0 ].text = ([this.playerName,': ',this.kills,' kills / ',this.deaths,' deaths'].join(''));
    }

    onLevelStart2() {
      this.scene.sys.displayList.bringToTop( this.owner );
      this.owner.components.getByName( "TextAutomation" )[ 0 ].text = ([this.game.GLOBAL_VARIABLES.myName,': ',0,' kills / ',0,' deaths'].join(''));

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
      var y_offset = 50;
      var x_relative_offset = x_offset + (this.camera.scaleX - 1) * 404;
      var y_relative_offset = y_offset + (this.camera.scaleY - 1) * 216;
      this.owner.posX = this.camera.posX + this.camera.offsetX + x_relative_offset;
      this.owner.posY = this.camera.posY + this.camera.offsetY + y_relative_offset;
    }

    onMessageReceived ( name, message ) {

      if ( message === 'player dead' ) {
        this.executeMessageplayer_dead();
      }

      if ( message === 'player alive' ) {
        this.executeMessageplayer_alive();
      }

      if ( message === 'update scoreboard' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageupdate_scoreboard();
      }

    }

  }
);