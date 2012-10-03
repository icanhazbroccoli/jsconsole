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
    var self = this;
    
    if ( this.options.elements instanceof Array ) {
      elements = this.options.elements;
    } else if ( typeof( this.options.elements ) == "string" ) {
      elements = this.options.elements.split( /\s*;\s*/g );
    }
    
    if ( this.options.title != null ) {
      this.cout( "\n  " + this.options.title );
    }
    
    if ( this.argGiven( argc, "-l" ) ) {
      elements.each( function( el ) {
        self.cout( "\n    " + el );
      } );
    } else {
      this.cout( "\n" + elements.join( "\t" ) )
    }

    this.parent( argc, cb );
  }
} );