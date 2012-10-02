var NotFoundCommand = new Class( {
  Extends: Command,
  name: null,
  exec: function( argc, cb ) {
    this.cout( "\ncommand not found" );
    this.parent( argc, cb );
  }
} );