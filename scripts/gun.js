Phaserfroot.PluginManager.register(
  "Gun",
  class Gun extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Gun",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.scene.getKey( 32 ).on( "down", this.onKeyInput32, this );
      this.onTick_ = this.scene.time.addEvent( {
        delay: 80,
        loop: true,
        callback: function () {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
          this.onTick();
        },
        callbackScope: this,
      } );
      this.scene.getKey( 32 ).on( "up", this.onKeyInput322, this );
      this.owner.properties.onUpdate( this.onMessageReceived, this, "_messaging_");


      // Initialize properties from parameters.
      this.value = instanceProperties[ "value" ];
      this.trigger_held = instanceProperties[ "trigger held" ];
      this.player_dead = instanceProperties[ "player dead" ];
      this.muzzleflash = instanceProperties[ "muzzleflash" ];
      this.bullet = instanceProperties[ "bullet" ];
      this.casing = instanceProperties[ "casing" ];
      this.sparks = instanceProperties[ "sparks" ];
      this.player = ( typeof instanceProperties[ "player" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "player" ], true ) : null;
      this.white_flash = ( typeof instanceProperties[ "white flash" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "white flash" ], true ) : null;


      // Boot phase.
      this.camera = this.scene.cameras.main;

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
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      if ( this.delayed_event ) this.delayed_event.remove();
      this.scene.getKey( 32 ).off( "down", this.onKeyInput32, this );
      if ( this.onTick_ ) {
        this.onTick_.remove();
      }
      if ( this.delayed_event2 ) this.delayed_event2.remove();
      if ( this.delayed_event3 ) this.delayed_event3.remove();
      if ( this.delayed_event4 ) this.delayed_event4.remove();
      this.scene.getKey( 32 ).off( "up", this.onKeyInput322, this );

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.

      // Set side collisions.
      this.owner.body.checkCollision.left = false;
      this.owner.body.checkCollision.right = false;
      this.owner.body.checkCollision.up = false;
      this.owner.body.checkCollision.down = false;
      this.owner.body.checkCollision.none = !(
        this.owner.body.checkCollision.left ||
        this.owner.body.checkCollision.right ||
        this.owner.body.checkCollision.up ||
        this.owner.body.checkCollision.down );
      // Get the current layer.
      var layer = this.scene.physicsLayersManager.getLayersWithChild( this.owner )[ 0 ];
      layer = layer ? this.scene.physicsLayersManager.layers.indexOf( layer ) : 0;
      if ( this.owner.body.checkCollision.none ) {
        // Remove from current layer.
        this.scene.physicsLayersManager.layers[ layer ].remove( this.owner );
      } else if ( !this.scene.physicsLayersManager.layers[ layer ].hasChild( this.owner ) ) {
      // Add back to a layer - probably default, 0.
        this.scene.physicsLayersManager.layers[ layer ].add( this.owner );
      }

      this.owner.tags.add( 'player gun' );
    }

    EVENTS_UPDATE () {
      // Executed every frame.
      this.chase_to_player(  );
    }

    onKeyInput32 () {
      if (!this.player_dead) {
        this.shoot(  );
        this.delayed_event = this.scene.time.delayedCall( 50, function() {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
            if (( this.scene.getKey( 32 ).isDown || this.scene._keys.lastPressed === 32 )) {
            this.trigger_held = true;
          }
        }, null, this );
      }
    }

    onTick () {
      // Executed after time period of time.
      if (!this.player_dead) {
        if (this.trigger_held) {
          this.shoot(  );
        }
      }
    }

    onKeyInput322 () {
      this.trigger_held = false;
    }

    executeMessagesparks_left () {
      // Executed when the 'sparks left' is received.
      var bullet_instance = this.value;
      var instance = this.scene.addSpriteByName( this.sparks );
      if ( !instance ) {
        this.reportError( "`Set Instance Scale` block could not find the instance [instance]." );
        return;
      }
      instance.scaleX = -1;
      if ( !instance ) {
        this.reportError( "`Set Instance Y` block could not find the instance [instance]." );
        return;
      }
      instance.posY = (this.errorCheckNotNull24( bullet_instance, this.owner, "`Get Position of Instance` block could not find an instance named [bullet_instance].")).posY;
      if ( !instance ) {
        this.reportError( "`Set Instance X` block could not find the instance [instance]." );
        return;
      }
      instance.posX = (this.errorCheckNotNull25( bullet_instance, this.owner, "`Get Position of Instance` block could not find an instance named [bullet_instance].")).posX;
    }

    executeMessagesparks_right () {
      // Executed when the 'sparks right' is received.
      var bullet_instance = this.value;
      var instance = this.scene.addSpriteByName( this.sparks );
      if ( !instance ) {
        this.reportError( "`Set Instance Scale` block could not find the instance [instance]." );
        return;
      }
      instance.scaleX = 1;
      if ( !instance ) {
        this.reportError( "`Set Instance Y` block could not find the instance [instance]." );
        return;
      }
      instance.posY = (this.errorCheckNotNull26( bullet_instance, this.owner, "`Get Position of Instance` block could not find an instance named [bullet_instance].")).posY;
      if ( !instance ) {
        this.reportError( "`Set Instance X` block could not find the instance [instance]." );
        return;
      }
      instance.posX = ((this.errorCheckNotNull27( bullet_instance, this.owner, "`Get Position of Instance` block could not find an instance named [bullet_instance].")).posX + ( (this.errorCheckNotNull28( bullet_instance, this.owner, "`Get width/height of Instance` block could not find an instance named [bullet_instance].")).width * bullet_instance.scaleX )) - ( (this.errorCheckNotNull29( instance, this.owner, "`Get width/height of Instance` block could not find an instance named [instance].")).width * instance.scaleX );
    }

    executeMessagesparks_bottom () {
      // Executed when the 'sparks bottom' is received.
      var bullet_instance = this.value;
      var instance = this.scene.addSpriteByName( this.sparks );
      if ( !instance ) {
        this.reportError( "`Set Instance Rotation` block could not find the instance [instance]." );
        return;
      }
      instance.bearing = 90;
      if ( !instance ) {
        this.reportError( "`Set Instance CenterX` block could not find the instance [instance]." );
        return;
      }
      instance.x = (this.errorCheckNotNull30( bullet_instance, this.owner, "`Get Position Center of Instance` block could not find an instance named [bullet_instance ].")).x;
      if ( !instance ) {
        this.reportError( "`Set Instance CenterY` block could not find the instance [instance]." );
        return;
      }
      instance.y = (this.errorCheckNotNull31( bullet_instance, this.owner, "`Get Position Center of Instance` block could not find an instance named [bullet_instance ].")).y;
    }

    executeMessageplayer_dead () {
      // Executed when the 'player dead' is received.
      this.player_dead = true;
      this.owner.visible = false;
    }

    executeMessageplayer_alive () {
      // Executed when the 'player alive' is received.
      this.player_dead = false;
      this.owner.visible = true;
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

    errorCheckNotNull6( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    onLevelStart2() {
      this.player = this.scene.getChildrenByTag( 'player' )[ 0 ];
      this.muzzleflash = (this.errorCheckNotNull( this.scene.getChildrenByTag( 'muzzleflash' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _muzzlef].")).name;
      this.bullet = (this.errorCheckNotNull2( this.scene.getChildrenByTag( 'bullet' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _bullet_].")).name;
      this.casing = (this.errorCheckNotNull3( this.scene.getChildrenByTag( 'casing' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _casing_].")).name;
      this.sparks = (this.errorCheckNotNull4( this.scene.getChildrenByTag( 'sparks' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _sparks_].")).name;
      this.owner.posY = (this.errorCheckNotNull5( this.player, this.owner, "`Get Position of Instance` block could not find an instance named [player].")).posY + 45;
      this.owner.posX = (this.errorCheckNotNull6( this.player, this.owner, "`Get Position of Instance` block could not find an instance named [player].")).posX + 30;

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

    chase_to_player (  ) {
      this.owner.body.velocity.y = ((((this.errorCheckNotNull7( this.player, this.owner, "`Get Position of Instance` block could not find an instance named [player].")).posY + 45) - this.owner.posY) * 40);
      if ((this.errorCheckNotNull8( this.player, this.owner, "`Get scale of Instance` block could not find an instance named [player].")).scaleX > 0) {
        this.owner.scaleX = 1;
        this.owner.body.velocity.x = ((((this.errorCheckNotNull9( this.player, this.owner, "`Get Position of Instance` block could not find an instance named [player].")).posX + 30) - this.owner.posX) * 30);
      } else {
        this.owner.scaleX = -1;
        this.owner.body.velocity.x = ((((this.errorCheckNotNull10( this.player, this.owner, "`Get Position of Instance` block could not find an instance named [player].")).posX + 6) - this.owner.posX) * 30);
      }
    }

    errorCheckNotNull11( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
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

    errorCheckNotNull14( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    position_on_player (  ) {
      this.owner.posY = (this.errorCheckNotNull11( this.player, this.owner, "`Get Position of Instance` block could not find an instance named [player].")).posY + 45;
      if ((this.errorCheckNotNull12( this.player, this.owner, "`Get scale of Instance` block could not find an instance named [player].")).scaleX > 0) {
        this.owner.scaleX = 1;
        this.owner.posX = (this.errorCheckNotNull13( this.player, this.owner, "`Get Position of Instance` block could not find an instance named [player].")).posX + 30;
      } else {
        this.owner.scaleX = -1;
        this.owner.posX = (this.errorCheckNotNull14( this.player, this.owner, "`Get Position of Instance` block could not find an instance named [player].")).posX + 6;
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

    checkScene( message ) {
      if ( !this.scene.add ) {
        this.game.reportError( message, message, 'SCRIPT ERROR' );
      }
    }

    shoot (  ) {
      this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndFire' ) ? 'sndFire' : null );
      this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndFireBass' ) ? 'sndFireBass' : null );
      this.bullet2(  );
      this.delayed_event2 = this.scene.time.delayedCall( 60, function() {
        if ( !this.owner || this.owner.exists === false ) {
          return;
        }
          this.bullet2(  );
      }, null, this );
      this.muzzleflash2(  );
      this.casing2(  );
      var tracker = { k: (this.math_random_int( 20, 30 )) };
      var base = this.camera.offsetX;
      this.scene.tweens.add( {
        targets: tracker,
        props: { k : 0 },
        ease: "Expo.easeOut",
        duration: 0.3 * 1000,
        onUpdate:
          function() {
            this.camera.offsetX = base + tracker.k * Math.sin( this.scene.time.now * 60 / 1000 );
          }.bind( this ),
        onComplete: function() {
          this.camera.offsetX = 0;}.bind( this ) } );
      this.scene.messageInstance( this.player, 'recoil' );
      if (this.owner.scaleX > 0) {
        this.owner.posX = this.owner.posX - 25;
      } else {
        this.owner.posX = this.owner.posX + 25;
      }
      if (this.math_random_int( 1, 5 ) > 2) {
        this.checkScene( "Create Rectangle block could not create a rectangle, likely because the scene was switched before it could run.\n\nSuggestion: check whether the level has changed before running this section of code." );
        this.white_flash = this.scene.add.rectangle( 0, 0, 1200, 800, 0x808080 );
        // Set shape properties to Phaserfroot compatible.
        Phaserfroot.GameObjectTools.setCommonFeatures( this.white_flash );
        this.white_flash.setPhysics( false );
        this.white_flash.anchorX = this.white_flash.displayOriginX;
        this.white_flash.anchorY = this.white_flash.displayOriginY;

        if ( !this.white_flash ) {
          this.reportError( "`Primitive set colour` block could not find an instance named [white_flash]." );
          return;
        }
        var inst = this.white_flash;
        if( inst ) {
          var color = "0xffffff";
          inst.setFillStyle( color, inst.alpha );
        }
        if ( !this.white_flash ) {
          this.reportError( "`Set Instance X` block could not find the instance [white_flash]." );
          return;
        }
        this.white_flash.posX = this.camera.posX;
        if ( !this.white_flash ) {
          this.reportError( "`Set Instance Y` block could not find the instance [white_flash]." );
          return;
        }
        this.white_flash.posY = this.camera.posY;
        if ( !this.white_flash ) {
          this.reportError( "`Set Instance Alpha` block could not find the instance [white_flash]." );
          return;
        }
        this.white_flash.alpha = this.math_random_int( 80, 10 ) / 100;
        var this_white_flash = this.white_flash;
        this.delayed_event3 = this.scene.time.delayedCall( 20, function() {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
            if ( !this_white_flash ) {
            this.reportError( "`Destroy` block could not find the instance [white_flash]." );
            return;
          }
          this_white_flash.destroySafe();
        }, null, this );
      }
    }

    muzzleflash2 (  ) {
      var instance = this.scene.addSpriteByName( this.muzzleflash );
      if ( !instance ) {
        this.reportError( "`Change Instance Depth` block could not find the instance [instance]." );
        return;
      }
      this.scene.addChildAfter( instance, this.owner );
      if ( !instance ) {
        this.reportError( "`Set Instance Scale` block could not find the instance [instance]." );
        return;
      }
      instance.scaleX = this.math_random_int( 80, 160 ) / 100;
      if ( !instance ) {
        this.reportError( "`Set Instance Scale` block could not find the instance [instance]." );
        return;
      }
      instance.scaleY = this.math_random_int( 80, 120 ) / 100;
      if (this.owner.scaleX > 0) {
        if ( !instance ) {
          this.reportError( "`Set Instance X` block could not find the instance [instance]." );
          return;
        }
        instance.posX = this.owner.posX + 27;
      } else {
        if ( !instance ) {
          this.reportError( "`Set Instance X` block could not find the instance [instance]." );
          return;
        }
        instance.posX = this.owner.posX - 36;
      }
      if ( !instance ) {
        this.reportError( "`Set Instance Y` block could not find the instance [instance]." );
        return;
      }
      instance.posY = this.owner.posY - 18;
      this.delayed_event4 = this.scene.time.delayedCall( 20, function() {
        if ( !this.owner || this.owner.exists === false ) {
          return;
        }
          if ( !instance ) {
          this.reportError( "`Destroy` block could not find the instance [instance]." );
          return;
        }
        instance.destroySafe();
      }, null, this );
    }

    errorCheckNotNull15( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
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

    errorCheckNotNull18( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull19( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull20( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull21( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull22( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull23( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    bullet2 (  ) {
      var bullet_instance = this.scene.addSpriteByName( this.bullet );
      if ( !bullet_instance ) {
        this.reportError( "`Change Instance Depth` block could not find the instance [bullet_instance]." );
        return;
      }
      this.scene.addChildAfter( bullet_instance, this.owner );
      if (this.owner.scaleX > 0) {
        if ( !bullet_instance ) {
          this.reportError( "`Set Instance X` block could not find the instance [bullet_instance]." );
          return;
        }
        bullet_instance.posX = (this.errorCheckNotNull15( this.player, this.owner, "`Get Position Center of Instance` block could not find an instance named [player ].")).x - 18;
        if ( !bullet_instance ) {
          this.reportError( "`Set Instance Rotation` block could not find the instance [bullet_instance]." );
          return;
        }
        bullet_instance.bearing = this.math_random_int( 355, 365 );
      } else {
        if ( !bullet_instance ) {
          this.reportError( "`Set Instance X` block could not find the instance [bullet_instance]." );
          return;
        }
        bullet_instance.posX = (this.errorCheckNotNull16( this.player, this.owner, "`Get Position Center of Instance` block could not find an instance named [player ].")).x - 33;
        if ( !bullet_instance ) {
          this.reportError( "`Set Instance Rotation` block could not find the instance [bullet_instance]." );
          return;
        }
        bullet_instance.bearing = this.math_random_int( 175, 185 );
      }
      if ( !bullet_instance ) {
        this.reportError( "`Set Instance Y` block could not find the instance [bullet_instance]." );
        return;
      }
      bullet_instance.posY = this.owner.posY - 6;
      this.scene.messageInstance( bullet_instance, 'x velocity', (Math.cos((this.errorCheckNotNull17( bullet_instance, this.owner, "`Get Rotation of Instance` block could not find an instance named [bullet_instance].")).bearing / 180 * Math.PI) * 2000) );
      this.scene.messageInstance( bullet_instance, 'y velocity', (Math.sin((this.errorCheckNotNull18( bullet_instance, this.owner, "`Get Rotation of Instance` block could not find an instance named [bullet_instance].")).bearing / 180 * Math.PI) * 2000) );
      this.scene.messageInstance( bullet_instance, 'gun', this.owner );
      this.scene.messageExternal( 'sendToRoom', [this.game.GLOBAL_VARIABLES.hostRoomName, 'playerBullet', this.game.GLOBAL_VARIABLES.myPlayerID, (this.errorCheckNotNull19( bullet_instance, this.owner, "`Get Position of Instance` block could not find an instance named [bullet_instance].")).posX, (this.errorCheckNotNull20( bullet_instance, this.owner, "`Get Position of Instance` block could not find an instance named [bullet_instance].")).posY, (this.errorCheckNotNull21( bullet_instance, this.owner, "`Get Rotation of Instance` block could not find an instance named [bullet_instance].")).bearing, Math.cos((this.errorCheckNotNull22( bullet_instance, this.owner, "`Get Rotation of Instance` block could not find an instance named [bullet_instance].")).bearing / 180 * Math.PI) * 2000, Math.sin((this.errorCheckNotNull23( bullet_instance, this.owner, "`Get Rotation of Instance` block could not find an instance named [bullet_instance].")).bearing / 180 * Math.PI) * 2000] );
    }

    casing2 (  ) {
      var casing_instance = this.scene.addSpriteByName( this.casing );
      if ( !casing_instance ) {
        this.reportError( "`Change Instance Depth` block could not find the instance [casing_instance]." );
        return;
      }
      this.scene.addChildAfter( casing_instance, this.owner );
      if (this.owner.scaleX > 0) {
        if ( !casing_instance ) {
          this.reportError( "`Set Instance X` block could not find the instance [casing_instance]." );
          return;
        }
        casing_instance.posX = this.owner.posX - 6;
        this.scene.messageInstance( casing_instance, 'x velocity', (this.math_random_int( -200, -400 )) );
      } else {
        if ( !casing_instance ) {
          this.reportError( "`Set Instance X` block could not find the instance [casing_instance]." );
          return;
        }
        casing_instance.posX = this.owner.posX + 30;
        this.scene.messageInstance( casing_instance, 'x velocity', (this.math_random_int( 200, 400 )) );
      }
      if ( !casing_instance ) {
        this.reportError( "`Set Instance Y` block could not find the instance [casing_instance]." );
        return;
      }
      casing_instance.posY = this.owner.posY - 6;
      this.scene.messageInstance( casing_instance, 'y velocity', (this.math_random_int( -200, -500 )) );
    }

    onMessageReceived ( name, message ) {

      if ( message === 'sparks left' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagesparks_left();
      }

      if ( message === 'sparks right' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagesparks_right();
      }

      if ( message === 'sparks bottom' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagesparks_bottom();
      }

      if ( message === 'player dead' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageplayer_dead();
      }

      if ( message === 'player alive' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageplayer_alive();
      }

    }

    errorCheckNotNull24( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull25( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull26( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull27( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull28( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull29( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull30( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    errorCheckNotNull31( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

  }
);