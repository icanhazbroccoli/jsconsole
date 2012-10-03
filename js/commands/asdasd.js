var AsdasdCommand = new Class( {
  Extends: Command,
  name: "asdasd",
  exec: function( argc, cb ) {
    this.cout( "\nWhy not!" );
    this.parent( argc, cb );
  }
} );

var ExclamationCommand = new Class( {
  Extends: Command,
  name: "!",
  exec: function( argc, cb ) {
    this.cout( "\nRly?" );
    this.parent( argc, cb );
  }
} );