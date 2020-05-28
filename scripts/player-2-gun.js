Phaserfroot.PluginManager.register(
  "Player2Gun",
  class Player2Gun extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Player2Gun",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.owner.properties.onUpdate( this.onMessageReceived, this, "_messaging_");


      // Initialize properties from parameters.
      this.value = instanceProperties[ "value" ];
      this.my_player_ID = instanceProperties[ "my player ID" ];
      this.my_player = ( typeof instanceProperties[ "my player" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "my player" ], true ) : null;
      this.player_gun = ( typeof instanceProperties[ "player gun" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "player gun" ], true ) : null;
      this.muzzleflash = instanceProperties[ "muzzleflash" ];
      this.casing = instanceProperties[ "casing" ];
      this.bullet = instanceProperties[ "bullet" ];
      this.sparks = instanceProperties[ "sparks" ];


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
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      if ( this.delayed_event ) this.delayed_event.remove();

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.tags.add( 'other player gun' );

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

      if (( this.scene.getChildrenByTag( 'player gun' )[ 0 ] && this.scene.getChildrenByTag( 'player gun' )[ 0 ].exists )) {
        this.player_gun = this.scene.getChildrenByTag( 'player gun' )[ 0 ];
      }
    }

    executeMessageset_other_player_gun () {
      // Executed when the 'set other player gun' is received.
      this.my_player = this.value;
      this.owner.visible = true;
      this.muzzleflash = (this.errorCheckNotNull( this.scene.getChildrenByTag( 'muzzleflash' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _muzzlef].")).name;
      this.bullet = (this.errorCheckNotNull2( this.scene.getChildrenByTag( 'bullet' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _bullet_].")).name;
      this.casing = (this.errorCheckNotNull3( this.scene.getChildrenByTag( 'casing' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _casing_].")).name;
      this.sparks = (this.errorCheckNotNull4( this.scene.getChildrenByTag( 'sparks' )[ 0 ], this.owner, "`Get Class Of Instance` block could not find an instance named [scene.getChildrenByTag( _sparks_].")).name;
      this.owner.posY = (this.errorCheckNotNull5( this.my_player, this.owner, "`Get Position of Instance` block could not find an instance named [my_player].")).posY + 45;
      this.owner.posX = (this.errorCheckNotNull6( this.my_player, this.owner, "`Get Position of Instance` block could not find an instance named [my_player].")).posX + 30;
    }

    executeMessageset_gun_player_ID () {
      // Executed when the 'set gun player ID' is received.
      this.my_player_ID = this.value;
    }

    EVENTS_UPDATE () {
      // Executed every frame.
      if (this.owner.visible) {
        this.chase_to_player(  );
      }
    }

    executeMessageplayerBullet () {
      // Executed when the 'playerBullet' is received.
      if (this.value[0] == this.my_player_ID) {
        var bullet_instance = this.scene.addSpriteByName( this.bullet );
        if ( !bullet_instance ) {
          this.reportError( "`Change Instance Depth` block could not find the instance [bullet_instance]." );
          return;
        }
        this.scene.addChildAfter( bullet_instance, this.owner );
        if ( !bullet_instance ) {
          this.reportError( "`Set Instance X` block could not find the instance [bullet_instance]." );
          return;
        }
        bullet_instance.posX = this.value[1];
        if ( !bullet_instance ) {
          this.reportError( "`Set Instance Y` block could not find the instance [bullet_instance]." );
          return;
        }
        bullet_instance.posY = this.value[2];
        if ( !bullet_instance ) {
          this.reportError( "`Set Instance Rotation` block could not find the instance [bullet_instance]." );
          return;
        }
        bullet_instance.bearing = this.value[3];
        this.scene.messageInstance( bullet_instance, 'x velocity', (this.value[4]) );
        this.scene.messageInstance( bullet_instance, 'y velocity', (this.value[5]) );
        this.scene.messageInstance( bullet_instance, 'gun', this.player_gun );
        this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndFire' ) ? 'sndFire' : null );
        this.muzzleflash2(  );
        this.casing2(  );
        if (this.owner.scaleX > 0) {
          this.owner.posX = this.owner.posX - 25;
        } else {
          this.owner.posX = this.owner.posX + 25;
        }
      }
    }

    executeMessageplayerDead () {
      // Executed when the 'playerDead' is received.
      // This player has died
      if (this.value[0] == this.my_player_ID) {
        this.owner.alpha = 0;
      }
    }

    executeMessageplayerRespawn () {
      // Executed when the 'playerRespawn' is received.
      // This player has respawned
      if (this.value[0] == this.my_player_ID) {
        this.owner.alpha = 1;
      }
    }

    onLevelStart2() {
      this.owner.visible = false;

    }

    onMessageReceived ( name, message ) {

      if ( message === 'set other player gun' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageset_other_player_gun();
      }

      if ( message === 'set gun player ID' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageset_gun_player_ID();
      }

      if ( message === 'playerBullet' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageplayerBullet();
      }

      if ( message === 'playerDead' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageplayerDead();
      }

      if ( message === 'playerRespawn' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageplayerRespawn();
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

    chase_to_player (  ) {
      this.owner.body.velocity.y = ((((this.errorCheckNotNull7( this.my_player, this.owner, "`Get Position of Instance` block could not find an instance named [my_player].")).posY + 45) - this.owner.posY) * 40);
      if ((this.errorCheckNotNull8( this.my_player, this.owner, "`Get scale of Instance` block could not find an instance named [my_player].")).scaleX > 0) {
        this.owner.scaleX = 1;
        this.owner.body.velocity.x = ((((this.errorCheckNotNull9( this.my_player, this.owner, "`Get Position of Instance` block could not find an instance named [my_player].")).posX + 30) - this.owner.posX) * 30);
      } else {
        this.owner.scaleX = -1;
        this.owner.body.velocity.x = ((((this.errorCheckNotNull10( this.my_player, this.owner, "`Get Position of Instance` block could not find an instance named [my_player].")).posX + 6) - this.owner.posX) * 30);
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
      this.delayed_event = this.scene.time.delayedCall( 20, function() {
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

  }
);