Phaserfroot.PluginManager.register(
  "Deadly",
  class Deadly extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Deadly",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.


      // Initialize properties from parameters.


      // Boot phase.

      this.onCreate();

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

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.visible = false;
      this.owner.body.immovable = true;
      this.owner.tags.add( 'deadly' );
    }

  }
);