Phaserfroot.PluginManager.register(
  "Jumpcloud",
  class Jumpcloud extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Jumpcloud",
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
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.setPhysics( false );
      this.owner.tags.add( 'jumpcloud' );
    }

    onLevelStart2() {
      this.owner.visible = false;
      this.owner.setPhysics( false );

    }

    _idle__22animationrepeat__222 () {
        if (( this.owner && this.owner.exists )) {
        if (this.owner.visible) {
          this.owner.destroySafe();
        }
      }

    }

  }
);