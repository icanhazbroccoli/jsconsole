var ExclamationCommand = new Class( {
  Extends: Command,
  
  name: "!!",
  
  exec: function( argc, cb ) {
    var cmd = this.terminal.history[ this.terminal.history.length - 1 ];
    if ( !cmd ) {
      this.cout( "\nNothing to do. Omitting." );
      this.parent( argc, cb );
      return;
    }
    this.terminal.proceed( cmd, cb );
  },

  help: function() {
    this.cout( "\n!! repeats last command." );
  }
} );
