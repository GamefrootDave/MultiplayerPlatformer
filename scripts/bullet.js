Phaserfroot.PluginManager.register(
  "Bullet",
  class Bullet extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Bullet",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.properties.onUpdate( this.onMessageReceived, this, "_messaging_");
      this.owner.on( this.owner.EVENTS.COLLIDE, this.onTouchInstance2, this );


      // Initialize properties from parameters.
      this.value = instanceProperties[ "value" ];
      this.toucher = ( typeof instanceProperties[ "toucher" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "toucher" ], true ) : null;
      this.gun = ( typeof instanceProperties[ "gun" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "gun" ], true ) : null;


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
      if ( this.delayed_event ) this.delayed_event.remove();
      this.owner.off( this.owner.EVENTS.COLLIDE, this.onTouchInstance2, this );

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.tags.add( 'bullet' );
      this.owner.setPhysics( false );
      // our bullets are physics layer 4, so we won't collide with them
      this.scene.physicsLayersManager.addToLayer( this.owner, 4 );
      this.owner.visible = false;
    }

    executeMessagex_velocity () {
      // Executed when the 'x velocity' is received.
      this.owner.visible = true;
      this.owner.setPhysics( true );
      this.owner.body.velocity.x = this.value;
      this.delayed_event = this.scene.time.delayedCall( 4000, function() {
        if ( !this.owner || this.owner.exists === false ) {
          return;
        }
          this.owner.destroySafe();
      }, null, this );
    }

    executeMessagey_velocity () {
      // Executed when the 'y velocity' is received.
      this.owner.body.velocity.y = this.value;
    }

    executeMessagegun () {
      // Executed when the 'gun' is received.
      this.gun = this.value;
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

      if ( message === 'gun' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagegun();
      }

    }

    reportError( message ) {
      message = "(" + this.name.replace( /_[\d]+$/, "" ) + ")" + message;
      console.trace( message );
      this.game.reportError( message, message, "SCRIPT ERROR" );
    }

    errorCheckNotNull( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    onTouchInstance2 ( instance ) {
      if ( !instance ) {
        return;
      }
      if ( instance instanceof Phaser.Tilemaps.Tile ) {
        instance = instance.layer.tilemapLayer;
      }
      this.toucher = instance;
        if (!(this.errorCheckNotNull( this.toucher, this.owner, "`Instance has Tag` block could not find an instance named [toucher].")).tags.has( 'bullet' )) {
        if (( this.owner.body.touching.left || this.owner.body.blocked.left )) {
          this.scene.messageInstance( this.gun, 'sparks left', this.owner );
        } else if (( this.owner.body.touching.right || this.owner.body.blocked.right )) {
          this.scene.messageInstance( this.gun, 'sparks right', this.owner );
        } else if (( this.owner.body.touching.down || this.owner.body.blocked.down )) {
          this.scene.messageInstance( this.gun, 'sparks bottom', this.owner );
        }
        this.owner.destroySafe();
      }

    }

  }
);