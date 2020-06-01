Phaserfroot.PluginManager.register(
  "Player2",
  class Player2 extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Player2",
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
      this.value = instanceProperties[ "value" ];
      this.health = instanceProperties[ "health" ];
      this.kills = instanceProperties[ "kills" ];
      this.deaths = instanceProperties[ "deaths" ];
      this.max_health = instanceProperties[ "max health" ];
      this.thisPlayerID = instanceProperties[ "thisPlayerID" ];
      this.playerName = instanceProperties[ "playerName" ];
      this.victim = instanceProperties[ "victim" ];
      this.killer = instanceProperties[ "killer" ];
      this.toucher = ( typeof instanceProperties[ "toucher" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "toucher" ], true ) : null;
      this.health_bar_outline = ( typeof instanceProperties[ "health bar outline" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "health bar outline" ], true ) : null;
      this.health_bar_white = ( typeof instanceProperties[ "health bar white" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "health bar white" ], true ) : null;
      this.player = ( typeof instanceProperties[ "player" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "player" ], true ) : null;
      this.camera_text = ( typeof instanceProperties[ "camera text" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "camera text" ], true ) : null;
      this.health_bar_black = ( typeof instanceProperties[ "health bar black" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "health bar black" ], true ) : null;
      this.scoreboard = ( typeof instanceProperties[ "scoreboard" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "scoreboard" ], true ) : null;
      this.health_bar = ( typeof instanceProperties[ "health bar" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "health bar" ], true ) : null;
      this.player_name_text = ( typeof instanceProperties[ "player name text" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "player name text" ], true ) : null;


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
      this.EVENTS_POST_UPDATE();

    }

    destroy () {
      this.owner.off( "levelSwitch", this.destroy, this );

      // Detach custom event listeners.
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.owner.off( this.owner.EVENTS.COLLIDE, this.onTouchInstance2, this );
      if ( this.delayed_event ) this.delayed_event.remove();

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.tags.add( 'other player' );
      this.owner.body.allowGravity = true;
      this.owner.body.drag.x = 1000;
      this.owner.body.maxVelocity.x = 300;
      if (( this.scene.getChildrenByTag( 'player' )[ 0 ] && this.scene.getChildrenByTag( 'player' )[ 0 ].exists )) {
        this.player = this.scene.getChildrenByTag( 'player' )[ 0 ];
        this.camera_text = this.scene.getChildrenByTag( 'camera text' )[ 0 ];
        if ( !this.camera_text ) {
          this.reportError( "`Change Instance Depth` block could not find the instance [camera_text]." );
          return;
        }
        this.scene.addChildBefore( this.owner, this.camera_text );
        this.scoreboard = this.scene.getChildrenByTag( 'scoreboard' )[ 0 ];
      }
    }

    executeMessageplayerID () {
      // Executed when the 'playerID' is received.
      this.thisPlayerID = this.value;
    }

    executeMessageplayerName () {
      // Executed when the 'playerName' is received.
      this.playerName = this.value;
    }

    executeMessagehealth () {
      // Executed when the 'health' is received.
      this.health = this.value;
      this.max_health = 100;
      this.create_health_bars(  );
    }

    executeMessagekills () {
      // Executed when the 'kills' is received.
      this.kills = this.value;
    }

    executeMessagedeaths () {
      // Executed when the 'deaths' is received.
      this.deaths = this.value;
    }

    executeMessageupdatePlayer () {
      // Executed when the 'updatePlayer' is received.
      // Each individual player is sending input
      if (this.value[0] == this.thisPlayerID) {
        this.owner.x = this.value[1];
        this.owner.y = this.value[2];
        this.owner.body.velocity.x = (this.value[5]);
        this.owner.body.velocity.y = (this.value[6]);
        this.owner.scaleX = this.value[7];
        this.owner.body.acceleration.x = (this.value[8]);
        this.owner.body.acceleration.y = (this.value[9]);
        this.health = this.value[10];
      }
    }

    executeMessagetickPlayer () {
      // Executed when the 'tickPlayer' is received.
      // Each individual player is updating their information many times a second...
      if (this.value[0] == this.thisPlayerID) {
        this.owner.body.velocity.x = (this.value[5]);
        this.owner.body.velocity.y = (this.value[6]);
        this.owner.scaleX = this.value[7];
        this.owner.body.acceleration.x = (this.value[8]);
        this.owner.body.acceleration.y = (this.value[9]);
        this.health = this.value[10];
      }
    }

    EVENTS_POST_UPDATE () {
      // Executed every frame.
      if (this.owner.visible) {
        if ( !this.health_bar_outline ) {
          this.reportError( "`Set Instance X` block could not find the instance [health_bar_outline]." );
          return;
        }
        this.health_bar_outline.posX = this.owner.x - ( (this.errorCheckNotNull2( this.health_bar_outline, this.owner, "`Get width/height of Instance` block could not find an instance named [health_bar_outline].")).width * this.health_bar_outline.scaleX ) / 2;
        if ( !this.health_bar_outline ) {
          this.reportError( "`Set Instance Y` block could not find the instance [health_bar_outline]." );
          return;
        }
        this.health_bar_outline.posY = this.owner.y - 66;
        if ( !this.health_bar_white ) {
          this.reportError( "`Set Instance X` block could not find the instance [health_bar_white]." );
          return;
        }
        this.health_bar_white.posX = (this.errorCheckNotNull3( this.health_bar_outline, this.owner, "`Get Position of Instance` block could not find an instance named [health_bar_outline].")).posX + 3;
        if ( !this.health_bar_white ) {
          this.reportError( "`Set Instance Y` block could not find the instance [health_bar_white]." );
          return;
        }
        this.health_bar_white.posY = (this.errorCheckNotNull4( this.health_bar_outline, this.owner, "`Get Position of Instance` block could not find an instance named [health_bar_outline].")).posY + 3;
        if ( !this.health_bar_black ) {
          this.reportError( "`Set Instance X` block could not find the instance [health_bar_black]." );
          return;
        }
        this.health_bar_black.posX = (this.errorCheckNotNull5( this.health_bar_white, this.owner, "`Get Position of Instance` block could not find an instance named [health_bar_white].")).posX + 3;
        if ( !this.health_bar_black ) {
          this.reportError( "`Set Instance Y` block could not find the instance [health_bar_black]." );
          return;
        }
        this.health_bar_black.posY = (this.errorCheckNotNull6( this.health_bar_white, this.owner, "`Get Position of Instance` block could not find an instance named [health_bar_white].")).posY + 3;
        if ( !this.health_bar ) {
          this.reportError( "`Set Instance X` block could not find the instance [health_bar]." );
          return;
        }
        this.health_bar.posX = (this.errorCheckNotNull7( this.health_bar_black, this.owner, "`Get Position of Instance` block could not find an instance named [health_bar_black].")).posX + 3;
        if ( !this.health_bar ) {
          this.reportError( "`Set Instance Y` block could not find the instance [health_bar]." );
          return;
        }
        this.health_bar.posY = (this.errorCheckNotNull8( this.health_bar_black, this.owner, "`Get Position of Instance` block could not find an instance named [health_bar_black].")).posY + 3;
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
        this.player_name_text.y = (this.errorCheckNotNull9( this.health_bar_outline, this.owner, "`Get Position of Instance` block could not find an instance named [health_bar_outline].")).posY - 25;
      }
    }

    EVENTS_UPDATE () {
      // Executed every frame.
      if (this.owner.visible) {
        if (this.health > 0) {
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
        } else {
          this.owner.playMy( 'dead' );
        }
      }
    }

    executeMessageplayerDead () {
      // Executed when the 'playerDead' is received.
      // This player has died
      if (this.value[0] == this.thisPlayerID) {
        this.health = 0;
        this.owner.alpha = 0.5;
        this.owner.body.velocity.x = (this.value[5]);
        this.owner.body.velocity.y = (this.value[6]);
        this.owner.scaleX = this.value[7];
        this.owner.body.acceleration.x = (this.value[8]);
        this.owner.body.acceleration.y = (this.value[9]);
        this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndDeathBass' ) ? 'sndDeathBass' : null );
        this.scene.physicsLayersManager.addToLayer( this.owner, 4 );
        this.owner.playMy( 'dead' );
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
      }
    }

    executeMessageplayerRespawn () {
      // Executed when the 'playerRespawn' is received.
      // This player has respawned
      if (this.value[0] == this.thisPlayerID) {
        this.health = this.value[10];
        this.owner.alpha = 1;
        this.scene.physicsLayersManager.addToLayer( this.owner, 0 );
        this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndPrev' ) ? 'sndPrev' : null );
        this.owner.playMy( 'idle' );
        this.owner.body.velocity.x = (this.value[5]);
        this.owner.body.velocity.y = (this.value[6]);
        this.owner.scaleX = this.value[7];
        this.owner.body.acceleration.x = (this.value[8]);
        this.owner.body.acceleration.y = (this.value[9]);
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
      }
    }

    executeMessageplayerDead2 () {
      // Executed when the 'playerDead' is received.
      this.victim = this.value[0];
      this.killer = this.value[11];
      if (this.victim == this.thisPlayerID) {
        this.deaths = this.deaths + 1;
        this.scene.messageInstance( this.scoreboard, 'update scoreboard', [this.thisPlayerID, this.playerName, this.kills, this.deaths] );
      }
      if (this.killer == this.thisPlayerID) {
        this.kills = this.kills + 1;
        this.scene.messageInstance( this.scoreboard, 'update scoreboard', [this.thisPlayerID, this.playerName, this.kills, this.deaths] );
      }
    }

    reportError( message ) {
      message = "(" + this.name.replace( /_[\d]+$/, "" ) + ")" + message;
      console.trace( message );
      this.game.reportError( message, message, "SCRIPT ERROR" );
    }

    onLevelStart2() {
      this.owner.visible = false;
      this.owner.setPhysics( false );
      if (( this.scene.getChildrenByTag( 'player' )[ 0 ] && this.scene.getChildrenByTag( 'player' )[ 0 ].exists )) {
        this.player = this.scene.getChildrenByTag( 'player' )[ 0 ];
        this.camera_text = this.scene.getChildrenByTag( 'camera text' )[ 0 ];
        if ( !this.camera_text ) {
          this.reportError( "`Change Instance Depth` block could not find the instance [camera_text]." );
          return;
        }
        this.scene.addChildBefore( this.owner, this.camera_text );
      }

    }

    onMessageReceived ( name, message ) {

      if ( message === 'playerID' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageplayerID();
      }

      if ( message === 'playerName' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageplayerName();
      }

      if ( message === 'health' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagehealth();
      }

      if ( message === 'kills' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagekills();
      }

      if ( message === 'deaths' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagedeaths();
      }

      if ( message === 'updatePlayer' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageupdatePlayer();
      }

      if ( message === 'tickPlayer' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagetickPlayer();
      }

      if ( message === 'playerDead' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageplayerDead();
      }

      if ( message === 'playerRespawn' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageplayerRespawn();
      }

      if ( message === 'playerDead' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageplayerDead2();
      }

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
        if ((this.errorCheckNotNull( this.toucher, this.owner, "`Instance has Tag` block could not find an instance named [toucher].")).tags.has( 'bullet' )) {
        this.scene.messageExternal( 'sendToRoom', [this.game.GLOBAL_VARIABLES.hostRoomName, 'bulletHit', this.thisPlayerID, this.game.GLOBAL_VARIABLES.myPlayerID] );
        this.get_hurt(  );
      }

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
      this.player_name_text = this.scene.addText( { x: 0, y: 0, textText: this.playerName } );
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

    math_random_int ( a, b ) {
      if ( a > b ) {
        // Swap a and b to ensure a is smaller.
        var c = a;
        a = b;
        b = c;
      }
      return Math.floor( Math.random() * ( b - a + 1 ) + a );
    }

    get_hurt (  ) {
      if (this.health > 0) {
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
        if ( this.owner.setTint ) {
          this.owner.setTint( "0xff0000" );
        }
        this.delayed_event = this.scene.time.delayedCall( 100, function() {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
            this.owner.clearTint();
        }, null, this );
      }
    }

  }
);