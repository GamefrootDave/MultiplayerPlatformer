Phaserfroot.PluginManager.register(
  "Casing",
  class Casing extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Casing",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.owner.on( this.owner.EVENTS.COLLIDE, this.onTouchInstance2, this );
      this.owner.properties.onUpdate( this.onMessageReceived, this, "_messaging_");


      // Initialize properties from parameters.
      this.toucher = ( typeof instanceProperties[ "toucher" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "toucher" ], true ) : null;
      this.value = instanceProperties[ "value" ];
      this.spin_amount = instanceProperties[ "spin amount" ];
      this.fade = instanceProperties[ "fade" ];


      // Boot phase.

      this.onCreate();

    }

    // BUILT-IN METHODS

    preUpdate () {

    }

    update () {
      this.EVENTS_UPDATE();

    }

    postUpdate () {

    }

    destroy () {
      this.owner.off( "levelSwitch", this.destroy, this );

      // Detach custom event listeners.
      if ( this.delayed_event ) this.delayed_event.remove();
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.owner.off( this.owner.EVENTS.COLLIDE, this.onTouchInstance2, this );

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.tags.add( 'casing' );
      this.spin_amount = this.math_random_int( -50, 50 ) / 10;
      this.owner.body.allowGravity = true;
      this.owner.body.bounce.set( 0.5 );
      this.delayed_event = this.scene.time.delayedCall( 10000, function() {
        if ( !this.owner || this.owner.exists === false ) {
          return;
        }
          this.fade = true;
      }, null, this );
      this.scene.physicsLayersManager.addToLayer( this.owner, 2 );
    }

    executeMessagex_velocity () {
      // Executed when the 'x velocity' is received.
      this.owner.body.velocity.x = this.value;
    }

    executeMessagey_velocity () {
      // Executed when the 'y velocity' is received.
      this.owner.body.velocity.y = this.value;
    }

    EVENTS_UPDATE () {
      // Executed every frame.
      if (this.owner.visible) {
        if (!( this.owner.body.touching.down || this.owner.body.blocked.down )) {
          this.owner.bearing = this.owner.bearing + this.spin_amount;
        }
        if (this.fade) {
          this.owner.scaleX = this.owner.scaleX - 0.02;
          this.owner.scaleY = this.owner.scaleX;
          if (this.owner.scaleX <= 0) {
            if (( this.owner && this.owner.exists )) {
              this.owner.destroySafe();
            }
          }
        }
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

    onLevelStart2() {
      this.owner.visible = false;
      this.owner.setPhysics( false );

    }

    onTouchInstance2 ( instance ) {
      if ( !instance ) {
        return;
      }
      if ( instance instanceof Phaser.Tilemaps.Tile ) {
        instance = instance.layer.tilemapLayer;
      }
      this.toucher = instance;
        this.owner.body.velocity.x = (this.owner.body.velocity.x / 2);
      if (Math.round(this.owner.body.velocity.x) == 0) {
        this.owner.setPhysics( false );
      }

    }

    onMessageReceived ( name, message ) {

      if ( message === 'x velocity' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagex_velocity();
      }

      if ( message === 'y velocity' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagey_velocity();
      }

    }

  }
);