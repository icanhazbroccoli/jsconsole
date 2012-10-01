var AsdasdCommand = new Class( {
  Extends: Command,
  name: "asdasd",
  exec: function( argc, cb ) {
    this.cout( "\nНу, кстати, почему бы и нет!" );
    this.parent( argc, cb );
  }
} );

var ExclamationCommand = new Class( {
  Extends: Command,
  name: "!",
  exec: function( argc, cb ) {
    this.cout( "\nСерьезно?" );
    this.parent( argc, cb );
  }
} );