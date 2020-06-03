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
      this.onTick2_ = this.scene.time.addEvent( {
        delay: 500,
        loop: true,
        callback: function () {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
          this.onTick2();
        },
        callbackScope: this,
      } );


      // Initialize properties from parameters.
      this.zombie = instanceProperties[ "zombie" ];
      this.player = ( typeof instanceProperties[ "player" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "player" ], true ) : null;
      this.number_of_zombies_to_spawn = instanceProperties[ "number of zombies to spawn" ];


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
      if ( this.delayed_event2 ) this.delayed_event2.remove();
      if ( this.delayed_event3 ) this.delayed_event3.remove();
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      if ( this.onTick_ ) {
        this.onTick_.remove();
      }
      if ( this.delayed_event4 ) this.delayed_event4.remove();
      if ( this.onTick2_ ) {
        this.onTick2_.remove();
      }

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.visible = false;
    }

    onTick () {
      // Executed after time period of time.
      if (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) != 4) {
        var repeat_end = this.math_random_int( 0, 4 );
        for (var count4 = 0; count4 < repeat_end; count4++) {
          this.create_zombie(  );
        }
      } else if (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) == 4) {
        var repeat_end2 = Math.round(this.number_of_zombies_to_spawn);
        for (var count5 = 0; count5 < repeat_end2; count5++) {
          this.create_zombie(  );
        }
        this.number_of_zombies_to_spawn = this.number_of_zombies_to_spawn + 0.2;
      }
    }

    onTick2 () {
      // Executed after time period of time.
      if (this.game.GLOBAL_VARIABLES.numberOfPlayers == null || this.game.GLOBAL_VARIABLES.numberOfPlayers <= 1) {
      } else {
        this.scene.getChildrenByTag( 'zombie' ).forEach( ( function ( child ) {
          this.scene.messageInstance( child, 'destroy zombie' );
        } ).bind( this ) );
        this.owner.destroySafe();
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
      this.number_of_zombies_to_spawn = 1;
      if (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) != 4) {
        this.delayed_event = this.scene.time.delayedCall( 2000, function() {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
            for (var count = 0; count < 8; count++) {
            this.create_zombie(  );
          }
        }, null, this );
        this.delayed_event2 = this.scene.time.delayedCall( 15000, function() {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
            for (var count2 = 0; count2 < 20; count2++) {
            this.create_zombie(  );
          }
        }, null, this );
        this.delayed_event3 = this.scene.time.delayedCall( 30000, function() {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
            for (var count3 = 0; count3 < 50; count3++) {
            this.create_zombie(  );
          }
        }, null, this );
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

    create_zombie (  ) {
      this.delayed_event4 = this.scene.time.delayedCall( this.math_random_int( 300, 1500 ), function() {
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
        if (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) == 3) {
          if ( !instance ) {
            this.reportError( "`Set Instance X` block could not find the instance [instance]." );
            return;
          }
          instance.posX = this.math_random_int( 1300, 1900 );
          if ( !instance ) {
            this.reportError( "`Set Instance Y` block could not find the instance [instance]." );
            return;
          }
          instance.posY = 50;
        } else if (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) == 4) {
          if ( !instance ) {
            this.reportError( "`Set Instance X` block could not find the instance [instance]." );
            return;
          }
          instance.posX = this.math_random_int( 450, 450 );
          if ( !instance ) {
            this.reportError( "`Set Instance Y` block could not find the instance [instance]." );
            return;
          }
          instance.posY = 50;
        } else if (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) == 5) {
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
        }
      }, null, this );
    }

  }
);