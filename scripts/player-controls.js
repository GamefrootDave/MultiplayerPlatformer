Phaserfroot.PluginManager.register(
  "PlayerControls",
  class PlayerControls extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "PlayerControls",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.onTick_ = this.scene.time.addEvent( {
        delay: 100,
        loop: true,
        callback: function () {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
          this.onTick();
        },
        callbackScope: this,
      } );
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.scene.getKey( 68 ).on( "down", this.onKeyInput68, this );
      this.scene.getKey( 68 ).on( "up", this.onKeyInput682, this );
      this.scene.getKey( 65 ).on( "down", this.onKeyInput65, this );
      this.scene.getKey( 65 ).on( "up", this.onKeyInput652, this );
      this.scene.getKey( 38 ).on( "down", this.onKeyInput38, this );
      this.scene.getKey( 39 ).on( "down", this.onKeyInput39, this );
      this.scene.getKey( 39 ).on( "up", this.onKeyInput392, this );
      this.scene.getKey( 37 ).on( "down", this.onKeyInput37, this );
      this.scene.getKey( 37 ).on( "up", this.onKeyInput372, this );
      this.owner.properties.onUpdate( this.onMessageReceived, this, "_messaging_");
      this.owner.on( this.owner.EVENTS.COLLIDE, this.onTouchInstance2, this );


      // Initialize properties from parameters.
      this.value = instanceProperties[ "value" ];
      this.playerID = instanceProperties[ "playerID" ];
      this.victim = instanceProperties[ "victim" ];
      this.playerID_that_shot_me = instanceProperties[ "playerID that shot me" ];
      this.killer = instanceProperties[ "killer" ];
      this.jumpcloud = instanceProperties[ "jumpcloud" ];
      this.explosion = instanceProperties[ "explosion" ];
      this.smoke = instanceProperties[ "smoke" ];
      this.bg_colour = instanceProperties[ "bg colour" ];
      this.toucher = ( typeof instanceProperties[ "toucher" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "toucher" ], true ) : null;
      this.health_bar_outline = ( typeof instanceProperties[ "health bar outline" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "health bar outline" ], true ) : null;
      this.player_name_text = ( typeof instanceProperties[ "player name text" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "player name text" ], true ) : null;
      this.health_bar_white = ( typeof instanceProperties[ "health bar white" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "health bar white" ], true ) : null;
      this.health_bar = ( typeof instanceProperties[ "health bar" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "health bar" ], true ) : null;
      this.health_bar_black = ( typeof instanceProperties[ "health bar black" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "health bar black" ], true ) : null;
      this.scoreboard = ( typeof instanceProperties[ "scoreboard" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "scoreboard" ], true ) : null;
      this.jump = instanceProperties[ "jump" ];
      this.music = instanceProperties[ "music" ];
      this.deaths = instanceProperties[ "deaths" ];
      this.kills = instanceProperties[ "kills" ];
      this.health = instanceProperties[ "health" ];
      this.air_time = instanceProperties[ "air time" ];
      this.max_health = instanceProperties[ "max health" ];
      this.able_to_be_hurt = instanceProperties[ "able to be hurt" ];
      this.able_to_jump = instanceProperties[ "able to jump" ];
      this.I_am_the_host = instanceProperties[ "I am the host" ];


      // Boot phase.
      this.camera = this.scene.cameras.main;
      this.animation_key = this.owner.data.list.animKeyPrefix;
      this.owner.on( "animationrepeat-" + this.animation_key + "dying", this._dying__22animationrepeat__222, this );

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
      if ( this.onTick_ ) {
        this.onTick_.remove();
      }
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      if ( this.delayed_event ) this.delayed_event.remove();
      this.scene.getKey( 68 ).off( "down", this.onKeyInput68, this );
      this.scene.getKey( 68 ).off( "up", this.onKeyInput682, this );
      this.scene.getKey( 65 ).off( "down", this.onKeyInput65, this );
      this.scene.getKey( 65 ).off( "up", this.onKeyInput652, this );
      this.scene.getKey( 38 ).off( "down", this.onKeyInput38, this );
      this.scene.getKey( 39 ).off( "down", this.onKeyInput39, this );
      this.scene.getKey( 39 ).off( "up", this.onKeyInput392, this );
      this.scene.getKey( 37 ).off( "down", this.onKeyInput37, this );
      this.scene.getKey( 37 ).off( "up", this.onKeyInput372, this );
      if ( this.delayed_event2 ) this.delayed_event2.remove();
      if ( this.delayed_event3 ) this.delayed_event3.remove();
      if ( this.delayed_event4 ) this.delayed_event4.remove();
      if ( this.delayed_event5 ) this.delayed_event5.remove();
      if ( this.delayed_event6 ) this.delayed_event6.remove();
      if ( this.delayed_event7 ) this.delayed_event7.remove();
      this.owner.off( this.owner.EVENTS.COLLIDE, this.onTouchInstance2, this );
      if ( this.delayed_event8 ) this.delayed_event8.remove();
      if ( this.delayed_event9 ) this.delayed_event9.remove();
      if ( this.delayed_event10 ) this.delayed_event10.remove();
      if ( this.delayed_event11 ) this.delayed_event11.remove();
      if ( this.delayed_event12 ) this.delayed_event12.remove();
      if ( this.delayed_event13 ) this.delayed_event13.remove();
      if ( this.delayed_event14 ) this.delayed_event14.remove();
      if ( this.delayed_event15 ) this.delayed_event15.remove();

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.tags.add( 'player' );
      this.scene.physics.world.gravity.y = 2000;
      this.owner.body.allowGravity = true;
      this.owner.body.drag.x = 1000;
      this.owner.body.maxVelocity.x = 300;
      this.air_time = 0;
      this.able_to_jump = true;
      this.health = 60;
      this.able_to_be_hurt = true;
      this.max_health = this.health;
      if (this.game.GLOBAL_VARIABLES.hostPlayerID == this.game.GLOBAL_VARIABLES.myPlayerID) {
        this.I_am_the_host = true;
      } else {
        this.I_am_the_host = false;
      }
      this.position_me(  );
    }

    onTick () {
      // Executed after time period of time.
      // we update player info on player input, and also 10 times a second
      this.NETWORK_UPDATE_ON_TICK(  );
    }

    EVENTS_POST_UPDATE () {
      // Executed every frame.
      if ( !this.health_bar_outline ) {
        this.reportError( "`Set Instance X` block could not find the instance [health_bar_outline]." );
        return;
      }
      this.health_bar_outline.posX = this.owner.x - ( (this.errorCheckNotNull4( this.health_bar_outline, this.owner, "`Get width/height of Instance` block could not find an instance named [health_bar_outline].")).width * this.health_bar_outline.scaleX ) / 2;
      if ( !this.health_bar_outline ) {
        this.reportError( "`Set Instance Y` block could not find the instance [health_bar_outline]." );
        return;
      }
      this.health_bar_outline.posY = this.owner.y - 66;
      if ( !this.health_bar_white ) {
        this.reportError( "`Set Instance X` block could not find the instance [health_bar_white]." );
        return;
      }
      this.health_bar_white.posX = (this.errorCheckNotNull5( this.health_bar_outline, this.owner, "`Get Position of Instance` block could not find an instance named [health_bar_outline].")).posX + 3;
      if ( !this.health_bar_white ) {
        this.reportError( "`Set Instance Y` block could not find the instance [health_bar_white]." );
        return;
      }
      this.health_bar_white.posY = (this.errorCheckNotNull6( this.health_bar_outline, this.owner, "`Get Position of Instance` block could not find an instance named [health_bar_outline].")).posY + 3;
      if ( !this.health_bar_black ) {
        this.reportError( "`Set Instance X` block could not find the instance [health_bar_black]." );
        return;
      }
      this.health_bar_black.posX = (this.errorCheckNotNull7( this.health_bar_white, this.owner, "`Get Position of Instance` block could not find an instance named [health_bar_white].")).posX + 3;
      if ( !this.health_bar_black ) {
        this.reportError( "`Set Instance Y` block could not find the instance [health_bar_black]." );
        return;
      }
      this.health_bar_black.posY = (this.errorCheckNotNull8( this.health_bar_white, this.owner, "`Get Position of Instance` block could not find an instance named [health_bar_white].")).posY + 3;
      if ( !this.health_bar ) {
        this.reportError( "`Set Instance X` block could not find the instance [health_bar]." );
        return;
      }
      this.health_bar.posX = (this.errorCheckNotNull9( this.health_bar_black, this.owner, "`Get Position of Instance` block could not find an instance named [health_bar_black].")).posX + 3;
      if ( !this.health_bar ) {
        this.reportError( "`Set Instance Y` block could not find the instance [health_bar]." );
        return;
      }
      this.health_bar.posY = (this.errorCheckNotNull10( this.health_bar_black, this.owner, "`Get Position of Instance` block could not find an instance named [health_bar_black].")).posY + 3;
      if ( !this.health_bar ) {
        this.reportError( "`Set Instance Scale` block could not find the instance [health_bar]." );
        return;
      }
      this.health_bar.scaleX = this.health / this.max_health;
      if ( !this.player_name_text ) {
        this.reportError( "`Set Instance CenterX` block could not find the instance [player_name_text]." );
        return;
      }
      this.player_name_text.x = this.owner.x;
      if ( !this.player_name_text ) {
        this.reportError( "`Set Instance CenterY` block could not find the instance [player_name_text]." );
        return;
      }
      this.player_name_text.y = (this.errorCheckNotNull11( this.health_bar_outline, this.owner, "`Get Position of Instance` block could not find an instance named [health_bar_outline].")).posY - 25;
    }

    EVENTS_UPDATE () {
      // Executed every frame.
      if (!(this.owner.playing() == 'dying') && !(this.owner.playing() == 'dead')) {
        if (( this.owner.body.touching.down || this.owner.body.blocked.down )) {
          if (this.owner.body.velocity.x < -50 || this.owner.body.velocity.x > 50) {
            this.owner.playMy( 'walk' );
          } else {
            this.owner.playMy( 'idle' );
          }
          if (this.air_time > 20) {
            var tracker = { k: (Math.min(Math.max(this.air_time / 2, 5), 20)) };
            var base = this.camera.offsetY;
            this.scene.tweens.add( {
              targets: tracker,
              props: { k : 0 },
              ease: "Expo.easeOut",
              duration: 1 * 1000,
              onUpdate:
                function() {
                  this.camera.offsetY = base + tracker.k * Math.sin( this.scene.time.now * 60 / 1000 );
                }.bind( this ),
              onComplete: function() {
                this.camera.offsetY = 0;}.bind( this ) } );
            this.air_time = 0;
          }
        } else {
          if (this.owner.body.velocity.y < -200) {
            this.owner.playMy( 'jumpUp' );
          } else if (this.owner.body.velocity.y > 200) {
            this.owner.playMy( 'jumpDown' );
            this.air_time = this.air_time + 1;
          } else {
            this.owner.playMy( 'jumpMid' );
          }
        }
        if (( this.scene.getKey( 87 ).isDown || this.scene._keys.lastPressed === 87 ) || ( this.scene.getKey( 38 ).isDown || this.scene._keys.lastPressed === 38 )) {
          if (( this.owner.body.touching.down || this.owner.body.blocked.down )) {
            if (this.able_to_jump) {
              this.able_to_jump = false;
              this.create_jumpcloud(  );
              this.owner.body.velocity.y = (-850);
              this.NETWORK_UPDATE_ON_INPUT(  );
              this.delayed_event = this.scene.time.delayedCall( 500, function() {
                if ( !this.owner || this.owner.exists === false ) {
                  return;
                }
                  this.able_to_jump = true;
              }, null, this );
            }
          }
        }
      }
    }

    onKeyInput68 () {
      if (!(this.owner.playing() == 'dying') && !(this.owner.playing() == 'dead')) {
        if (( this.scene.getKey( 32 ).isDown || this.scene._keys.lastPressed === 32 ) && this.owner.scaleX < 0) {
          this.owner.body.acceleration.x = 1000;
        } else if (( this.scene.getKey( 32 ).isDown || this.scene._keys.lastPressed === 32 ) && this.owner.scaleX > 0) {
          this.owner.body.acceleration.x = 0;
        } else {
          this.owner.scaleX = 1;
          this.owner.body.acceleration.x = 1000;
        }
        this.NETWORK_UPDATE_ON_INPUT(  );
      }
    }

    onKeyInput682 () {
      if (!(this.owner.playing() == 'dying') && !(this.owner.playing() == 'dead')) {
        if (!( this.scene.getKey( 65 ).isDown || this.scene._keys.lastPressed === 65 )) {
          this.owner.body.acceleration.x = 0;
        } else {
          this.owner.body.acceleration.x = (-1000);
        }
        this.NETWORK_UPDATE_ON_INPUT(  );
      }
    }

    onKeyInput65 () {
      if (!(this.owner.playing() == 'dying') && !(this.owner.playing() == 'dead')) {
        if (( this.scene.getKey( 32 ).isDown || this.scene._keys.lastPressed === 32 ) && this.owner.scaleX > 0) {
          this.owner.body.acceleration.x = (-1000);
        } else if (( this.scene.getKey( 32 ).isDown || this.scene._keys.lastPressed === 32 ) && this.owner.scaleX < 0) {
          this.owner.body.acceleration.x = 0;
        } else {
          this.owner.scaleX = -1;
          this.owner.body.acceleration.x = (-1000);
        }
        this.NETWORK_UPDATE_ON_INPUT(  );
      }
    }

    onKeyInput652 () {
      if (!(this.owner.playing() == 'dying') && !(this.owner.playing() == 'dead')) {
        if (!( this.scene.getKey( 68 ).isDown || this.scene._keys.lastPressed === 68 )) {
          this.owner.body.acceleration.x = 0;
        } else {
          this.owner.body.acceleration.x = 1000;
        }
        this.NETWORK_UPDATE_ON_INPUT(  );
      }
    }

    onKeyInput38 () {
      this.scene.getKey( 87 )._key.onDown(
        new KeyboardEvent( "onup", { code: 87 } ) );
    }

    onKeyInput39 () {
      this.scene.getKey( 68 )._key.onDown(
        new KeyboardEvent( "onup", { code: 68 } ) );
    }

    onKeyInput392 () {
      this.scene.getKey( 68 )._key.onUp(
        new KeyboardEvent( "onup", { code: 68 } ) );
    }

    onKeyInput37 () {
      this.scene.getKey( 65 )._key.onDown(
        new KeyboardEvent( "onup", { code: 65 } ) );
    }

    onKeyInput372 () {
      this.scene.getKey( 65 )._key.onUp(
        new KeyboardEvent( "onup", { code: 65 } ) );
    }

    executeMessagerecoil () {
      // Executed when the message 'recoil' is received.
      if (!(this.owner.playing() == 'dying') && !(this.owner.playing() == 'dead')) {
        this.delayed_event2 = this.scene.time.delayedCall( 10, function() {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
            if (this.owner.scaleX > 0) {
            this.owner.body.velocity.x = (this.owner.body.velocity.x - 20);
          } else {
            this.owner.body.velocity.x = (this.owner.body.velocity.x + 20);
          }
          this.NETWORK_UPDATE_ON_INPUT(  );
        }, null, this );
      }
    }

    executeMessageflash () {
      // Executed when the message 'flash' is received.
      this.camera.backgroundColor = Phaser.Display.Color.HexStringToColor( "0xffffff" );
      this.delayed_event3 = this.scene.time.delayedCall( 20, function() {
        if ( !this.owner || this.owner.exists === false ) {
          return;
        }
          this.camera.backgroundColor = Phaser.Display.Color.HexStringToColor( this.bg_colour );
      }, null, this );
    }

    executeMessageexplosion () {
      // Executed when the 'explosion' is received.
      var repeat_end2 = this.math_random_int( 3, 5 );
      for (var count2 = 0; count2 < repeat_end2; count2++) {
        this.spawn_explosion( this.value );
        var repeat_end = this.math_random_int( 3, 5 );
        for (var count = 0; count < repeat_end; count++) {
          this.spawn_smoke( this.value );
        }
      }
    }

    executeMessagebulletHit () {
      // Executed when the 'bulletHit' is received.
      if (this.value[0] == this.game.GLOBAL_VARIABLES.myPlayerID) {
        this.playerID_that_shot_me = this.value[1];
        this.get_hurt(  );
      }
    }

    executeMessagegetPlayerInfo () {
      // Executed when the 'getPlayerInfo' is received.
      if (this.playerID != this.game.GLOBAL_VARIABLES.myPlayerID) {
        this.scene.messageExternal( 'sendToPlayer', [this.playerID, 'getPlayerInfo', this.game.GLOBAL_VARIABLES.myPlayerID, this.owner.x, this.owner.y, this.owner.playing(), this.game.GLOBAL_VARIABLES.hostPlayerID, this.owner.body.velocity.x, this.owner.body.velocity.y, this.owner.scaleX, this.owner.body.acceleration.x, this.owner.body.acceleration.y, this.health, this.game.GLOBAL_VARIABLES.myName, this.kills, this.deaths] );
      }
    }

    executeMessageplayerDead () {
      // Executed when the 'playerDead' is received.
      this.victim = this.value[0];
      this.killer = this.value[11];
      if (this.victim == this.game.GLOBAL_VARIABLES.myPlayerID) {
        this.deaths = this.deaths + 1;
        this.scene.messageInstance( this.scoreboard, 'update scoreboard', [this.game.GLOBAL_VARIABLES.myPlayerID, this.game.GLOBAL_VARIABLES.myName, this.kills, this.deaths] );
      }
      if (this.killer == this.game.GLOBAL_VARIABLES.myPlayerID) {
        this.kills = this.kills + 1;
        this.scene.messageInstance( this.scoreboard, 'update scoreboard', [this.game.GLOBAL_VARIABLES.myPlayerID, this.game.GLOBAL_VARIABLES.myName, this.kills, this.deaths] );
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

    position_me (  ) {
      if (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) == 3) {
        this.owner.posX = this.math_random_int( 300, 1200 );
        this.owner.posY = 50;
      } else if (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) == 4) {
        this.owner.posX = this.math_random_int( 200, 700 );
        this.owner.posY = 140;
      } else if (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) == 5) {
        this.owner.posX = this.math_random_int( 300, 1100 );
        this.owner.posY = 300;
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

    getBackgroundColour () {
      var col = this.camera.backgroundColor;
      var r = col.r;
      var g = col.g;
      var b = col.b;
      var toHex = Phaser.Display.Color.ComponentToHex;
      return "0x" + toHex( r ) + toHex( g ) + toHex( b );
    }

    onLevelStart2() {
      this.deaths = 0;
      this.kills = 0;
      this.jumpcloud = (this.errorCheckNotNull( this.scene.getChildrenByTag( 'jumpcloud' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _jumpclo].")).name;
      this.explosion = (this.errorCheckNotNull2( this.scene.getChildrenByTag( 'explosion' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _explosi].")).name;
      this.smoke = (this.errorCheckNotNull3( this.scene.getChildrenByTag( 'smoke' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _smoke_ ].")).name;
      this.scoreboard = this.scene.getChildrenByTag( 'scoreboard' )[ 0 ];
      this.scene.components.getByName( "SoundManager" )[ 0 ].playMusic( this.owner.scene.game.cache.audio.get( 'music' ) ? 'music' : null );
      this.bg_colour = this.getBackgroundColour();
      this.create_health_bars(  );
      this.set_up_physics_layers(  );
      // Tell other players to spawn me in
      this.scene.messageExternal( 'sendToRoom', [this.game.GLOBAL_VARIABLES.hostRoomName, 'getPlayerInfo', this.game.GLOBAL_VARIABLES.myPlayerID, this.owner.x, this.owner.y, this.owner.playing(), this.game.GLOBAL_VARIABLES.hostPlayerID, this.owner.body.velocity.x, this.owner.body.velocity.y, this.owner.scaleX, this.owner.body.acceleration.x, this.owner.body.acceleration.y, this.health, this.game.GLOBAL_VARIABLES.myName] );

    }

    set_up_physics_layers (  ) {
      // The player handles the physics layers for all objects so it's in one handy place
      this.scene.physicsLayersManager.addToLayer( this.owner, 1 );
      if ( 0 === 1 ) {
        this.owner.scene.physicsLayersManager.layers[ 0 ].setInternalCollisions( true );
      } else {
        this.owner.scene.physicsLayersManager.layers[ 0 ].setExternalCollision( 1, true );
      };
      // casings are layer 2
      if ( 0 === 2 ) {
        this.owner.scene.physicsLayersManager.layers[ 0 ].setInternalCollisions( true );
      } else {
        this.owner.scene.physicsLayersManager.layers[ 0 ].setExternalCollision( 2, true );
      };
      if ( 2 === 2 ) {
        this.owner.scene.physicsLayersManager.layers[ 2 ].setInternalCollisions( false );
      } else {
        this.owner.scene.physicsLayersManager.layers[ 2 ].setExternalCollision( 2, false );
      };
      // zombies are physics layer 3
      if ( 0 === 3 ) {
        this.owner.scene.physicsLayersManager.layers[ 0 ].setInternalCollisions( true );
      } else {
        this.owner.scene.physicsLayersManager.layers[ 0 ].setExternalCollision( 3, true );
      };
      if ( 1 === 3 ) {
        this.owner.scene.physicsLayersManager.layers[ 1 ].setInternalCollisions( true );
      } else {
        this.owner.scene.physicsLayersManager.layers[ 1 ].setExternalCollision( 3, true );
      };
      if ( 3 === 3 ) {
        this.owner.scene.physicsLayersManager.layers[ 3 ].setInternalCollisions( false );
      } else {
        this.owner.scene.physicsLayersManager.layers[ 3 ].setExternalCollision( 3, false );
      };
      // my bullets are physics layer 4
      if ( 0 === 4 ) {
        this.owner.scene.physicsLayersManager.layers[ 0 ].setInternalCollisions( true );
      } else {
        this.owner.scene.physicsLayersManager.layers[ 0 ].setExternalCollision( 4, true );
      };
      if ( 1 === 4 ) {
        this.owner.scene.physicsLayersManager.layers[ 1 ].setInternalCollisions( false );
      } else {
        this.owner.scene.physicsLayersManager.layers[ 1 ].setExternalCollision( 4, false );
      };
      if ( 3 === 4 ) {
        this.owner.scene.physicsLayersManager.layers[ 3 ].setInternalCollisions( true );
      } else {
        this.owner.scene.physicsLayersManager.layers[ 3 ].setExternalCollision( 4, true );
      };
    }

    checkScene( message ) {
      if ( !this.scene.add ) {
        this.game.reportError( message, message, 'SCRIPT ERROR' );
      }
    }

    create_health_bars (  ) {
      this.checkScene( "Create Rectangle block could not create a rectangle, likely because the scene was switched before it could run.\n\nSuggestion: check whether the level has changed before running this section of code." );
      this.health_bar_outline = this.scene.add.rectangle( 0, 0, 102, 24, 0x808080 );
      // Set shape properties to Phaserfroot compatible.
      Phaserfroot.GameObjectTools.setCommonFeatures( this.health_bar_outline );
      this.health_bar_outline.setPhysics( false );
      this.health_bar_outline.anchorX = this.health_bar_outline.displayOriginX;
      this.health_bar_outline.anchorY = this.health_bar_outline.displayOriginY;

      if ( !this.health_bar_outline ) {
        this.reportError( "`Primitive set colour` block could not find an instance named [health_bar_outline]." );
        return;
      }
      var inst = this.health_bar_outline;
      if( inst ) {
        var color = "0x000000";
        inst.setFillStyle( color, inst.alpha );
      }
      this.checkScene( "Create Rectangle block could not create a rectangle, likely because the scene was switched before it could run.\n\nSuggestion: check whether the level has changed before running this section of code." );
      this.health_bar_white = this.scene.add.rectangle( 0, 0, 96, 18, 0x808080 );
      // Set shape properties to Phaserfroot compatible.
      Phaserfroot.GameObjectTools.setCommonFeatures( this.health_bar_white );
      this.health_bar_white.setPhysics( false );
      this.health_bar_white.anchorX = this.health_bar_white.displayOriginX;
      this.health_bar_white.anchorY = this.health_bar_white.displayOriginY;

      if ( !this.health_bar_white ) {
        this.reportError( "`Primitive set colour` block could not find an instance named [health_bar_white]." );
        return;
      }
      var inst = this.health_bar_white;
      if( inst ) {
        var color = "0xffffff";
        inst.setFillStyle( color, inst.alpha );
      }
      this.checkScene( "Create Rectangle block could not create a rectangle, likely because the scene was switched before it could run.\n\nSuggestion: check whether the level has changed before running this section of code." );
      this.health_bar_black = this.scene.add.rectangle( 0, 0, 90, 12, 0x808080 );
      // Set shape properties to Phaserfroot compatible.
      Phaserfroot.GameObjectTools.setCommonFeatures( this.health_bar_black );
      this.health_bar_black.setPhysics( false );
      this.health_bar_black.anchorX = this.health_bar_black.displayOriginX;
      this.health_bar_black.anchorY = this.health_bar_black.displayOriginY;

      if ( !this.health_bar_black ) {
        this.reportError( "`Primitive set colour` block could not find an instance named [health_bar_black]." );
        return;
      }
      var inst = this.health_bar_black;
      if( inst ) {
        var color = "0x000000";
        inst.setFillStyle( color, inst.alpha );
      }
      this.checkScene( "Create Rectangle block could not create a rectangle, likely because the scene was switched before it could run.\n\nSuggestion: check whether the level has changed before running this section of code." );
      this.health_bar = this.scene.add.rectangle( 0, 0, 84, 6, 0x808080 );
      // Set shape properties to Phaserfroot compatible.
      Phaserfroot.GameObjectTools.setCommonFeatures( this.health_bar );
      this.health_bar.setPhysics( false );
      this.health_bar.anchorX = this.health_bar.displayOriginX;
      this.health_bar.anchorY = this.health_bar.displayOriginY;

      if ( !this.health_bar ) {
        this.reportError( "`Primitive set colour` block could not find an instance named [health_bar]." );
        return;
      }
      var inst = this.health_bar;
      if( inst ) {
        var color = "0x33ff33";
        inst.setFillStyle( color, inst.alpha );
      }
      if ( !this.health_bar ) {
        this.reportError( "`Change Instance Depth` block could not find the instance [health_bar]." );
        return;
      }
      this.scene.addChildAfter( this.health_bar, this.owner );
      if ( !this.health_bar_black ) {
        this.reportError( "`Change Instance Depth` block could not find the instance [health_bar_black]." );
        return;
      }
      this.scene.addChildAfter( this.health_bar_black, this.owner );
      if ( !this.health_bar_white ) {
        this.reportError( "`Change Instance Depth` block could not find the instance [health_bar_white]." );
        return;
      }
      this.scene.addChildAfter( this.health_bar_white, this.owner );
      if ( !this.health_bar_outline ) {
        this.reportError( "`Change Instance Depth` block could not find the instance [health_bar_outline]." );
        return;
      }
      this.scene.addChildAfter( this.health_bar_outline, this.owner );
      if ( !this.health_bar ) {
        this.reportError( "`Set Instance Anchor Point` block could not find the instance [health_bar]." );
        return;
      }
      this.health_bar.anchorX = 0;
      this.checkScene( "Create Text block did not work, likely because the level changed before it was triggered.\n\nSuggestion: check whether the level has changed before running this section of code." );
      this.player_name_text = this.scene.addText( { x: 0, y: 0, textText: this.game.GLOBAL_VARIABLES.myName } );
      if ( !this.player_name_text ) {
        this.reportError( "`Set Text Alignment` block could not find an instance called [player_name_text]." );
        return;
      }
      if ( !this.player_name_text.setAlign ) {
        this.reportError( "`Set Text Alignment` block could not find text alignment information on an instance called [player_name_text]." );
        return;
      }
      this.player_name_text.setAlign( "center" );
      if ( this.player_name_text.width === 0 ) {
        this.player_name_text.width = 1;
        this.player_name_text.displayOriginX = this.player_name_text.width * 0.5;
        this.player_name_text.width = 0;
      } else {
        this.player_name_text.displayOriginX = this.player_name_text.width * 0.5;
      }
      if ( !this.player_name_text ) {
        this.reportError( "`Set Text Colour` block could not find an instance called [player_name_text]." );
        return;
      }
      if ( !this.player_name_text.setColor ) {
        this.reportError( "`Set Text Colour` block could not find text color information on an instance called [player_name_text]." );
        return;
      }
      this.player_name_text.setColor( "0xffffff".replace( /^0x/, "#" ) );
      if ( !this.player_name_text ) {
        this.reportError( "`Set Text Numeric` block could not find an instance called [player_name_text]." );
        return;
      }
      if ( !this.player_name_text.setFontSize ) {
        this.reportError( "`Set Text Numeric` block could not find text properties on an instance called [player_name_text]." );
        return;
      }
      this.player_name_text.setFontSize( 24 );
      if ( !this.player_name_text ) {
        this.reportError( "`Set Text Family` block could not find an instance called [player_name_text]." );
        return;
      }
      if ( !this.player_name_text.setFontFamily ) {
        this.reportError( "`Set Text Family` block could not find font information on an instance called [player_name_text]." );
        return;
      }
      this.player_name_text.setFontFamily( "'Arial Black', sans-serif" );
      if ( !this.player_name_text ) {
        this.reportError( "`Set Text Weight` block could not find an instance called [player_name_text]." );
        return;
      }
      if ( !this.player_name_text.setFontStyle ) {
        this.reportError( "`Set Text Weight` block could not find font information on an instance called [player_name_text]." );
        return;
      }
      this.player_name_text.setFontStyle( "bold" );
      if ( !this.player_name_text ) {
        this.reportError( "`Change Instance Depth` block could not find the instance [player_name_text]." );
        return;
      }
      this.scene.addChildAfter( this.player_name_text, this.owner );
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

    errorCheckNotNull6( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull7( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull8( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull9( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull10( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull11( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    NETWORK_UPDATE_ON_INPUT (  ) {
      this.scene.messageExternal( 'sendToRoom', [this.game.GLOBAL_VARIABLES.hostRoomName, 'updatePlayer', this.game.GLOBAL_VARIABLES.myPlayerID, this.owner.x, this.owner.y, this.owner.playing(), this.game.GLOBAL_VARIABLES.hostPlayerID, this.owner.body.velocity.x, this.owner.body.velocity.y, this.owner.scaleX, this.owner.body.acceleration.x, this.owner.body.acceleration.y, this.health] );
    }

    NETWORK_UPDATE_ON_TICK (  ) {
      this.scene.messageExternal( 'sendToRoom', [this.game.GLOBAL_VARIABLES.hostRoomName, 'tickPlayer', this.game.GLOBAL_VARIABLES.myPlayerID, this.owner.x, this.owner.y, this.owner.playing(), this.game.GLOBAL_VARIABLES.hostPlayerID, this.owner.body.velocity.x, this.owner.body.velocity.y, this.owner.scaleX, this.owner.body.acceleration.x, this.owner.body.acceleration.y, this.health] );
    }

    create_jumpcloud (  ) {
      this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndJump' ) ? 'sndJump' : null );
      var instance = this.scene.addSpriteByName( this.jumpcloud );
      if ( !instance ) {
        this.reportError( "`Change Instance Depth` block could not find the instance [instance]." );
        return;
      }
      this.scene.addChildAfter( instance, this.owner );
      if ( !instance ) {
        this.reportError( "`Set Instance X` block could not find the instance [instance]." );
        return;
      }
      instance.posX = this.owner.posX;
      if ( !instance ) {
        this.reportError( "`Set Instance Y` block could not find the instance [instance]." );
        return;
      }
      instance.posY = this.owner.posY;
    }

    onMessageReceived ( name, message ) {

      if ( message === 'recoil' ) {
        this.executeMessagerecoil();
      }

      if ( message === 'flash' ) {
        this.executeMessageflash();
      }

      if ( message === 'explosion' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageexplosion();
      }

      if ( message === 'bulletHit' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagebulletHit();
      }

      if ( message === 'getPlayerInfo' ) {
        this.playerID = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagegetPlayerInfo();
      }

      if ( message === 'playerDead' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageplayerDead();
      }

    }

    errorCheckNotNull12( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull13( input, backup, message ) {
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
        if ((this.errorCheckNotNull12( this.toucher, this.owner, "`Instance has Tag` block could not find an instance named [toucher].")).tags.has( 'zombie' )) {
        if (this.able_to_be_hurt) {
          if (( this.owner.body.touching.left || this.owner.body.blocked.left ) || ( this.owner.body.touching.right || this.owner.body.blocked.right )) {
            this.get_hurt(  );
            this.able_to_be_hurt = false;
            if ( !this.health_bar ) {
              this.reportError( "`Primitive set colour` block could not find an instance named [health_bar]." );
              return;
            }
            var inst = this.health_bar;
            if( inst ) {
              var color = "0xff0000";
              inst.setFillStyle( color, inst.alpha );
            }
            this.delayed_event4 = this.scene.time.delayedCall( 100, function() {
              if ( !this.owner || this.owner.exists === false ) {
                return;
              }
                if ( !this.health_bar ) {
                this.reportError( "`Primitive set colour` block could not find an instance named [health_bar]." );
                return;
              }
              var inst = this.health_bar;
              if( inst ) {
                var color = "0x33ff33";
                inst.setFillStyle( color, inst.alpha );
              }
            }, null, this );
            this.delayed_event5 = this.scene.time.delayedCall( 200, function() {
              if ( !this.owner || this.owner.exists === false ) {
                return;
              }
                if ( !this.health_bar ) {
                this.reportError( "`Primitive set colour` block could not find an instance named [health_bar]." );
                return;
              }
              var inst = this.health_bar;
              if( inst ) {
                var color = "0xff0000";
                inst.setFillStyle( color, inst.alpha );
              }
            }, null, this );
            this.delayed_event6 = this.scene.time.delayedCall( 300, function() {
              if ( !this.owner || this.owner.exists === false ) {
                return;
              }
                if ( !this.health_bar ) {
                this.reportError( "`Primitive set colour` block could not find an instance named [health_bar]." );
                return;
              }
              var inst = this.health_bar;
              if( inst ) {
                var color = "0x33ff33";
                inst.setFillStyle( color, inst.alpha );
              }
            }, null, this );
            this.delayed_event7 = this.scene.time.delayedCall( 400, function() {
              if ( !this.owner || this.owner.exists === false ) {
                return;
              }
                this.able_to_be_hurt = true;
            }, null, this );
          }
        }
      }
      if ((this.errorCheckNotNull13( this.toucher, this.owner, "`Instance has Tag` block could not find an instance named [toucher].")).tags.has( 'deadly' )) {
        if (this.health > 0) {
          this.health = 1;
          this.get_hurt(  );
        }
      }

    }

    get_hurt (  ) {
      if (this.health > 0) {
        this.health = this.health - 4;
        this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndDeathBass' ) ? 'sndDeathBass' : null );
        var tracker2 = { k: 60 };
        var base2 = this.camera.offsetX;
        this.scene.tweens.add( {
          targets: tracker2,
          props: { k : 0 },
          ease: "Expo.easeOut",
          duration: 0.7 * 1000,
          onUpdate:
            function() {
              this.camera.offsetX = base2 + tracker2.k * Math.sin( this.scene.time.now * 60 / 1000 );
            }.bind( this ),
          onComplete: function() {
            this.camera.offsetX = 0;}.bind( this ) } );
        this.owner.body.velocity.y = (-100);
        this.camera.backgroundColor = Phaser.Display.Color.HexStringToColor( "0xff0000" );
        if ( this.owner.setTint ) {
          this.owner.setTint( "0xff0000" );
        }
        this.delayed_event8 = this.scene.time.delayedCall( 50, function() {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
            this.camera.backgroundColor = Phaser.Display.Color.HexStringToColor( this.bg_colour );
          this.owner.clearTint();
        }, null, this );
        if (( this.owner.body.touching.right || this.owner.body.blocked.right )) {
          this.owner.body.velocity.x = (-500);
        } else if (( this.owner.body.touching.left || this.owner.body.blocked.left )) {
          this.owner.body.velocity.x = 500;
        }
        if (this.health <= 0) {
          var tracker3 = { k: 100 };
          var base3 = this.camera.offsetX;
          this.scene.tweens.add( {
            targets: tracker3,
            props: { k : 0 },
            ease: "Expo.easeOut",
            duration: 2 * 1000,
            onUpdate:
              function() {
                this.camera.offsetX = base3 + tracker3.k * Math.sin( this.scene.time.now * 60 / 1000 );
              }.bind( this ),
            onComplete: function() {
              this.camera.offsetX = 0;}.bind( this ) } );
          var tracker4 = { k: 50 };
          var base4 = this.camera.offsetY;
          this.scene.tweens.add( {
            targets: tracker4,
            props: { k : 0 },
            ease: "Expo.easeOut",
            duration: 1 * 1000,
            onUpdate:
              function() {
                this.camera.offsetY = base4 + tracker4.k * Math.sin( this.scene.time.now * 60 / 1000 );
              }.bind( this ),
            onComplete: function() {
              this.camera.offsetY = 0;}.bind( this ) } );
          this.scene.broadcast( 'player dead', this.owner );
          this.owner.playMy( 'dying' );
          this.scene.components.getByName( "SoundManager" )[ 0 ].setPauseMusic( true );
          this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndDeathPlayer' ) ? 'sndDeathPlayer' : null );
          this.owner.body.acceleration.x = 0;
          this.owner.body.velocity.y = (-500);
          if (( this.owner.body.touching.right || this.owner.body.blocked.right )) {
            this.owner.body.velocity.x = (-500);
          } else if (( this.owner.body.touching.left || this.owner.body.blocked.left )) {
            this.owner.body.velocity.x = 500;
          }
          this.camera.backgroundColor = Phaser.Display.Color.HexStringToColor( "0xff0000" );
          this.scene.messageExternal( 'sendToRoom', [this.game.GLOBAL_VARIABLES.hostRoomName, 'playerDead', this.game.GLOBAL_VARIABLES.myPlayerID, this.owner.x, this.owner.y, this.owner.playing(), this.game.GLOBAL_VARIABLES.hostPlayerID, this.owner.body.velocity.x, this.owner.body.velocity.y, this.owner.scaleX, this.owner.body.acceleration.x, this.owner.body.acceleration.y, this.health, this.playerID_that_shot_me] );
          if ( !this.player_name_text ) {
            this.reportError( "`Set Instance Visibility` block could not find the instance [player_name_text]." );
            return;
          }
          this.player_name_text.visible = false;
          if ( !this.health_bar ) {
            this.reportError( "`Set Instance Visibility` block could not find the instance [health_bar]." );
            return;
          }
          this.health_bar.visible = false;
          if ( !this.health_bar_black ) {
            this.reportError( "`Set Instance Visibility` block could not find the instance [health_bar_black]." );
            return;
          }
          this.health_bar_black.visible = false;
          if ( !this.health_bar_outline ) {
            this.reportError( "`Set Instance Visibility` block could not find the instance [health_bar_outline]." );
            return;
          }
          this.health_bar_outline.visible = false;
          if ( !this.health_bar_white ) {
            this.reportError( "`Set Instance Visibility` block could not find the instance [health_bar_white]." );
            return;
          }
          this.health_bar_white.visible = false;
          this.delayed_event12 = this.scene.time.delayedCall( 100, function() {
            if ( !this.owner || this.owner.exists === false ) {
              return;
            }
              this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndDeathBass' ) ? 'sndDeathBass' : null );
            this.camera.backgroundColor = Phaser.Display.Color.HexStringToColor( "0x000000" );
            this.delayed_event11 = this.scene.time.delayedCall( 100, function() {
              if ( !this.owner || this.owner.exists === false ) {
                return;
              }
                this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndDeathBass' ) ? 'sndDeathBass' : null );
              this.camera.backgroundColor = Phaser.Display.Color.HexStringToColor( "0xff0000" );
              this.delayed_event10 = this.scene.time.delayedCall( 100, function() {
                if ( !this.owner || this.owner.exists === false ) {
                  return;
                }
                  this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndDeathBass' ) ? 'sndDeathBass' : null );
                this.camera.backgroundColor = Phaser.Display.Color.HexStringToColor( "0x000000" );
                this.delayed_event9 = this.scene.time.delayedCall( 100, function() {
                  if ( !this.owner || this.owner.exists === false ) {
                    return;
                  }
                    this.camera.backgroundColor = Phaser.Display.Color.HexStringToColor( "0xff0000" );
                  this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndDeathBass' ) ? 'sndDeathBass' : null );
                }, null, this );
              }, null, this );
            }, null, this );
          }, null, this );
          this.delayed_event13 = this.scene.time.delayedCall( 4000, function() {
            if ( !this.owner || this.owner.exists === false ) {
              return;
            }
              this.respawn(  );
            this.scene.broadcast( 'player alive', this.owner );
            this.scene.messageExternal( 'sendToRoom', [this.game.GLOBAL_VARIABLES.hostRoomName, 'playerRespawn', this.game.GLOBAL_VARIABLES.myPlayerID, this.owner.x, this.owner.y, this.owner.playing(), this.game.GLOBAL_VARIABLES.hostPlayerID, this.owner.body.velocity.x, this.owner.body.velocity.y, this.owner.scaleX, this.owner.body.acceleration.x, this.owner.body.acceleration.y, this.health] );
          }, null, this );
        }
        this.NETWORK_UPDATE_ON_INPUT(  );
      }
    }

    _dying__22animationrepeat__222 () {
        this.owner.playMy( 'dead' );

    }

    errorCheckNotNull14( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull15( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    spawn_explosion ( object ) {
      this.delayed_event14 = this.scene.time.delayedCall( this.math_random_int( 10, 250 ), function() {
        if ( !this.owner || this.owner.exists === false ) {
          return;
        }
          var instance = this.scene.addSpriteByName( this.explosion );
        if ( !instance ) {
          this.reportError( "`Set Instance CenterX` block could not find the instance [instance]." );
          return;
        }
        instance.x = (this.errorCheckNotNull14( object, this.owner, "`Get Position Center of Instance` block could not find an instance named [object ].")).x + this.math_random_int( -80, 80 );
        if ( !instance ) {
          this.reportError( "`Set Instance CenterY` block could not find the instance [instance]." );
          return;
        }
        instance.y = (this.errorCheckNotNull15( object, this.owner, "`Get Position Center of Instance` block could not find an instance named [object ].")).y + this.math_random_int( -80, 80 );
      }, null, this );
    }

    errorCheckNotNull16( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull17( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    spawn_smoke ( object ) {
      this.delayed_event15 = this.scene.time.delayedCall( this.math_random_int( 200, 400 ), function() {
        if ( !this.owner || this.owner.exists === false ) {
          return;
        }
          var instance = this.scene.addSpriteByName( this.smoke );
        if ( !instance ) {
          this.reportError( "`Set Instance CenterX` block could not find the instance [instance]." );
          return;
        }
        instance.x = (this.errorCheckNotNull16( object, this.owner, "`Get Position Center of Instance` block could not find an instance named [object ].")).x + this.math_random_int( -80, 80 );
        if ( !instance ) {
          this.reportError( "`Set Instance CenterY` block could not find the instance [instance]." );
          return;
        }
        instance.y = (this.errorCheckNotNull17( object, this.owner, "`Get Position Center of Instance` block could not find an instance named [object ].")).y + this.math_random_int( -80, 80 );
      }, null, this );
    }

    respawn (  ) {
      if ( !this.player_name_text ) {
        this.reportError( "`Set Instance Visibility` block could not find the instance [player_name_text]." );
        return;
      }
      this.player_name_text.visible = true;
      if ( !this.health_bar ) {
        this.reportError( "`Set Instance Visibility` block could not find the instance [health_bar]." );
        return;
      }
      this.health_bar.visible = true;
      if ( !this.health_bar_black ) {
        this.reportError( "`Set Instance Visibility` block could not find the instance [health_bar_black]." );
        return;
      }
      this.health_bar_black.visible = true;
      if ( !this.health_bar_outline ) {
        this.reportError( "`Set Instance Visibility` block could not find the instance [health_bar_outline]." );
        return;
      }
      this.health_bar_outline.visible = true;
      if ( !this.health_bar_white ) {
        this.reportError( "`Set Instance Visibility` block could not find the instance [health_bar_white]." );
        return;
      }
      this.health_bar_white.visible = true;
      this.owner.playMy( 'idle' );
      this.scene.components.getByName( "SoundManager" )[ 0 ].setPauseMusic( false );
      this.health = this.max_health;
      this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndNext' ) ? 'sndNext' : null );
      this.camera.backgroundColor = Phaser.Display.Color.HexStringToColor( this.bg_colour );
      this.position_me(  );
      this.owner.body.velocity.y = 0;
      this.owner.body.velocity.x = 0;
      this.owner.body.acceleration.x = 0;
      this.owner.body.acceleration.y = 0;
      this.NETWORK_UPDATE_ON_INPUT(  );
      this.scene.getChildrenByTag( 'zombie' ).forEach( ( function ( child ) {
        this.scene.messageInstance( child, 'destroy zombie' );
      } ).bind( this ) );
    }

  }
);