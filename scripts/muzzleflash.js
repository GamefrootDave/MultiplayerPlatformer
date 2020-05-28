Phaserfroot.PluginManager.register(
  "Muzzleflash",
  class Muzzleflash extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Muzzleflash",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );


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
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.setPhysics( false );
      this.owner.tags.add( 'muzzleflash' );
    }

    onLevelStart2() {
      this.owner.visible = false;
      this.owner.setPhysics( false );

    }

  }
);