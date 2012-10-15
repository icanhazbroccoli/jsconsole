var ManCommand = new Class( {
  
  Extends: Command,
  
  name: "man",
  
  exec: function( argc, cb ) {
    if ( argc.length < 1 ) {
      this.help();
    } else {
      var cmd = this.terminal.commandPool[ argc[ 0 ] ];
      if ( cmd !== undefined ) {
        cmd.help();
      } else {
        this.cout( "\n" + argc[ 0 ] + ": command not found. Try enter help↲ for usage brief." );
      }
    }
    this.parent( argc, cb );
  },
  
  help: function() {
    this.cout( "\nman command:" );
    this.cout( "\nProvides help info about commands available." );
    this.cout( "\nUsage: man <command>" );
  }
} );