Phaserfroot.PluginManager.register(
  "Smoke",
  class Smoke extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Smoke",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.onTick_ = this.scene.time.addEvent( {
        delay: 50,
        loop: true,
        callback: function () {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
          this.onTick();
        },
        callbackScope: this,
      } );


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
      if ( this.onTick_ ) {
        this.onTick_.remove();
      }

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.setPhysics( false );
      this.owner.tags.add( 'smoke' );
      this.owner.scaleX = this.math_random_int( 80, 120 ) / 100;
      this.owner.scaleY = this.owner.scaleX;
    }

    onTick () {
      // Executed after time period of time.
      if (this.owner.scaleX <= 0) {
        this.owner.destroySafe();
      } else {
        this.owner.scaleX = this.owner.scaleX - 0.1;
        this.owner.scaleY = this.owner.scaleX;
      }
    }

    math_random_int ( a, b ) {
      if ( a > b ) {
        // Swap a and b to ensure a is smaller.
        var c = a;
        a = b;
        b = c;
      }
      return Math.floor( Math.random() * ( b - a + 1 ) + a );
    }

  }
);