Phaserfroot.PluginManager.register(
  "Camera",
  class Camera extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "Camera",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.properties.onUpdate( this.onMessageReceived, this, "_messaging_");
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );


      // Initialize properties from parameters.
      this.value = instanceProperties[ "value" ];
      this.text_offset = instanceProperties[ "text offset" ];
      this.text_acceleration = instanceProperties[ "text acceleration" ];
      this.player = ( typeof instanceProperties[ "player" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "player" ], true ) : null;
      this.textfield = ( typeof instanceProperties[ "textfield" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "textfield" ], true ) : null;
      this.fade_rectangle = ( typeof instanceProperties[ "fade rectangle" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "fade rectangle" ], true ) : null;
      this.bottom_rectangle = ( typeof instanceProperties[ "bottom rectangle" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "bottom rectangle" ], true ) : null;
      this.top_rectangle = ( typeof instanceProperties[ "top rectangle" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "top rectangle" ], true ) : null;
      this.player_dead = instanceProperties[ "player dead" ];
      this.cinematic_on = instanceProperties[ "cinematic on" ];
      this.fade_in = instanceProperties[ "fade in" ];
      this.fade_out = instanceProperties[ "fade out" ];


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
      if ( this.delayed_event2 ) this.delayed_event2.remove();
      if ( this.delayed_event3 ) this.delayed_event3.remove();

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.tags.add( 'camera text' );
      this.owner.visible = false;

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

      this.checkScene( "Create Rectangle block could not create a rectangle, likely because the scene was switched before it could run.\n\nSuggestion: check whether the level has changed before running this section of code." );
      this.top_rectangle = this.scene.add.rectangle( 0, 0, 1000, 150, 0x808080 );
      // Set shape properties to Phaserfroot compatible.
      Phaserfroot.GameObjectTools.setCommonFeatures( this.top_rectangle );
      this.top_rectangle.setPhysics( false );
      this.top_rectangle.anchorX = this.top_rectangle.displayOriginX;
      this.top_rectangle.anchorY = this.top_rectangle.displayOriginY;

      if ( !this.top_rectangle ) {
        this.reportError( "`Set Instance Anchor Point` block could not find the instance [top_rectangle]." );
        return;
      }
      this.top_rectangle.anchorY = 0;
      this.checkScene( "Create Rectangle block could not create a rectangle, likely because the scene was switched before it could run.\n\nSuggestion: check whether the level has changed before running this section of code." );
      this.bottom_rectangle = this.scene.add.rectangle( 0, 0, 1000, 150, 0x808080 );
      // Set shape properties to Phaserfroot compatible.
      Phaserfroot.GameObjectTools.setCommonFeatures( this.bottom_rectangle );
      this.bottom_rectangle.setPhysics( false );
      this.bottom_rectangle.anchorX = this.bottom_rectangle.displayOriginX;
      this.bottom_rectangle.anchorY = this.bottom_rectangle.displayOriginY;

      if ( !this.bottom_rectangle ) {
        this.reportError( "`Set Instance Anchor Point` block could not find the instance [bottom_rectangle]." );
        return;
      }
      this.bottom_rectangle.anchorY = ( (this.errorCheckNotNull( this.bottom_rectangle, this.owner, "`Get width/height of Instance` block could not find an instance named [bottom_rectangle].")).height * this.bottom_rectangle.scaleY );
      if ( !this.top_rectangle ) {
        this.reportError( "`Primitive set colour` block could not find an instance named [top_rectangle]." );
        return;
      }
      var inst = this.top_rectangle;
      if( inst ) {
        var color = "0x000000";
        inst.setFillStyle( color, inst.alpha );
      }
      if ( !this.bottom_rectangle ) {
        this.reportError( "`Primitive set colour` block could not find an instance named [bottom_rectangle]." );
        return;
      }
      var inst = this.bottom_rectangle;
      if( inst ) {
        var color = "0x000000";
        inst.setFillStyle( color, inst.alpha );
      }
      this.checkScene( "Create Text block did not work, likely because the level changed before it was triggered.\n\nSuggestion: check whether the level has changed before running this section of code." );
      this.textfield = this.scene.addText( { x: 0, y: 0, textText: 'PREPARE YOURSELF...' } );
      if ( !this.textfield ) {
        this.reportError( "`Set Text Family` block could not find an instance called [textfield]." );
        return;
      }
      if ( !this.textfield.setFontFamily ) {
        this.reportError( "`Set Text Family` block could not find font information on an instance called [textfield]." );
        return;
      }
      this.textfield.setFontFamily( "'Arial Black', sans-serif" );
      if ( !this.textfield ) {
        this.reportError( "`Set Text Colour` block could not find an instance called [textfield]." );
        return;
      }
      if ( !this.textfield.setColor ) {
        this.reportError( "`Set Text Colour` block could not find text color information on an instance called [textfield]." );
        return;
      }
      this.textfield.setColor( "0xffffff".replace( /^0x/, "#" ) );
      if ( !this.textfield ) {
        this.reportError( "`Set Text Alignment` block could not find an instance called [textfield]." );
        return;
      }
      if ( !this.textfield.setAlign ) {
        this.reportError( "`Set Text Alignment` block could not find text alignment information on an instance called [textfield]." );
        return;
      }
      this.textfield.setAlign( "center" );
      if ( this.textfield.width === 0 ) {
        this.textfield.width = 1;
        this.textfield.displayOriginX = this.textfield.width * 0.5;
        this.textfield.width = 0;
      } else {
        this.textfield.displayOriginX = this.textfield.width * 0.5;
      }
      this.text_offset = 1000;
      this.text_acceleration = 0;
      this.checkScene( "Create Rectangle block could not create a rectangle, likely because the scene was switched before it could run.\n\nSuggestion: check whether the level has changed before running this section of code." );
      this.fade_rectangle = this.scene.add.rectangle( 0, 0, 1000, 540, 0x808080 );
      // Set shape properties to Phaserfroot compatible.
      Phaserfroot.GameObjectTools.setCommonFeatures( this.fade_rectangle );
      this.fade_rectangle.setPhysics( false );
      this.fade_rectangle.anchorX = this.fade_rectangle.displayOriginX;
      this.fade_rectangle.anchorY = this.fade_rectangle.displayOriginY;

      if ( !this.fade_rectangle ) {
        this.reportError( "`Primitive set colour` block could not find an instance named [fade_rectangle]." );
        return;
      }
      var inst = this.fade_rectangle;
      if( inst ) {
        var color = "0x000000";
        inst.setFillStyle( color, inst.alpha );
      }
      if ( !this.top_rectangle ) {
        this.reportError( "`Set Instance Scale` block could not find the instance [top_rectangle]." );
        return;
      }
      this.top_rectangle.scaleY = 0;
      if ( !this.bottom_rectangle ) {
        this.reportError( "`Set Instance Scale` block could not find the instance [bottom_rectangle]." );
        return;
      }
      this.bottom_rectangle.scaleY = 0;
      this.fade_in = true;
    }

    executeMessagecinematicText () {
      // Executed when the 'cinematicText' is received.
      if ( !this.textfield ) {
        this.reportError( "`Set Text on Text` block could not find an instance called [textfield]." );
        return;
      }
      this.textfield.components.getByName( "TextAutomation" )[ 0 ].text = this.value;
      this.text_offset = 1000;
      this.text_acceleration = 5;
      this.cinematic_on = true;
    }

    EVENTS_UPDATE () {
      // Executed every frame.
      if (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) != 4) {
        if (!this.player_dead) {
          this.camera.centerOn( this.owner.x, this.owner.y );
          this.camera.posX = (Math.round(this.camera.posX));
          this.camera.posY = (Math.round(this.camera.posY));
        } else {
          this.camera.centerOn( (this.errorCheckNotNull2( this.player, this.owner, "A `Center Camera on Instance` block could not find an instance named [player].")).x, (this.errorCheckNotNull2( this.player, this.owner, "A `Center Camera on Instance` block could not find an instance named [player].")).y );
          this.camera.scaleX = (Math.min(Math.max(this.camera.scaleX * 100 + 0.5, 100), 300) / 100);
          this.camera.scaleY = this.camera.scaleX;
        }
      } else if (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) == 4) {
        this.camera.posX = 0;
        this.camera.posY = 0;
      }
      if ((this.errorCheckNotNull3( this.player, this.owner, "`Get scale of Instance` block could not find an instance named [player].")).scaleX > 0) {
        this.owner.body.velocity.x = (Math.min(Math.max((((this.errorCheckNotNull4( this.player, this.owner, "`Get Position Center of Instance` block could not find an instance named [player ].")).x + 250) - this.owner.x) * 3, -800), 800));
      } else if ((this.errorCheckNotNull5( this.player, this.owner, "`Get scale of Instance` block could not find an instance named [player].")).scaleX < 0) {
        this.owner.body.velocity.x = (Math.min(Math.max((((this.errorCheckNotNull6( this.player, this.owner, "`Get Position Center of Instance` block could not find an instance named [player ].")).x - 250) - this.owner.x) * 3, -800), 800));
      }
      this.owner.body.velocity.y = (((this.errorCheckNotNull7( this.player, this.owner, "`Get Position Center of Instance` block could not find an instance named [player ].")).y - this.owner.y) * 6);
      if (this.fade_in) {
        if ((this.errorCheckNotNull8( this.fade_rectangle, this.owner, "`Get alpha of Instance` block could not find an instance named [fade_rectangle].")).alpha > 0) {
          if ( !this.fade_rectangle ) {
            this.reportError( "`Set Instance Alpha` block could not find the instance [fade_rectangle]." );
            return;
          }
          this.fade_rectangle.alpha = (this.errorCheckNotNull9( this.fade_rectangle, this.owner, "`Get alpha of Instance` block could not find an instance named [fade_rectangle].")).alpha - 0.01;
        } else {
          this.fade_in = false;
        }
      }
      if (this.fade_out) {
        if ((this.errorCheckNotNull10( this.fade_rectangle, this.owner, "`Get alpha of Instance` block could not find an instance named [fade_rectangle].")).alpha < 1) {
          if ( !this.fade_rectangle ) {
            this.reportError( "`Set Instance Alpha` block could not find the instance [fade_rectangle]." );
            return;
          }
          this.fade_rectangle.alpha = (this.errorCheckNotNull11( this.fade_rectangle, this.owner, "`Get alpha of Instance` block could not find an instance named [fade_rectangle].")).alpha + 0.01;
        } else {
          this.fade_out = false;
        }
      }
      if ( !this.fade_rectangle ) {
        this.reportError( "`Set Instance X` block could not find the instance [fade_rectangle]." );
        return;
      }
      this.fade_rectangle.posX = this.camera.posX + this.camera.offsetX;
      if ( !this.fade_rectangle ) {
        this.reportError( "`Set Instance Y` block could not find the instance [fade_rectangle]." );
        return;
      }
      this.fade_rectangle.posY = this.camera.posY + this.camera.offsetY;
      if ( !this.top_rectangle ) {
        this.reportError( "`Set Instance X` block could not find the instance [top_rectangle]." );
        return;
      }
      this.top_rectangle.posX = this.camera.posX + this.camera.offsetX;
      if ( !this.top_rectangle ) {
        this.reportError( "`Set Instance Y` block could not find the instance [top_rectangle]." );
        return;
      }
      this.top_rectangle.posY = this.camera.posY + this.camera.offsetY;
      if ( !this.bottom_rectangle ) {
        this.reportError( "`Set Instance X` block could not find the instance [bottom_rectangle]." );
        return;
      }
      this.bottom_rectangle.posX = this.camera.posX + this.camera.offsetX;
      if ( !this.bottom_rectangle ) {
        this.reportError( "`Set Instance Y` block could not find the instance [bottom_rectangle]." );
        return;
      }
      this.bottom_rectangle.posY = (this.camera.posY + this.camera.offsetY + this.camera.height) - 150;
      if ( !this.textfield ) {
        this.reportError( "`Set Instance X` block could not find the instance [textfield]." );
        return;
      }
      this.textfield.posX = this.camera.posX + this.camera.offsetX + this.camera.width / 2 + this.text_offset;
      if ( !this.textfield ) {
        this.reportError( "`Set Instance Y` block could not find the instance [textfield]." );
        return;
      }
      this.textfield.posY = ((this.errorCheckNotNull12( this.bottom_rectangle, this.owner, "`Get Position of Instance` block could not find an instance named [bottom_rectangle].")).posY + 150) - 95 * this.camera.scaleY;
      if (this.cinematic_on) {
        if ( !this.top_rectangle ) {
          this.reportError( "`Set Instance Scale` block could not find the instance [top_rectangle]." );
          return;
        }
        this.top_rectangle.scaleY = Math.min(Math.max((this.errorCheckNotNull13( this.top_rectangle, this.owner, "`Get scale of Instance` block could not find an instance named [top_rectangle].")).scaleY * 100 + 2, 0), 100) / 100;
        if ( !this.bottom_rectangle ) {
          this.reportError( "`Set Instance Scale` block could not find the instance [bottom_rectangle]." );
          return;
        }
        this.bottom_rectangle.scaleY = (this.errorCheckNotNull14( this.top_rectangle, this.owner, "`Get scale of Instance` block could not find an instance named [top_rectangle].")).scaleY;
        if ((this.errorCheckNotNull15( this.top_rectangle, this.owner, "`Get scale of Instance` block could not find an instance named [top_rectangle].")).scaleY == 1) {
          if (this.text_offset > 0) {
            this.text_acceleration = this.text_acceleration * 1.02;
            this.text_offset = this.text_offset - this.text_acceleration;
          } else if (this.text_offset < 0) {
            this.text_offset = 0;
          }
          this.delayed_event = this.scene.time.delayedCall( 4000, function() {
            if ( !this.owner || this.owner.exists === false ) {
              return;
            }
              if (this.cinematic_on) {
              this.text_acceleration = 5;
              this.cinematic_on = false;
            }
          }, null, this );
        }
      } else if (!this.cinematic_on) {
        if (this.text_offset <= 0 && this.text_offset > -1000) {
          this.text_acceleration = this.text_acceleration * 1.05;
          this.text_offset = this.text_offset - this.text_acceleration;
        }
        if (this.text_offset < -500) {
          if ((this.errorCheckNotNull16( this.top_rectangle, this.owner, "`Get scale of Instance` block could not find an instance named [top_rectangle].")).scaleY != 0) {
            if ( !this.top_rectangle ) {
              this.reportError( "`Set Instance Scale` block could not find the instance [top_rectangle]." );
              return;
            }
            this.top_rectangle.scaleY = Math.min(Math.max((this.errorCheckNotNull17( this.top_rectangle, this.owner, "`Get scale of Instance` block could not find an instance named [top_rectangle].")).scaleY * 100 - 4, 0), 100) / 100;
            if ( !this.bottom_rectangle ) {
              this.reportError( "`Set Instance Scale` block could not find the instance [bottom_rectangle]." );
              return;
            }
            this.bottom_rectangle.scaleY = (this.errorCheckNotNull18( this.top_rectangle, this.owner, "`Get scale of Instance` block could not find an instance named [top_rectangle].")).scaleY;
          }
        }
      }
    }

    executeMessageplayer_dead () {
      // Executed when the message 'player dead' is received.
      this.player_dead = true;
      if ( !this.bottom_rectangle ) {
        this.reportError( "`Set Instance Visibility` block could not find the instance [bottom_rectangle]." );
        return;
      }
      this.bottom_rectangle.visible = false;
      if ( !this.top_rectangle ) {
        this.reportError( "`Set Instance Visibility` block could not find the instance [top_rectangle]." );
        return;
      }
      this.top_rectangle.visible = false;
      if ( !this.textfield ) {
        this.reportError( "`Set Instance Visibility` block could not find the instance [textfield]." );
        return;
      }
      this.textfield.visible = false;
      this.delayed_event3 = this.scene.time.delayedCall( 2000, function() {
        if ( !this.owner || this.owner.exists === false ) {
          return;
        }
          this.fade_out = true;
        this.delayed_event2 = this.scene.time.delayedCall( 2000, function() {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
            this.player_dead = false;
          this.fade_out = false;
          this.fade_in = false;
          if ( !this.fade_rectangle ) {
            this.reportError( "`Set Instance Alpha` block could not find the instance [fade_rectangle]." );
            return;
          }
          this.fade_rectangle.alpha = 0;
          if ( !this.bottom_rectangle ) {
            this.reportError( "`Set Instance Visibility` block could not find the instance [bottom_rectangle]." );
            return;
          }
          this.bottom_rectangle.visible = true;
          if ( !this.top_rectangle ) {
            this.reportError( "`Set Instance Visibility` block could not find the instance [top_rectangle]." );
            return;
          }
          this.top_rectangle.visible = true;
          if ( !this.textfield ) {
            this.reportError( "`Set Instance Visibility` block could not find the instance [textfield]." );
            return;
          }
          this.textfield.visible = true;
          this.camera.scaleX = 1;
          this.camera.scaleY = this.camera.scaleX;
          this.camera.centerOn( this.owner.x, this.owner.y );
        }, null, this );
      }, null, this );
    }

    checkScene( message ) {
      if ( !this.scene.add ) {
        this.game.reportError( message, message, 'SCRIPT ERROR' );
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

    onMessageReceived ( name, message ) {

      if ( message === 'cinematicText' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagecinematicText();
      }

      if ( message === 'player dead' ) {
        this.executeMessageplayer_dead();
      }

    }

    onLevelStart2() {
      this.player = this.scene.getChildrenByTag( 'player' )[ 0 ];
      this.scene.sys.displayList.bringToTop( this.fade_rectangle );

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

  }
);