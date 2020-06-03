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


      // Initialize properties from parameters.
      this.value = instanceProperties[ "value" ];
      this.scoreboard = ( typeof instanceProperties[ "scoreboard" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "scoreboard" ], true ) : null;
      this.thisPlayerID = instanceProperties[ "thisPlayerID" ];
      this.playerName = instanceProperties[ "playerName" ];
      this.font_size = instanceProperties[ "font size" ];
      this.kills = instanceProperties[ "kills" ];
      this.deaths = instanceProperties[ "deaths" ];
      this.player_scores = instanceProperties[ "player scores" ];


      // Boot phase.

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

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.visible = false;
      this.font_size = Number.parseInt( /(\d*\.\d*|\d*)/.exec( this.owner.style.fontSize )[ 0 ] );
      this.player_scores = [[this.game.GLOBAL_VARIABLES.myName,': ',0,' kills / ',0,' deaths'].join('')];
    }

    EVENTS_POST_UPDATE () {
      // Executed every frame.
    }

  }
);