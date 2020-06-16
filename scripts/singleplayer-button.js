Phaserfroot.PluginManager.register(
  "SingleplayerButton",
  class SingleplayerButton extends Phaserfroot.Component {
    constructor( target, instanceProperties ) {
      super( {
        name: "SingleplayerButton",
        owner: target,
      } );
      this.instanceProperties = instanceProperties;
      this.scene = target.scene;
      this.game = target.scene.game;

      this.owner.once( "levelSwitch", this.destroy, this );

      // Attach custom event listeners.
      this.owner.on( this.owner.EVENTS.LEVEL_START, this.onLevelStart2, this );
      this.scene.input.on( "pointerdown", this.onStageTouch2, this );


      // Initialize properties from parameters.
      this.pressed = instanceProperties[ "pressed" ];
      this.click_sound_effect = instanceProperties[ "click sound effect" ];


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
      this.scene.input.off( "pointerdown", this.onStageTouch2, this );

    }

    // CUSTOM METHODS

    onCreate () {
      // Executed when this script is initially created.
      this.owner.alpha = 1;
      this.pressed = false;
    }

    EVENTS_UPDATE () {
      // Executed every frame.
      if (!this.pressed) {
        if (this.instContains( this.owner, (this.scene.input.manager.mousePointer.x + this.camera.posX), (this.scene.input.manager.mousePointer.y + this.camera.posY) )) {
          this.owner.alpha = 1;
        } else {
          this.owner.alpha = 0.8;
        }
      }
    }

    onLevelStart2() {
      this.load_music_and_sounds(  );

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

    onStageTouch2 ( pointer ) {
      var pointer = pointer;
      if (this.instContains( this.owner, (this.errorCheckNotNull( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).x, (this.errorCheckNotNull2( pointer, this.scene.input.manager.activePointer, "`Get X/Y of Pointer` block could not find a pointer named [pointer].")).y )) {
        if (!this.pressed) {
          this.pressed = true;
          this.game.GLOBAL_VARIABLES.myPlayerID = '0';
          this.game.GLOBAL_VARIABLES.myName = 'YOU';
          this.game.GLOBAL_VARIABLES.myRoomName = 'SINGLEPLAYER';
          this.game.GLOBAL_VARIABLES.hostRoomName = this.game.GLOBAL_VARIABLES.myRoomName;
          this.game.GLOBAL_VARIABLES.hostPlayerID = this.game.GLOBAL_VARIABLES.myPlayerID;
          this.owner.alpha = 0.2;
          var tracker = { k: 5 };
          var base = this.camera.offsetY;
          this.scene.tweens.add( {
            targets: tracker,
            props: { k : 0 },
            ease: "Expo.easeOut",
            duration: 0.5 * 1000,
            onUpdate:
              function() {
                this.camera.offsetY = base + tracker.k * Math.sin( this.scene.time.now * 60 / 1000 );
              }.bind( this ),
            onComplete: function() {
              this.camera.offsetY = 0;}.bind( this ) } );
          this.scene.components.getByName( "SoundManager" )[ 0 ].playEffect( this.owner.scene.game.cache.audio.get( 'sndNext' ) ? 'sndNext' : null );
          this.delayed_event = this.scene.time.delayedCall( 200, function() {
            if ( !this.owner || this.owner.exists === false ) {
              return;
            }
              this.owner.alpha = 1;
          }, null, this );
          this.delayed_event2 = this.scene.time.delayedCall( 400, function() {
            if ( !this.owner || this.owner.exists === false ) {
              return;
            }
              if ( 1 <= (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 2) && (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 2) <= this.game.levelManager.levels.length ) {
              this.game.levelManager.switchTo( (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 2) );
            } else {
              ( function() {
                var message = "`Go to level` block could not go to level number (( this.game.levelManager.levels.indexOf( this.scene ) + 1 ) + 2). Level numbers start at 1 and go up to the total number of levels in your game (" + this.game.levelManager.levels.length + ").";
                this.game.reportError( message, message, "SCRIPT ERROR" );
              } ).bind( this )();
            }
          }, null, this );
        }
      }

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

  }
);