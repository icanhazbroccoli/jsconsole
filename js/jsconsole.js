var JSConsole = new Class( {

  options: {
    history_storage_key: "jsconsole_history",
    max_history_length: 100,
    sl: "\0"
  },
  
  initialize: function( options ) {
    this.options = Object.merge( this.options, options );
    this.commandPool = {};
    this.sl = this.options.sl;
    this.prompt = this.options.prompt;
    this.ui = this.options.ui;
    var self = this;
    this.initHistory();
    this.ui.addEvent( "keydown", function( e ) {
      self.keyPressed.call( self, e )
    });
    this.pprompt( true );
    this.bindSlideDown();
    this.registerDefaultCommands();
  },

  initHistory: function() {
    this.history = [];
    var tmp;
    var key = this.options.history_storage_key;
    if ( localStorage !== undefined ) {
      if ( localStorage[ key ] != undefined ) {
        try {
          tmp = JSON.parse(
            localStorage[ key ]
          );
          if ( tmp instanceof Array ) {
            this.history = tmp;
          }
        } catch ( e ) {
        }
      }
    }
  },

  registerCommand: function( command ) {
    this.commandPool[ command.name ] = command;
    command.setTerminal( this );
  },

  pprompt: function( nofocus ) {
    if ( nofocus == undefined ) nofocus = false;
    if ( this.ui.value.search( this.sl ) != -1 ) {
      this.ui.value += "\n";
    }
    this.ui.value += this.prompt + this.sl;
    if ( !nofocus ) {
      this.setCaretPosition( this.ui.value.length );
      this.ui.scrollTop = this.ui.scrollHeight;
    }
  },

  getInput: function() {
    return this.ui.value.substring(
      this.searchLast( this.ui.value, this.sl ) + 1,
      this.ui.value.length
    );
  },

  searchLast: function( str, reg ) {
    res = -1;
    chunk = 0;
    while ( ( res = str.search( reg ) ) != -1 ) {
      res += 1
      chunk += res;
      str = str.substring( res, str.length );
    }
    return res + chunk;
  },

  keyPressed: function( e ) {
    var input = this.getInput();
    var self = this;
    if ( this.ui.selectionStart <=
      this.searchLast( this.ui.value, "\0" ) ) {
      e.stop();
      return;
    }
    switch( e.code ) {
      // enter
      case 13:
        e.stop();
        this.proceed( input, function() {
          self.pprompt.call( self );
        } );
        break;
      // backspace
      case 8:
        if ( input == "" )
          e.stop();
        break;
      case 75:
        // ⌘ + K || Ctrl + K
        if ( e.meta == true || e.control == true ) {
          e.stop();
          this.ui.value = "";
          this.pprompt();
          this.cout( input );
        }
        break;
      case 67:
        // Ctrl + C
        if ( e.control == true ) {
          this.cout( "^C" );
          this.resetHistoryIndex();
          e.stop();
          this.pprompt();
        }
        break;
      case 37:
      //case 38:
        if ( e.meta == true || e.control == true ) {
          e.stop();
          break;
        }
        break;
      case 38:
        e.stop();
        this.historySearch( -1 );
        break;
      case 40:
        e.stop();
        this.historySearch( 1 );
        break;
      case 46:
        e.stop();
        break;
      case 9:
        this.hint( input );
        e.stop();
        break;
      default:
        break;
    }
  },

  proceed: function( cmd, cb ) {
    if ( cmd == "" ) {
      cb();
      return;
    }
    this.pushHistory( cmd );
    this.resetHistoryIndex();
    var argv = cmd.split( " " );
    var command = argv[ 0 ];
    var argc = argv.slice( 1 );
    if ( this.commandPool[ command ] === undefined ) {
      command = null;
    }
    this.commandPool[ command ].exec( argc, cb );
  },
  
  pushHistory: function( cmd ) {
    this.history.push( cmd );
    if ( this.history.length > this.options.max_history_length ) {
      this.history = this.history.slice(
        this.history.length - this.options.max_history_length,
        this.options.max_history_length
      );
    }
    localStorage[ this.options.history_storage_key ] =
      JSON.stringify( this.history );
  },

  hint: function( chunk ) {
    if ( chunk == "" ) return;
    var keys = Object.keys( this.commandPool );
    var to_prompt = [];
    Object.each( keys, function( obj ) {
      if ( obj.search( chunk ) === 0 ) {
        to_prompt.push( obj );
      }
    } );
    if ( to_prompt.length == 0 ) return;
    if ( to_prompt.length == 1 ) {
      this.cout( to_prompt[ 0 ].substring( chunk.length,
        to_prompt[ 0 ].length ) );
      return;
    }
    this.cout( "\n" + to_prompt.join( "\t" ) );
    this.pprompt();
    this.cout( chunk );
  },

  historySearch: function( step ) {
    if ( this.history_index === undefined ) this.resetHistoryIndex();
    if ( this.history_index === null ) {
      this.history_index = this.history.length;
      this.last_input = this.getInput();
    }
    var new_index = this.history_index + step;
    if ( new_index >= 0 && new_index < this.history.length ) {
      this.history_index = new_index;
      this.replaceInputWith( this.history[ this.history_index ] );
    } else if ( new_index == this.history.length ) {
      this.replaceInputWith( this.last_input || "" );
    }
  },

  resetHistoryIndex: function() {
    this.history_index = null;
  },

  replaceInputWith: function( cmd ) {
    var last_pos = this.searchLast( this.ui.value, this.sl ) + 1;
    this.ui.value = this.ui.value.substring( 0, last_pos ) + cmd;
  },

  cout: function( v ) {
    this.ui.value += v;
  },

  // http://stackoverflow.com/questions/512528/set-cursor-position-in-html-textbox
  // thx!
  setCaretPosition: function ( caretPos ) {
    var elem = this.ui;

    if ( elem.createTextRange ) {
      var range = elem.createTextRange();
      range.move( 'character', caretPos );
      range.select();
    } else {
      elem.focus();
      if ( elem.selectionStart !== undefined ) {
        elem.setSelectionRange( caretPos, caretPos );
      }
    }
  },

  bindSlideDown: function() {
    var _parent = this.ui.getParent();
    _parent.getElements( ".swiper" )
      .addEvent( "click", function( e ) {
        e.stop();
        _parent.toggleClass( "collapsed" );
      } );
  },
  
  focus: function() {
    this.ui.focus();
    this.setCaretPosition( this.ui.value.length );
  },
  
  registerDefaultCommands: function() {
    this.registerCommand( new NotFoundCommand() );
    this.registerCommand( new ManCommand() );
  }
  
} );