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
      this.jumpcloud = instanceProperties[ "jumpcloud" ];
      this.explosion = instanceProperties[ "explosion" ];
      this.smoke = instanceProperties[ "smoke" ];
      this.bg_colour = instanceProperties[ "bg colour" ];
      this.I_am_the_host = instanceProperties[ "I am the host" ];
      this.able_to_be_hurt = instanceProperties[ "able to be hurt" ];
      this.able_to_jump = instanceProperties[ "able to jump" ];
      this.toucher = ( typeof instanceProperties[ "toucher" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "toucher" ], true ) : null;
      this.health_bar_outline = ( typeof instanceProperties[ "health bar outline" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "health bar outline" ], true ) : null;
      this.health_bar_white = ( typeof instanceProperties[ "health bar white" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "health bar white" ], true ) : null;
      this.health_bar_black = ( typeof instanceProperties[ "health bar black" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "health bar black" ], true ) : null;
      this.health_bar = ( typeof instanceProperties[ "health bar" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "health bar" ], true ) : null;
      this.jump = instanceProperties[ "jump" ];
      this.music = instanceProperties[ "music" ];
      this.health = instanceProperties[ "health" ];
      this.air_time = instanceProperties[ "air time" ];
      this.max_health = instanceProperties[ "max health" ];


      // Boot phase.
      this.camera = this.scene.cameras.main;
      this.animation_key = this.owner.data.list.animKeyPrefix;
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
      this.health = 100;
      this.able_to_be_hurt = true;
      this.max_health = this.health;
      if (this.game.GLOBAL_VARIABLES.hostPlayerID == this.game.GLOBAL_VARIABLES.myPlayerID) {
        this.I_am_the_host = true;
        this.owner.posX = 100;
      } else {
        this.I_am_the_host = false;
        this.owner.posX = 800;
      }
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
    }

    EVENTS_UPDATE () {
      // Executed every frame.
      if (!(this.owner.playing() == 'dead')) {
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
      if (this.I_am_the_host) {
        this.scene.messageExternal( 'sendToRoom', [this.game.GLOBAL_VARIABLES.hostRoomName, 'positionPlayer1', this.game.GLOBAL_VARIABLES.myPlayerID, this.owner.x, this.owner.y, this.owner.playing(), this.game.GLOBAL_VARIABLES.hostPlayerID, this.owner.body.velocity.x, this.owner.body.velocity.y, this.owner.scaleX] );
      } else {
        this.scene.messageExternal( 'sendToRoom', [this.game.GLOBAL_VARIABLES.hostRoomName, 'positionPlayer2', this.game.GLOBAL_VARIABLES.myPlayerID, this.owner.x, this.owner.y, this.owner.playing(), this.game.GLOBAL_VARIABLES.hostPlayerID, this.owner.body.velocity.x, this.owner.body.velocity.y, this.owner.scaleX] );
      }
    }

    onKeyInput68 () {
      if (!(this.owner.playing() == 'dead')) {
        this.owner.scaleX = 1;
        this.owner.body.acceleration.x = 1000;
      }
    }

    onKeyInput682 () {
      if (!(this.owner.playing() == 'dead')) {
        if (!( this.scene.getKey( 65 ).isDown || this.scene._keys.lastPressed === 65 )) {
          this.owner.body.acceleration.x = 0;
        } else {
          this.owner.scaleX = -1;
          this.owner.body.acceleration.x = (-1000);
        }
      }
    }

    onKeyInput65 () {
      if (!(this.owner.playing() == 'dead')) {
        this.owner.scaleX = -1;
        this.owner.body.acceleration.x = (-1000);
      }
    }

    onKeyInput652 () {
      if (!(this.owner.playing() == 'dead')) {
        if (!( this.scene.getKey( 68 ).isDown || this.scene._keys.lastPressed === 68 )) {
          this.owner.body.acceleration.x = 0;
        } else {
          this.owner.scaleX = 1;
          this.owner.body.acceleration.x = 1000;
        }
      }
    }

    onKeyInput38 () {
      if (!(this.owner.playing() == 'dead')) {
        if (( this.owner.body.touching.down || this.owner.body.blocked.down )) {
          this.owner.body.velocity.y = (-850);
        }
      }
    }

    onKeyInput39 () {
      if (!(this.owner.playing() == 'dead')) {
        this.owner.scaleX = 1;
        this.owner.body.acceleration.x = 1000;
      }
    }

    onKeyInput392 () {
      if (!(this.owner.playing() == 'dead')) {
        if (!( this.scene.getKey( 37 ).isDown || this.scene._keys.lastPressed === 37 )) {
          this.owner.body.acceleration.x = 0;
        } else {
          this.owner.scaleX = -1;
          this.owner.body.acceleration.x = (-1000);
        }
      }
    }

    onKeyInput37 () {
      if (!(this.owner.playing() == 'dead')) {
        this.owner.scaleX = -1;
        this.owner.body.acceleration.x = (-1000);
      }
    }

    onKeyInput372 () {
      if (!(this.owner.playing() == 'dead')) {
        if (!( this.scene.getKey( 39 ).isDown || this.scene._keys.lastPressed === 39 )) {
          this.owner.body.acceleration.x = 0;
        } else {
          this.owner.scaleX = 1;
          this.owner.body.acceleration.x = 1000;
        }
      }
    }

    executeMessagerecoil () {
      // Executed when the message 'recoil' is received.
      if (!(this.owner.playing() == 'dead')) {
        this.delayed_event2 = this.scene.time.delayedCall( 10, function() {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
            if (this.owner.scaleX > 0) {
            this.owner.body.velocity.x = (-80);
          } else {
            this.owner.body.velocity.x = 80;
          }
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
      if (this.value != this.game.GLOBAL_VARIABLES.myPlayerID) {
        this.get_hurt(  );
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
      this.jumpcloud = (this.errorCheckNotNull( this.scene.getChildrenByTag( 'jumpcloud' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _jumpclo].")).name;
      if ( !this.scene.getChildrenByTag( 'jumpcloud' )[ 0 ] ) {
        this.reportError( "`Destroy` block could not find the instance [scene.getChildrenByTag( _jumpclo]." );
        return;
      }
      this.scene.getChildrenByTag( 'jumpcloud' )[ 0 ].destroySafe();
      this.explosion = (this.errorCheckNotNull2( this.scene.getChildrenByTag( 'explosion' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _explosi].")).name;
      if ( !this.scene.getChildrenByTag( 'explosion' )[ 0 ] ) {
        this.reportError( "`Destroy` block could not find the instance [scene.getChildrenByTag( _explosi]." );
        return;
      }
      this.scene.getChildrenByTag( 'explosion' )[ 0 ].destroySafe();
      this.smoke = (this.errorCheckNotNull3( this.scene.getChildrenByTag( 'smoke' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _smoke_ ].")).name;
      if ( !this.scene.getChildrenByTag( 'smoke' )[ 0 ] ) {
        this.reportError( "`Destroy` block could not find the instance [scene.getChildrenByTag( _smoke_ ]." );
        return;
      }
      this.scene.getChildrenByTag( 'smoke' )[ 0 ].destroySafe();
      this.scene.components.getByName( "SoundManager" )[ 0 ].playMusic( this.owner.scene.game.cache.audio.get( 'music' ) ? 'music' : null );
      this.scene.components.getByName( "SoundManager" )[ 0 ].volume = ( 10/ 100 )
      this.bg_colour = this.getBackgroundColour();
      this.create_health_bars(  );
      this.set_up_physics_layers(  );

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

    }

    errorCheckNotNull11( input, backup, message ) {
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
        if ((this.errorCheckNotNull11( this.toucher, this.owner, "`Instance has Tag` block could not find an instance named [toucher].")).tags.has( 'zombie' )) {
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

    }

    get_hurt (  ) {
      if (this.health > 0) {
        this.health = this.health - 10;
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
        this.delayed_event8 = this.scene.time.delayedCall( 20, function() {
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
          this.owner.playMy( 'dead' );
          this.owner.playStop();
          this.scene.components.getByName( "SoundManager" )[ 0 ].setPauseMusic( true );
          this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndDeathPlayer' ) ? 'sndDeathPlayer' : null );
          this.scene.physicsLayersManager.addToLayer( this.owner, 2 );
          this.owner.body.acceleration.x = 0;
          this.scene.physics.world.gravity.y = 400;
          this.owner.body.velocity.y = (-500);
          if (( this.owner.body.touching.right || this.owner.body.blocked.right )) {
            this.owner.body.velocity.x = (-500);
          } else if (( this.owner.body.touching.left || this.owner.body.blocked.left )) {
            this.owner.body.velocity.x = 500;
          }
          this.camera.backgroundColor = Phaser.Display.Color.HexStringToColor( "0xff0000" );
          this.delayed_event13 = this.scene.time.delayedCall( 100, function() {
            if ( !this.owner || this.owner.exists === false ) {
              return;
            }
              this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndDeathBass' ) ? 'sndDeathBass' : null );
            this.camera.backgroundColor = Phaser.Display.Color.HexStringToColor( "0x000000" );
            this.delayed_event12 = this.scene.time.delayedCall( 100, function() {
              if ( !this.owner || this.owner.exists === false ) {
                return;
              }
                this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndDeathBass' ) ? 'sndDeathBass' : null );
              this.camera.backgroundColor = Phaser.Display.Color.HexStringToColor( "0xff0000" );
              this.delayed_event11 = this.scene.time.delayedCall( 100, function() {
                if ( !this.owner || this.owner.exists === false ) {
                  return;
                }
                  this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndDeathBass' ) ? 'sndDeathBass' : null );
                this.camera.backgroundColor = Phaser.Display.Color.HexStringToColor( "0x000000" );
                this.delayed_event10 = this.scene.time.delayedCall( 100, function() {
                  if ( !this.owner || this.owner.exists === false ) {
                    return;
                  }
                    this.camera.backgroundColor = Phaser.Display.Color.HexStringToColor( "0xff0000" );
                  this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndDeathBass' ) ? 'sndDeathBass' : null );
                  this.owner.playFrameNext();
                  this.delayed_event9 = this.scene.time.delayedCall( 500, function() {
                    if ( !this.owner || this.owner.exists === false ) {
                      return;
                    }
                      this.owner.playFrameNext();
                  }, null, this );
                }, null, this );
              }, null, this );
            }, null, this );
          }, null, this );
        }
      }
    }

    _dead__22animationrepeat__222 () {
        this.owner.playFramePrevious();
      this.owner.playStop();

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
        instance.x = (this.errorCheckNotNull12( object, this.owner, "`Get Position Center of Instance` block could not find an instance named [object ].")).x + this.math_random_int( -80, 80 );
        if ( !instance ) {
          this.reportError( "`Set Instance CenterY` block could not find the instance [instance]." );
          return;
        }
        instance.y = (this.errorCheckNotNull13( object, this.owner, "`Get Position Center of Instance` block could not find an instance named [object ].")).y + this.math_random_int( -80, 80 );
      }, null, this );
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
        instance.x = (this.errorCheckNotNull14( object, this.owner, "`Get Position Center of Instance` block could not find an instance named [object ].")).x + this.math_random_int( -80, 80 );
        if ( !instance ) {
          this.reportError( "`Set Instance CenterY` block could not find the instance [instance]." );
          return;
        }
        instance.y = (this.errorCheckNotNull15( object, this.owner, "`Get Position Center of Instance` block could not find an instance named [object ].")).y + this.math_random_int( -80, 80 );
      }, null, this );
    }

  }
);