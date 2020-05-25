Phaserfroot.PluginManager.register(
  "Sparks",
  class Sparks extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Sparks",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.


      // Initialize properties from parameters.


      // Boot phase.
      this.animation_key = this.owner.data.list.animKeyPrefix;
      this.owner.on( "animationrepeat-" + this.animation_key + "idle", this._idle__22animationrepeat__222, this );

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
      this.owner.setPhysics( false );
      this.owner.tags.add( 'sparks' );
    }

    _idle__22animationrepeat__222 () {
        if (( this.owner && this.owner.exists )) {
        this.owner.destroySafe();
      }

    }

  }
);