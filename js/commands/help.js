var HelpCommand = new Class( {
  Extends: Command,
  name: "help",
  exec: function( argc, cb ) {
    this.cout( "\nJS toy terminal" );
    this.cout( "\n\nCommands enabled:" );
    this.cout( "\n" + Object.keys( this.terminal.commandPool ).filter( function( i ) {
      return ( ( new String( i ) ).toString() != "null" );
    } ).join( "\t" ) );
    this.cout( "\n\nShortkeys provided:" );
    this.cout( "\n* ⌘+K, Ctrl+K — purge output buffer" );
    this.cout( "\n* Ctrl + C — abort current command" );
    this.cout( "\n\nSuggest command input using tab key" );
    this.cout( "\nMost of commands has manual page using man [command]" );
    this.cout( "\n\nEnjoy! )))" );
    this.parent( argc, cb );
  },
  help: function() {
    this.cout( "\nHelp command:" );
    this.cout( "\nJSConsole help brief" );
  }
} );