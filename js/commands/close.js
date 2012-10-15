var CloseCommand = new Class( {
  
  Extends: Command,
  
  name: "close",
  
  initialize: function( options ) {
    var self = this;
    this.parent( options );
    document.addEvent( "keydown", function( e ) {
      if ( e.code == 192 ) {
        e.stop();
        self.terminal.callRegisteredHandlers( "show" );
        self.terminal.focus();
      } else if ( e.code == 27 ) {
        e.stop();
        self.terminal.callRegisteredHandlers( "hide" );
      }
    } );
  },
  
  exec: function( argc, cb ) {
    this.terminal.callRegisteredHandlers( "hide" );
    this.parent( argc, cb );
    this.terminal.blur();
  },
  
  help: function() {
    this.cout( "\nClose this terminal window." );
    this.cout( "\nShortcut: <Ecs>." );
    this.cout( "\nTo open back this console type <`>." );
  }
} );