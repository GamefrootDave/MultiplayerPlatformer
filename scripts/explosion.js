Phaserfroot.PluginManager.register(
  "Explosion",
  class Explosion extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Explosion",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.onTick_ = this.scene.time.addEvent( {
        delay: 20,
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
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      if ( this.delayed_event ) this.delayed_event.remove();
      if ( this.delayed_event2 ) this.delayed_event2.remove();
      if ( this.onTick_ ) {
        this.onTick_.remove();
      }

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.setPhysics( false );
      this.owner.tags.add( 'explosion' );
      this.owner.scaleX = this.math_random_int( 60, 120 ) / 100;
      this.owner.scaleY = this.owner.scaleX;
      this.delayed_event2 = this.scene.time.delayedCall( 100, function() {
        if ( !this.owner || this.owner.exists === false ) {
          return;
        }
          this.owner.playMy( 'black' );
        this.delayed_event = this.scene.time.delayedCall( 100, function() {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
            if (this.owner.visible) {
            this.owner.destroySafe();
          }
        }, null, this );
      }, null, this );
    }

    onTick () {
      // Executed after time period of time.
      this.owner.scaleX = this.owner.scaleX + 0.1;
      this.owner.scaleY = this.owner.scaleX;
    }

    onLevelStart2() {
      this.owner.visible = false;
      this.owner.setPhysics( false );

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