Phaserfroot.PluginManager.register(
  "ZombieSpawner",
  class ZombieSpawner extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "ZombieSpawner",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.onTick_ = this.scene.time.addEvent( {
        delay: 3000,
        loop: true,
        callback: function () {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
          this.onTick();
        },
        callbackScope: this,
      } );
      this.owner.properties.onUpdate( this.onMessageReceived, this, "_messaging_");


      // Initialize properties from parameters.
      this.zombie = instanceProperties[ "zombie" ];
      this.player = ( typeof instanceProperties[ "player" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "player" ], true ) : null;


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
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      if ( this.onTick_ ) {
        this.onTick_.remove();
      }
      if ( this.delayed_event2 ) this.delayed_event2.remove();

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.visible = false;
    }

    onTick () {
      // Executed after time period of time.
      var repeat_end = this.math_random_int( 0, 4 );
      for (var count2 = 0; count2 < repeat_end; count2++) {
        this.create_zombie(  );
      }
    }

    executeMessageepic_wave () {
      // Executed when the message 'epic wave' is received.
      var repeat_end2 = this.math_random_int( 15, 20 );
      for (var count3 = 0; count3 < repeat_end2; count3++) {
        this.create_zombie(  );
      }
    }

    executeMessageunbeatable_wave () {
      // Executed when the message 'unbeatable wave' is received.
      var repeat_end3 = this.math_random_int( 80, 100 );
      for (var count4 = 0; count4 < repeat_end3; count4++) {
        this.create_zombie(  );
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

    onLevelStart2() {
      this.zombie = (this.errorCheckNotNull( this.scene.getChildrenByTag( 'zombie' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _zombie_].")).name;
      if ( !this.scene.getChildrenByTag( 'zombie' )[ 0 ] ) {
        this.reportError( "`Destroy` block could not find the instance [scene.getChildrenByTag( _zombie_]." );
        return;
      }
      this.scene.getChildrenByTag( 'zombie' )[ 0 ].destroySafe();
      this.player = this.scene.getChildrenByTag( 'player' )[ 0 ];
      this.delayed_event = this.scene.time.delayedCall( 2000, function() {
        if ( !this.owner || this.owner.exists === false ) {
          return;
        }
          for (var count = 0; count < 8; count++) {
          this.create_zombie(  );
        }
      }, null, this );

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

    create_zombie (  ) {
      this.delayed_event2 = this.scene.time.delayedCall( this.math_random_int( 300, 1500 ), function() {
        if ( !this.owner || this.owner.exists === false ) {
          return;
        }
          this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndPrev' ) ? 'sndPrev' : null );
        var instance = this.scene.addSpriteByName( this.zombie );
        if ( !instance ) {
          this.reportError( "`Change Instance Depth` block could not find the instance [instance]." );
          return;
        }
        if ( !this.player ) {
          this.reportError( "`Change Instance Depth` block could not find the instance [player]." );
          return;
        }
        this.scene.addChildBefore( instance, this.player );
        if ( !instance ) {
          this.reportError( "`Set Instance X` block could not find the instance [instance]." );
          return;
        }
        instance.posX = this.math_random_int( 1600, 1700 );
        if ( !instance ) {
          this.reportError( "`Set Instance Y` block could not find the instance [instance]." );
          return;
        }
        instance.posY = -10;
      }, null, this );
    }

    onMessageReceived ( name, message ) {

      if ( message === 'epic wave' ) {
        this.executeMessageepic_wave();
      }

      if ( message === 'unbeatable wave' ) {
        this.executeMessageunbeatable_wave();
      }

    }

  }
);