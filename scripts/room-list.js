Phaserfroot.PluginManager.register(
  "RoomList",
  class RoomList extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "RoomList",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.owner.properties.onUpdate( this.onMessageReceived, this, "_messaging_");
      this.scene.input.on( "pointerdown", this.onStageTouch2, this );


      // Initialize properties from parameters.
      this.value = instanceProperties[ "value" ];
      this.list_of_room_buttons = instanceProperties[ "list of room buttons" ];
      this.server_list_button = ( typeof instanceProperties[ "server list button" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "server list button" ], true ) : null;
      this.textfield = ( typeof instanceProperties[ "textfield" ] !== "undefined" ) ? this.scene.getChildById( instanceProperties[ "textfield" ], true ) : null;
      this.music = instanceProperties[ "music" ];
      this.click_sound_effect = instanceProperties[ "click sound effect" ];


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
      this.owner.removeListener( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      if ( this.delayed_event ) this.delayed_event.remove();
      if ( this.delayed_event2 ) this.delayed_event2.remove();
      this.scene.input.off( "pointerdown", this.onStageTouch2, this );

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.tags.add( 'room list UI' );
      this.owner.components.getByName( "TextAutomation" )[ 0 ].text = 'Waiting for other players... ⏳';
      this.list_of_room_buttons = [];
    }

    executeMessagecould_not_connect () {
      // Executed when the message 'could not connect' is received.
      this.owner.components.getByName( "TextAutomation" )[ 0 ].text = 'Could not connect 🔌';
    }

    executeMessagegiveRoom () {
      // Executed when the 'giveRoom' is received.
      // When the other players tell us that they are hosts, then update our list of servers!
      // Remember: the data here is a list from other players with
      // 1. addServer 2. theirPlayerID 3. theirServerName 4. numberOfPlayers
      // This tells the server list UI object in this level to add a server to the displayed list of buttons
      this.owner.visible = false;
      this.checkScene( "Create Text block did not work, likely because the level changed before it was triggered.\n\nSuggestion: check whether the level has changed before running this section of code." );
      this.textfield = this.scene.addText( { x: 0, y: 0, textText: ([this.value[2],' | ',this.value[3],' players | 👉 JOIN 👈'].join('')) } );
      if ( !this.textfield ) {
        this.reportError( "`Set Key` block could not find the instance [textfield]." );
        return;
      }
      this.textfield.properties.set( 'hostPlayerID',(this.value[1]) );
      if ( !this.list_of_room_buttons ) {
        this.reportError( "`Add to List` block could not find a list called [list_of_room_buttons]." );
        return;
      }
      this.list_of_room_buttons.push( this.textfield );
      if ( !this.textfield ) {
        this.reportError( "`Set Text Numeric` block could not find an instance called [textfield]." );
        return;
      }
      if ( !this.textfield.setFontSize ) {
        this.reportError( "`Set Text Numeric` block could not find text properties on an instance called [textfield]." );
        return;
      }
      this.textfield.setFontSize( Number.parseInt( /(\d*\.\d*|\d*)/.exec( this.owner.style.fontSize )[ 0 ] ) );
      if ( !this.textfield ) {
        this.reportError( "`Set Text Numeric` block could not find an instance called [textfield]." );
        return;
      }
      if ( !this.textfield.setWordWrapWidth ) {
        this.reportError( "`Set Text Numeric` block could not find text properties on an instance called [textfield]." );
        return;
      }
      this.textfield.setWordWrapWidth( 960 );
      if ( !this.textfield ) {
        this.reportError( "`Set Text Numeric` block could not find an instance called [textfield]." );
        return;
      }
      if ( !this.textfield.setLineSpacing ) {
        this.reportError( "`Set Text Numeric` block could not find text properties on an instance called [textfield]." );
        return;
      }
      this.textfield.setLineSpacing( 32 );
      if ( !this.textfield ) {
        this.reportError( "`Set Text Colour` block could not find an instance called [textfield]." );
        return;
      }
      if ( !this.textfield.setColor ) {
        this.reportError( "`Set Text Colour` block could not find text color information on an instance called [textfield]." );
        return;
      }
      this.textfield.setColor( this.owner.style.color.replace( /^0x/, "#" ) );
      if ( !this.textfield ) {
        this.reportError( "`Set Text Weight` block could not find an instance called [textfield]." );
        return;
      }
      if ( !this.textfield.setFontStyle ) {
        this.reportError( "`Set Text Weight` block could not find font information on an instance called [textfield]." );
        return;
      }
      this.textfield.setFontStyle( "800" );
      if ( !this.textfield ) {
        this.reportError( "`Set Text Family` block could not find an instance called [textfield]." );
        return;
      }
      if ( !this.textfield.setFontFamily ) {
        this.reportError( "`Set Text Family` block could not find font information on an instance called [textfield]." );
        return;
      }
      this.textfield.setFontFamily( "cursive" );
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
      if ( !this.textfield ) {
        this.reportError( "`Set Instance CenterX` block could not find the instance [textfield]." );
        return;
      }
      this.textfield.x = this.owner.x;
      // Gotta reposition all server buttons so they don't overlap!
      var button_y_position = this.owner.y;
      var server_list_button_list = this.list_of_room_buttons;
      for (var server_list_button_index in server_list_button_list) {
        this.server_list_button = server_list_button_list[server_list_button_index];
        if ( !this.server_list_button ) {
          this.reportError( "`Set Instance CenterY` block could not find the instance [server_list_button]." );
          return;
        }
        this.server_list_button.y = button_y_position;
        var button_y_position = button_y_position + 40;
      }
    }

    executeMessageaddPlayerToRoom () {
      // Executed when the 'addPlayerToRoom' is received.
      this.game.GLOBAL_VARIABLES.hostPlayerID = this.value[0];
      this.game.GLOBAL_VARIABLES.hostRoomName = this.value[1];
      this.game.GLOBAL_VARIABLES.levelName = this.value[2];
      this.scene.messageExternal( 'joinRoom', this.game.GLOBAL_VARIABLES.hostRoomName );
      if (this.game.GLOBAL_VARIABLES.levelName == 'Level 1') {
        if ( 1 <= (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 2) && (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 2) <= this.game.levelManager.levels.length ) {
          this.game.levelManager.switchTo( (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 2) );
        } else {
          ( function() {
            var message = "`Go to level` block could not go to level number (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 2). Level numbers start at 1 and go up to the total number of levels in your game (" + this.game.levelManager.levels.length + ").";
            this.game.reportError( message, message, "SCRIPT ERROR" );
          } ).bind( this )();
        }
      } else if (this.game.GLOBAL_VARIABLES.levelName == 'Level 2') {
        if ( 1 <= (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 3) && (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 3) <= this.game.levelManager.levels.length ) {
          this.game.levelManager.switchTo( (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 3) );
        } else {
          ( function() {
            var message = "`Go to level` block could not go to level number (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 3). Level numbers start at 1 and go up to the total number of levels in your game (" + this.game.levelManager.levels.length + ").";
            this.game.reportError( message, message, "SCRIPT ERROR" );
          } ).bind( this )();
        }
      } else if (this.game.GLOBAL_VARIABLES.levelName == 'Level 3') {
        if ( 1 <= (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 4) && (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 4) <= this.game.levelManager.levels.length ) {
          this.game.levelManager.switchTo( (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 4) );
        } else {
          ( function() {
            var message = "`Go to level` block could not go to level number (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 4). Level numbers start at 1 and go up to the total number of levels in your game (" + this.game.levelManager.levels.length + ").";
            this.game.reportError( message, message, "SCRIPT ERROR" );
          } ).bind( this )();
        }
      }
    }

    onLevelStart2() {
      // getRooms messages every player in the "RoomHosts" room
      // and requests their individual room information
      this.scene.messageExternal( 'getRooms' );
      // Each host receives this in the host code in the next level
      this.load_music_and_sounds(  );
      this.play_music_once_it_loads(  );

    }

    load_music_and_sounds (  ) {
      this.scene.components.getByName( "SoundManager" )[ 0 ].volume = ( 10/ 100 )
      this.owner.scene.load.audio( 'music', 'Juhani-Junkala-_Retro-Game-Music-Pack_-Level-2.mp3' );
      this.owner.scene.load.start();
      this.owner.scene.load.audio( 'sndNext', 'sndNext.mp3' );
      this.owner.scene.load.start();
      this.owner.scene.load.audio( 'sndPrev', 'sndPrev.mp3' );
      this.owner.scene.load.start();
      this.owner.scene.load.audio( 'sndJump', 'sndJump.mp3' );
      this.owner.scene.load.start();
      this.owner.scene.load.audio( 'sndDeathPlayer', 'sndDeathPlayer.mp3' );
      this.owner.scene.load.start();
      this.owner.scene.load.audio( 'sndDeathBass', 'sndDeathBass.mp3' );
      this.owner.scene.load.start();
      this.owner.scene.load.audio( 'sndHurt', 'sndHurt.mp3' );
      this.owner.scene.load.start();
      this.owner.scene.load.audio( 'sndFire', 'sndFire.mp3' );
      this.owner.scene.load.start();
      this.owner.scene.load.audio( 'sndFireBass', 'sndFireBass.mp3' );
      this.owner.scene.load.start();
      this.owner.scene.load.audio( 'sndExplosion', 'sndExplosion.mp3' );
      this.owner.scene.load.start();
    }

    onMessageReceived ( name, message ) {

      if ( message === 'could not connect' ) {
        this.executeMessagecould_not_connect();
      }

      if ( message === 'giveRoom' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessagegiveRoom();
      }

      if ( message === 'addPlayerToRoom' ) {
        this.value = this.owner.properties.get( "_messaging-value_" );
        this.executeMessageaddPlayerToRoom();
      }

    }

    play_music_once_it_loads (  ) {
      if (String(this.owner.scene.game.cache.audio.get( 'music' ) ? 'music' : null) == 'null') {
        this.delayed_event = this.scene.time.delayedCall( 500, function() {
          if ( !this.owner || this.owner.exists === false ) {
            return;
          }
            this.play_music_once_it_loads(  );
        }, null, this );
      } else {
      }
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

    errorCheckNotNull2( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    instContains ( ins, x, y ) {
      if ( !ins || !ins.getHitbox ) return false;
      var hitbox = ins.getHitbox();
      return hitbox.contains( x, y );
    }

    errorCheckNotNull3( input, backup, message ) {
      if( !input ) {
        reportError( message );
        return backup;
      }
      return input;
    }

    onStageTouch2 ( pointer ) {
      var pointer = pointer;
      var server_list_button_list2 = this.list_of_room_buttons;
      for (var server_list_button_index2 in server_list_button_list2) {
        this.server_list_button = server_list_button_list2[server_list_button_index2];
        if (this.instContains( this.server_list_button, (this.errorCheckNotNull( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).x, (this.errorCheckNotNull2( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).y )) {
          var button_that_was_pressed = this.server_list_button;
          this.scene.messageExternal( 'sendToPlayer', [(this.errorCheckNotNull3( button_that_was_pressed, this.owner, "`Get Key on Instance` block could not find an instance called [button_that_was_pressed].")).properties.get( 'hostPlayerID' ), 'requestToJoinRoom', this.game.GLOBAL_VARIABLES.myName, this.game.GLOBAL_VARIABLES.myPlayerID] );
          if ( !button_that_was_pressed ) {
            this.reportError( "`Set Instance Alpha` block could not find the instance [button_that_was_pressed]." );
            return;
          }
          button_that_was_pressed.alpha = 0.2;
          this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndNext' ) ? 'sndNext' : null );
          this.delayed_event2 = this.scene.time.delayedCall( 200, function() {
            if ( !this.owner || this.owner.exists === false ) {
              return;
            }
              if ( !button_that_was_pressed ) {
              this.reportError( "`Set Instance Alpha` block could not find the instance [button_that_was_pressed]." );
              return;
            }
            button_that_was_pressed.alpha = 1;
          }, null, this );
        }
      }

    }

  }
);