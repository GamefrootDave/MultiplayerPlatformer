Phaserfroot.PluginManager.register(
  "ClientLogic2",
  class ClientLogic2 extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "ClientLogic2",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );


      // Initialize properties from parameters.
      this.camera_text = ( typeof instanceProperties[ "camera text" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "camera text" ], true ) : null;


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
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );

    }

    // CUSTOM METHODS

    onLevelStart2() {
      this.camera_text = this.scene.getChildrenByTag( 'camera text' )[ 0 ];
      // Am I the client? If I am, set up the game! If not, destroy myself!
      if (this.game.GLOBAL_VARIABLES.hostPlayerID != this.game.GLOBAL_VARIABLES.myPlayerID) {
        this.scene.messageInstance( this.camera_text, 'cinematicText', ('You have joined ' + String(this.game.GLOBAL_VARIABLES.hostRoomName)) );
      } else {
        this.owner.destroySafe();
      }

    }

  }
);