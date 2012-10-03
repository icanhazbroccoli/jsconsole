var ListingCommand = new Class( {
  
  Extends: Command,
  
  initialize: function( options ) {
    this.parent( options );
    if ( this.options.name === undefined ) {
      throw "Listing command couldn't been initialized without command name.";
    }
    this.name = this.options.name;
  },
  
  exec: function( argc, cb ) {
    var elements;
    var response = "\n";
    
    if ( this.options.elements instanceof Array ) {
      elements = this.options.elements;
    } else if ( typeof( this.options.elements ) == "string" ) {
      elements = this.options.elements.split( ";" );
    }
    
    if ( this.argGiven( argc, "-l" ) ) {
      response += elements.join( "\n" );
    } else {
      response += elements.join( "\t" );
    }
    this.cout( response );
    this.parent( argc, cb );
  }
} );