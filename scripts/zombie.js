Phaserfroot.PluginManager.register(
  "Zombie",
  class Zombie extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Zombie",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.owner.properties.onUpdate( this.onMessageReceived, this, "_messaging_");
      this.owner.on( this.owner.EVENTS.COLLIDE, this.onTouchInstance2, this );


      // Initialize properties from parameters.
      this.toucher = ( typeof instanceProperties[ "toucher" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "toucher" ], true ) : null;
      this.player = ( typeof instanceProperties[ "player" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "player" ], true ) : null;
      this.health = instanceProperties[ "health" ];
      this.acceleration_direction = instanceProperties[ "acceleration direction" ];
      this.fading = instanceProperties[ "fading" ];
      this.able_to_be_hurt = instanceProperties[ "able to be hurt" ];


      // Boot phase.
      this.camera = this.scene.cameras.main;
      this.animation_key = this.owner.data.list.animKeyPrefix;
      this.owner.on( "animationrepeat-" + this.animation_key + "hurt", this._hurt__22animationrepeat__222, this );
      this.owner.on( "animationrepeat-" + this.animation_key + "dead", this._dead__22animationrepeat__222, this );

      this.onCreate();

    }

    // BUILT-IN METHODS

    preUpdate () {

    }

    update () {
      this.EVENTS_UPDATE();

    }

    postUpdate () {
      this.EVENTS_POST_UPDATE();

    }

    destroy () {
      this.owner.off( "levelSwitch", this.destroy, this );

      // Detach custom event listeners.
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      if ( this.delayed_event ) this.delayed_event.remove();
      this.owner.off( this.owner.EVENTS.COLLIDE, this.onTouchInstance2, this );
      if ( this.delayed_event2 ) this.delayed_event2.remove();

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.tags.add( 'zombie' );
      if (( this.scene.getChildrenByTag( 'player' )[ 0 ] && this.scene.getChildrenByTag( 'player' )[ 0 ].exists )) {
        this.player = this.scene.getChildrenByTag( 'player' )[ 0 ];
      }
      this.owner.body.allowGravity = true;
      this.owner.body.drag.x = 1000;
      this.owner.body.maxVelocity.x = (this.math_random_int( 180, 280 ));
      // zombies are physics layer 3
      this.scene.physicsLayersManager.addToLayer( this.owner, 3 );
      this.health = this.math_random_int( 5, 20 );
      this.owner.body.bounce.set( (this.math_random_int( 20, 50 ) / 100) );
      this.fading = false;
      if (this.math_random_int( 1, 2 ) > 1) {
        this.acceleration_direction = -1000;
      } else {
        this.acceleration_direction = 1000;
      }
      this.owner.body.acceleration.x = this.acceleration_direction;
      this.able_to_be_hurt = true;
    }

    executeMessagedestroy_zombie () {
      // Executed when the message 'destroy zombie' is received.
      this.health = 1;
      this.get_hurt(  );
    }

    EVENTS_UPDATE () {
      // Executed every frame.
      if (this.health > 0) {
        this.owner.body.acceleration.x = this.acceleration_direction;
        if (( function () {
          var instance1 = this.owner;
          var instance2 = this.player;
          if ( !( instance1 && instance2 ) ) {
            return 0;
          }
          var dx = instance2.x - instance1.x;
          var dy = instance2.y - instance1.y;
          return Math.sqrt( dx * dx + dy * dy );
        } ).call( this ) < 50) {
          if ((this.errorCheckNotNull( this.player, this.owner, "`Get Position Center of Instance` block could not find an instance named [player ].")).x > this.owner.x) {
            this.acceleration_direction = 1000;
          } else if ((this.errorCheckNotNull2( this.player, this.owner, "`Get Position Center of Instance` block could not find an instance named [player ].")).x < this.owner.x) {
            this.acceleration_direction = -1000;
          }
        }
      }
      if (this.owner.body.velocity.x > 50) {
        this.owner.scaleX = 1;
      } else {
        this.owner.scaleX = -1;
      }
      if (this.owner.playing() != 'dead') {
        if (this.owner.playing() != 'hurt') {
          if (( this.owner.body.touching.down || this.owner.body.blocked.down )) {
            if (this.owner.body.velocity.x < -50 || this.owner.body.velocity.x > 50) {
              this.owner.playMy( 'walk' );
            } else {
              this.owner.playMy( 'idle' );
            }
          } else {
            if (this.owner.body.velocity.y < -200) {
              this.owner.playMy( 'jumpUp' );
            } else if (this.owner.body.velocity.y > 200) {
              this.owner.playMy( 'jumpDown' );
            } else {
              this.owner.playMy( 'jumpMid' );
            }
          }
        }
      }
    }

    EVENTS_POST_UPDATE () {
      // Executed every frame.
      if (this.fading) {
        this.owner.alpha = this.owner.alpha - 0.05;
        if (this.owner.alpha <= 0) {
          if (( this.owner && this.owner.exists )) {
            this.owner.destroySafe();
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
      if (( this.scene.getChildrenByTag( 'player' )[ 0 ] && this.scene.getChildrenByTag( 'player' )[ 0 ].exists )) {
        this.player = this.scene.getChildrenByTag( 'player' )[ 0 ];
      }

    }

    onMessageReceived ( name, message ) {

      if ( message === 'destroy zombie' ) {
        this.executeMessagedestroy_zombie();
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

    errorCheckNotNull2( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull3( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull4( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull5( input, backup, message ) {
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
        if ((this.errorCheckNotNull3( this.toucher, this.owner, "`Instance has Tag` block could not find an instance named [toucher].")).tags.has( 'deadly' )) {
        if (this.able_to_be_hurt) {
          this.able_to_be_hurt = false;
          this.health = 1;
          this.get_hurt(  );
        }
      }
      if (this.health <= 0) {
        this.delayed_event = this.scene.time.delayedCall( 500, function() {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
            if (( this.owner.body.touching.down || this.owner.body.blocked.down )) {
            this.owner.setPhysics( false );
          }
        }, null, this );
      }
      if (this.toucher == this.player) {
        if (( this.owner.body.touching.up || this.owner.body.blocked.up )) {
          this.get_hurt(  );
        } else {
          this.owner.body.acceleration.x = 0;
          this.owner.body.velocity.x = 0;
        }
      } else if (!(this.errorCheckNotNull4( this.toucher, this.owner, "`Instance has Tag` block could not find an instance named [toucher].")).tags.has( 'bullet' )) {
        if (this.health > 0) {
          if (( this.owner.body.touching.left || this.owner.body.blocked.left )) {
            this.acceleration_direction = 1000;
            if (this.math_random_int( 1, 6 ) > 4) {
              if (( this.owner.body.touching.down || this.owner.body.blocked.down )) {
                this.acceleration_direction = -1000;
                this.owner.body.velocity.y = (-850);
              }
            }
          } else if (( this.owner.body.touching.right || this.owner.body.blocked.right )) {
            this.acceleration_direction = -1000;
            if (this.math_random_int( 1, 6 ) > 4) {
              if (( this.owner.body.touching.down || this.owner.body.blocked.down )) {
                this.acceleration_direction = 1000;
                this.owner.body.velocity.y = (-850);
              }
            }
          }
        }
      }
      if ((this.errorCheckNotNull5( this.toucher, this.owner, "`Instance has Tag` block could not find an instance named [toucher].")).tags.has( 'bullet' )) {
        if (( this.owner && this.owner.exists )) {
          this.get_hurt(  );
        }
      }

    }

    get_hurt (  ) {
      if (this.health > 0) {
        this.owner.playMy( 'hurt' );
        this.health = this.health - 10;
        this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndDeath' ) ? 'sndDeath' : null );
        var tracker = { k: (this.math_random_int( 15, 25 )) };
        var base = this.camera.offsetY;
        this.scene.tweens.add( {
          targets: tracker,
          props: { k : 0 },
          ease: "Expo.easeOut",
          duration: 0.2 * 1000,
          onUpdate:
            function() {
              this.camera.offsetY = base + tracker.k * Math.sin( this.scene.time.now * 60 / 1000 );
            }.bind( this ),
          onComplete: function() {
            this.camera.offsetY = 0;}.bind( this ) } );
        this.owner.body.velocity.y = (this.math_random_int( -200, -400 ));
        if (( this.owner.body.touching.right || this.owner.body.blocked.right )) {
          this.owner.body.velocity.x = (this.math_random_int( -500, -800 ));
        } else if (( this.owner.body.touching.left || this.owner.body.blocked.left )) {
          this.owner.body.velocity.x = (this.math_random_int( 500, 800 ));
        }
        if (this.health <= 0) {
          this.health = 0;
          this.delayed_event2 = this.scene.time.delayedCall( 10000, function() {
            if ( !this.owner || this.owner.exists === false ) {
              return;
            }
              this.fading = true;
          }, null, this );
          this.owner.tags.remove( 'zombie' );
          this.owner.playMy( 'dead' );
          this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndDeathBass' ) ? 'sndDeathBass' : null );
          this.scene.physicsLayersManager.addToLayer( this.owner, 2 );
          this.owner.body.acceleration.x = 0;
          this.owner.body.acceleration.y = 0;
          this.owner.body.velocity.x = (this.math_random_int( -200, 200 ));
          this.owner.body.velocity.y = (this.math_random_int( -200, -400 ));
          this.scene.messageInstance( this.player, 'flash' );
          if (this.math_random_int( 1, 3 ) > 2) {
            this.scene.messageInstance( this.player, 'explosion', this.owner );
          }
        }
      }
    }

    _hurt__22animationrepeat__222 () {
        if (( this.owner && this.owner.exists )) {
        if (this.health > 0) {
          this.owner.playMy( 'idle' );
        }
      }

    }

    _dead__22animationrepeat__222 () {
        if (( this.owner && this.owner.exists )) {
        this.owner.playFramePrevious();
        this.owner.playStop();
      }

    }

  }
);